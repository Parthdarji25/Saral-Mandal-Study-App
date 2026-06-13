"use client";

import { BookOpen, FileQuestion, Megaphone, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";

type AdminStats = {
  students: number;
  notes: number;
  testPapers: number;
  announcements: number;
};

type RecentItem = {
  id: string;
  label: string;
  created_at: string;
};

export function AdminDashboardLive() {
  const [stats, setStats] = useState<AdminStats>({
    students: 0,
    notes: 0,
    testPapers: 0,
    announcements: 0
  });
  const [recent, setRecent] = useState<RecentItem[]>([]);

  async function loadDashboard() {
    const supabase = createClient();

    const [students, notes, testPapers, announcements, recentNotes, recentPapers, recentAnnouncements] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("public_notes").select("id", { count: "exact", head: true }),
      supabase.from("test_papers").select("id", { count: "exact", head: true }),
      supabase.from("announcements").select("id", { count: "exact", head: true }),
      supabase.from("public_notes").select("id,title,created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("test_papers").select("id,title,created_at").order("created_at", { ascending: false }).limit(3),
      supabase.from("announcements").select("id,title,created_at").order("created_at", { ascending: false }).limit(3)
    ]);

    const error = students.error ?? notes.error ?? testPapers.error ?? announcements.error;
    if (error) {
      toast.error(error.message);
      return;
    }

    setStats({
      students: students.count ?? 0,
      notes: notes.count ?? 0,
      testPapers: testPapers.count ?? 0,
      announcements: announcements.count ?? 0
    });

    const items: RecentItem[] = [
      ...(recentNotes.data ?? []).map((item) => ({ id: `note-${item.id}`, label: `Note/PDF: ${item.title}`, created_at: item.created_at })),
      ...(recentPapers.data ?? []).map((item) => ({ id: `paper-${item.id}`, label: `Test paper: ${item.title}`, created_at: item.created_at })),
      ...(recentAnnouncements.data ?? []).map((item) => ({ id: `announcement-${item.id}`, label: `Announcement: ${item.title}`, created_at: item.created_at }))
    ]
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      .slice(0, 6);

    setRecent(items);
  }

  useEffect(() => {
    loadDashboard();

    const supabase = createClient();
    const channel = supabase
      .channel("admin-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "public_notes" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "test_papers" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">Live counts from Supabase.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total students" value={String(stats.students)} helper="From profiles" icon={Users} />
        <StatCard title="Total notes" value={String(stats.notes)} helper="Uploaded PDFs/notes" icon={BookOpen} />
        <StatCard title="Test papers" value={String(stats.testPapers)} helper="Shared with students" icon={FileQuestion} />
        <StatCard title="Announcements" value={String(stats.announcements)} helper="Published updates" icon={Megaphone} />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest uploads and announcements.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recent.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No admin activity yet.</div>
          ) : (
            recent.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
