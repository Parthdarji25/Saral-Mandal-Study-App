"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";
import { getCurrentUser } from "@/lib/supabase/auth";

type PersonalNote = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export function PersonalNotesManager() {
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  async function loadNotes() {
    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      setNotes([]);
      setUserEmail(null);
      setLoading(false);
      return;
    }

    setUserEmail(user.email ?? null);

    const { data, error } = await supabase
      .from("personal_notes")
      .select("id,title,content,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setNotes(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function createNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Add both title and content.");
      return;
    }

    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Login to this app first, then save notes.");
      return;
    }

    const { error } = await supabase.from("personal_notes").insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim()
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setTitle("");
    setContent("");
    await loadNotes();
    toast.success("Personal note saved to Supabase.");
  }

  async function deleteNote(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("personal_notes").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadNotes();
    toast.success("Note deleted.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h1 className="text-3xl font-black">Personal notes</h1>
        <p className="mt-2 text-muted-foreground">Private notes are saved in Supabase and protected by RLS.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {userEmail ? `Logged in as ${userEmail}` : "No app login session detected. Go to Login and sign in again."}
        </p>
        <div className="mt-6 grid gap-3">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">Loading notes...</CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">No personal notes yet. Create your first note.</CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>{new Date(note.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create personal note</CardTitle>
          <CardDescription>Saved to `personal_notes` under your logged-in user.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={createNote}>
            <Input placeholder="Note title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea
              placeholder="Write your revision points, formulas, doubts, or shortcuts..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <Button type="submit">Save note</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
