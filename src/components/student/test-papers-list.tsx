"use client";

import { Download, FileQuestion, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";

type TestPaper = {
  id: string;
  title: string;
  description: string | null;
  paper_url: string | null;
  solution_url: string | null;
  subjects?: { name?: string | null } | Array<{ name?: string | null }> | null;
};

function firstJoin<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function TestPapersList() {
  const [papers, setPapers] = useState<TestPaper[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPapers() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("test_papers")
        .select("id,title,description,paper_url,solution_url,subjects(name)")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        setPapers((data ?? []) as TestPaper[]);
      }

      setLoading(false);
    }

    loadPapers();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return papers;
    return papers.filter((paper) => {
      const subject = firstJoin(paper.subjects)?.name ?? "";
      return (
        paper.title.toLowerCase().includes(query) ||
        (paper.description ?? "").toLowerCase().includes(query) ||
        subject.toLowerCase().includes(query)
      );
    });
  }, [papers, search]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Test papers</h1>
        <p className="mt-2 text-muted-foreground">Download shared test papers, solutions, and practice material uploaded by admin.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search test papers..." className="pl-10" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Loading test papers...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">No test papers uploaded yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((paper) => {
            const subject = firstJoin(paper.subjects)?.name ?? "General";
            return (
              <Card key={paper.id} className="interactive-card">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="secondary">{subject}</Badge>
                      <CardTitle className="mt-3">{paper.title}</CardTitle>
                      <CardDescription>{paper.description ?? "Shared study material"}</CardDescription>
                    </div>
                    <FileQuestion className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {paper.paper_url ? (
                    <Button size="sm" asChild>
                      <a href={paper.paper_url} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Paper
                      </a>
                    </Button>
                  ) : null}
                  {paper.solution_url ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={paper.solution_url} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Solution
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
