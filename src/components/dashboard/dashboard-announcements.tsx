"use client";

import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";

type Announcement = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnnouncements() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,description,created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      toast.error(error.message);
    } else {
      setAnnouncements(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
    const supabase = createClient();
    const channel = supabase
      .channel("student-announcements-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, loadAnnouncements)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          Announcements
        </CardTitle>
        <CardDescription>Latest updates from admin.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {loading ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No announcements yet.</div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-md border p-3">
              <p className="font-bold">{announcement.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{announcement.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(announcement.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
