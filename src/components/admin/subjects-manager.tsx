"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChapters } from "@/hooks/use-chapters";
import { createClient } from "@/lib/supabase/browser";

type SubjectRow = {
  id: string;
  name: string;
  description: string | null;
};

export function SubjectsManager() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chapterSubjectId, setChapterSubjectId] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const { chapters, refresh: refreshChapters } = useChapters();

  async function loadSubjects() {
    const supabase = createClient();
    const { data, error } = await supabase.from("subjects").select("id,name,description").order("name");

    if (error) {
      toast.error(error.message);
    } else {
      setSubjects(data ?? []);
    }
  }

  useEffect(() => {
    loadSubjects();
    const supabase = createClient();
    const channel = supabase
      .channel("admin-subjects-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "subjects" }, loadSubjects)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function createSubject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Enter subject name.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("subjects").insert({
      name: name.trim(),
      description: description.trim() || null
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setName("");
    setDescription("");
    await loadSubjects();
    toast.success("Subject created.");
  }

  async function deleteSubject(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadSubjects();
    toast.success("Subject deleted.");
  }

  async function createChapter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const number = Number(chapterNumber);

    if (!chapterSubjectId || !chapterTitle.trim() || !Number.isFinite(number) || number < 1) {
      toast.error("Select subject and enter valid chapter details.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("chapters").insert({
      subject_id: chapterSubjectId,
      title: chapterTitle.trim(),
      chapter_number: number
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setChapterNumber("");
    setChapterTitle("");
    await refreshChapters();
    toast.success("Chapter added.");
  }

  async function deleteChapter(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("chapters").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await refreshChapters();
    toast.success("Chapter deleted.");
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Manage subjects</h1>
        <p className="mt-2 text-muted-foreground">Live subjects from Supabase.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={createSubject}>
            <Input placeholder="Subject name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add chapter</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_120px_1fr_auto]" onSubmit={createChapter}>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={chapterSubjectId}
              onChange={(event) => setChapterSubjectId(event.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              min="1"
              placeholder="No."
              value={chapterNumber}
              onChange={(event) => setChapterNumber(event.target.value)}
            />
            <Input placeholder="Chapter title" value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} />
            <Button type="submit">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-3 p-4">
          {subjects.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No subjects found.</div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.description ?? "No description"}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => deleteSubject(subject.id)} aria-label="Delete subject">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 grid gap-2">
                  {chapters.filter((chapter) => chapter.subject_id === subject.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No chapters added.</p>
                  ) : (
                    chapters
                      .filter((chapter) => chapter.subject_id === subject.id)
                      .map((chapter) => (
                        <div key={chapter.id} className="flex items-center justify-between gap-3 rounded-md bg-secondary/50 px-3 py-2 text-sm">
                          <span>
                            <span className="font-bold">{chapter.chapter_number}.</span> {chapter.title}
                          </span>
                          <Button size="icon" variant="ghost" onClick={() => deleteChapter(chapter.id)} aria-label="Delete chapter">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
