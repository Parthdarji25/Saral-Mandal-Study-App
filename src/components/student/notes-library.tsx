"use client";

import { Bookmark, Download, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { useSubjects } from "@/hooks/use-subjects";

type Note = {
  id: string;
  title: string;
  content: string;
  pdf_url: string | null;
  subject_id: string;
  subjects?: { name?: string | null } | Array<{ name?: string | null }> | null;
};

function firstJoin<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function NotesLibrary() {
  const { subjects } = useSubjects();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      const supabase = createClient();
      const notesResult = await supabase
        .from("public_notes")
        .select("id,title,content,pdf_url,subject_id,subjects(name)")
        .order("created_at", { ascending: false });

      if (notesResult.error) toast.error(notesResult.error.message);

      setNotes((notesResult.data ?? []) as Note[]);
      setLoading(false);
    }

    loadLibrary();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const subject = firstJoin(note.subjects)?.name ?? "";
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        subject.toLowerCase().includes(query);
      const matchesSubject = subjectId === "all" || note.subject_id === subjectId;

      return matchesSearch && matchesSubject && Boolean(subject);
    });
  }, [notes, search, subjectId]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Notes library</h1>
        <p className="mt-2 text-muted-foreground">Subjects and uploaded PDFs update live from admin.</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
            <option value="all">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Loading notes from Supabase...</CardContent>
        </Card>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No notes found. Upload PDFs from Admin &gt; Notes & PDFs.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes.map((note) => {
            const subject = firstJoin(note.subjects)?.name ?? "Subject";

            return (
              <Card key={note.id} className="interactive-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="secondary">{subject}</Badge>
                      <CardTitle className="mt-3">{note.title}</CardTitle>
                      <CardDescription>Downloadable subject PDF</CardDescription>
                    </div>
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{note.content}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Bookmark className="h-4 w-4" />
                      Bookmark
                    </Button>
                    {note.pdf_url ? (
                      <Button size="sm" asChild>
                        <a href={note.pdf_url} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4" />
                          PDF
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
