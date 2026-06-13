"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";

type Announcement = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadAnnouncements() {
    const supabase = createClient();
    const { data, error } = await supabase.from("announcements").select("id,title,description,created_at").order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setAnnouncements(data ?? []);
    }
  }

  useEffect(() => {
    loadAnnouncements();
    const supabase = createClient();
    const channel = supabase
      .channel("admin-announcements-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, loadAnnouncements)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function createAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Enter title and description.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("announcements").insert({
      title: title.trim(),
      description: description.trim()
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    await loadAnnouncements();
    toast.success("Announcement published.");
  }

  async function deleteAnnouncement(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadAnnouncements();
    toast.success("Announcement deleted.");
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Manage announcements</h1>
        <p className="mt-2 text-muted-foreground">Create updates visible to students.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create announcement</CardTitle>
          <CardDescription>Saved in Supabase and visible to authenticated students.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={createAnnouncement}>
            <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Publish
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-3 p-4">
          {announcements.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No announcements yet.</div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-bold">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">{announcement.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(announcement.created_at).toLocaleString()}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteAnnouncement(announcement.id)} aria-label="Delete announcement">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
