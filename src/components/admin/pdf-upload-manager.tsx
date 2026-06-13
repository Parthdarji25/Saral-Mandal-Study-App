"use client";

import { FileUp, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";

type Subject = { id: string; name: string };
type Note = { id: string; title: string; pdf_url: string | null; subjects?: { name?: string | null } | null };

export function PdfUploadManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [subjectsResult, notesResult] = await Promise.all([
      supabase.from("subjects").select("id,name").order("name"),
      supabase.from("public_notes").select("id,title,pdf_url,subjects(name)").order("created_at", { ascending: false })
    ]);

    if (subjectsResult.error) toast.error(subjectsResult.error.message);
    if (notesResult.error) toast.error(notesResult.error.message);

    setSubjects(subjectsResult.data ?? []);
    setNotes((notesResult.data ?? []) as Note[]);

    if (!subjectId && subjectsResult.data?.[0]) {
      setSubjectId(subjectsResult.data[0].id);
    }
  }, [subjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function uploadPdf(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subjectId || !title.trim() || !file) {
      toast.error("Select subject, title, and PDF file.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Login as admin first.");
      setLoading(false);
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const path = `${subjectId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("study-pdfs").upload(path, file, {
      contentType: "application/pdf",
      upsert: false
    });

    if (uploadError) {
      toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from("study-pdfs")
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    if (signedError || !signedUrlData) {
      toast.error(signedError?.message ?? "Could not create PDF URL.");
      setLoading(false);
      return;
    }

    const { error: noteError } = await supabase.from("public_notes").insert({
      subject_id: subjectId,
      chapter_id: null,
      title: title.trim(),
      content: content.trim() || "PDF study material",
      pdf_url: signedUrlData.signedUrl,
      created_by: user.id
    });

    if (noteError) {
      toast.error(noteError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setContent("");
    setFile(null);
    await loadData();
    setLoading(false);
    toast.success("PDF uploaded and note saved.");
  }

  async function deleteNote(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("public_notes").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadData();
    toast.success("Uploaded note deleted.");
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Manage notes and PDFs</h1>
        <p className="mt-2 text-muted-foreground">Upload subject PDFs to Supabase Storage and save note records in `public_notes`.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            Upload subject PDF
          </CardTitle>
          <CardDescription>Requires admin role and the `study-pdfs` storage bucket from migration 002.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={uploadPdf}>
            <div className="grid gap-3">
              <select className="h-10 rounded-md border bg-background px-3 text-sm" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <Input placeholder="PDF title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea placeholder="Short note/description" value={content} onChange={(event) => setContent(event.target.value)} />
            <Input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded notes</CardTitle>
          <CardDescription>{notes.length} note records found.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {notes.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">No PDFs uploaded yet.</div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{note.title}</p>
                  <p className="text-sm text-muted-foreground">{note.subjects?.name ?? "Subject"}</p>
                </div>
                <div className="flex items-center gap-3">
                  {note.pdf_url ? (
                    <a href={note.pdf_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary">
                      Open PDF
                    </a>
                  ) : null}
                  <Button size="icon" variant="ghost" onClick={() => deleteNote(note.id)} aria-label="Delete uploaded note">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
