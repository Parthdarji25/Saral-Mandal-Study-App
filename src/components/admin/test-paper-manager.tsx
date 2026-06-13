"use client";

import { FileQuestion, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";

type Subject = { id: string; name: string };
type TestPaper = {
  id: string;
  title: string;
  paper_url: string | null;
  solution_url: string | null;
  subjects?: { name?: string | null } | Array<{ name?: string | null }> | null;
};

function firstJoin<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function uploadFile(file: File, folder: string) {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("test-papers").upload(path, file, {
    contentType: file.type || "application/pdf",
    upsert: false
  });

  if (error) throw error;

  const { data, error: signedError } = await supabase.storage.from("test-papers").createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signedError || !data) throw signedError ?? new Error("Could not create signed URL.");

  return data.signedUrl;
}

export function TestPaperManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [papers, setPapers] = useState<TestPaper[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [subjectsResult, papersResult] = await Promise.all([
      supabase.from("subjects").select("id,name").order("name"),
      supabase.from("test_papers").select("id,title,paper_url,solution_url,subjects(name)").order("created_at", { ascending: false })
    ]);

    if (subjectsResult.error) toast.error(subjectsResult.error.message);
    if (papersResult.error) toast.error(papersResult.error.message);

    setSubjects(subjectsResult.data ?? []);
    setPapers((papersResult.data ?? []) as TestPaper[]);

    if (!subjectId && subjectsResult.data?.[0]) {
      setSubjectId(subjectsResult.data[0].id);
    }
  }, [subjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function createPaper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subjectId || !title.trim() || !paperFile) {
      toast.error("Select subject, title, and test paper file.");
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

    try {
      const paperUrl = await uploadFile(paperFile, subjectId);
      const solutionUrl = solutionFile ? await uploadFile(solutionFile, `${subjectId}/solutions`) : null;

      const { error } = await supabase.from("test_papers").insert({
        subject_id: subjectId,
        title: title.trim(),
        description: description.trim() || null,
        paper_url: paperUrl,
        solution_url: solutionUrl,
        created_by: user.id
      });

      if (error) throw error;

      setTitle("");
      setDescription("");
      setPaperFile(null);
      setSolutionFile(null);
      await loadData();
      toast.success("Test paper uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload test paper.");
    } finally {
      setLoading(false);
    }
  }

  async function deletePaper(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("test_papers").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadData();
    toast.success("Test paper deleted.");
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Test papers</h1>
        <p className="mt-2 text-muted-foreground">Upload test papers, solutions, or shared practice material for students.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            Upload test paper
          </CardTitle>
          <CardDescription>Students can download uploaded files from the Test Papers section.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={createPaper}>
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Test paper PDF</label>
              <Input type="file" accept="application/pdf" onChange={(event) => setPaperFile(event.target.files?.[0] ?? null)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Solution PDF optional</label>
              <Input type="file" accept="application/pdf" onChange={(event) => setSolutionFile(event.target.files?.[0] ?? null)} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded test papers</CardTitle>
          <CardDescription>{papers.length} shared files found.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {papers.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">No test papers uploaded yet.</div>
          ) : (
            papers.map((paper) => (
              <div key={paper.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{paper.title}</p>
                  <p className="text-sm text-muted-foreground">{firstJoin(paper.subjects)?.name ?? "General"}</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-primary">
                  {paper.paper_url ? (
                    <a href={paper.paper_url} target="_blank" rel="noreferrer">
                      Paper
                    </a>
                  ) : null}
                  {paper.solution_url ? (
                    <a href={paper.solution_url} target="_blank" rel="noreferrer">
                      Solution
                    </a>
                  ) : null}
                  <Button size="icon" variant="ghost" onClick={() => deletePaper(paper.id)} aria-label="Delete test paper">
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
