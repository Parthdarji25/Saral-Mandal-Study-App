"use client";

import { CirclePlus, RotateCcw, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MonthlyLineChart, PerformanceChart } from "@/components/charts/performance-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAverageScore,
  getLatestScoreTrend,
  getStrongSubject,
  getSubjectAverages,
  scoreUpdatedEvent
} from "@/lib/local-scores";
import { useLocalScores } from "@/hooks/use-local-scores";
import { createClient } from "@/lib/supabase/browser";
import { getCurrentUser } from "@/lib/supabase/auth";
import { useSubjects } from "@/hooks/use-subjects";

export function ScoreTracker() {
  const { scores, loading, refresh } = useLocalScores();
  const { subjects } = useSubjects();
  const [subjectId, setSubjectId] = useState("");
  const [testName, setTestName] = useState("");
  const [marks, setMarks] = useState("");
  const [total, setTotal] = useState("");

  const subjectChart = useMemo(() => getSubjectAverages(scores, subjects.map((subject) => subject.name)), [scores, subjects]);
  const monthlyChart = useMemo(() => getLatestScoreTrend(scores), [scores]);
  const average = useMemo(() => getAverageScore(scores), [scores]);
  const strongSubject = useMemo(() => getStrongSubject(subjectChart), [subjectChart]);

  async function addScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const marksNumber = Number(marks);
    const totalNumber = Number(total);

    if (!testName.trim()) {
      toast.error("Enter a test name.");
      return;
    }

    if (!Number.isFinite(marksNumber) || !Number.isFinite(totalNumber) || totalNumber <= 0) {
      toast.error("Enter valid marks and total marks.");
      return;
    }

    if (marksNumber < 0 || marksNumber > totalNumber) {
      toast.error("Marks must be between 0 and total marks.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase is not configured. Add .env.local first.");
      return;
    }

    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Login to this app first, then save scores.");
      return;
    }

    if (!subjectId) {
      toast.error("Select a subject.");
      return;
    }

    const { error } = await supabase.from("student_scores").insert({
      user_id: user.id,
      subject_id: subjectId,
      test_name: testName.trim(),
      marks_obtained: marksNumber,
      total_marks: totalNumber,
      test_date: new Date().toISOString().slice(0, 10)
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setTestName("");
    setMarks("");
    setTotal("");
    await refresh();
    window.dispatchEvent(new Event(scoreUpdatedEvent));
    toast.success("Score saved to Supabase.");
  }

  async function resetScores() {
    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Login to this app first, then reset scores.");
      return;
    }

    const { error } = await supabase.from("student_scores").delete().eq("user_id", user.id);
    if (error) {
      toast.error(error.message);
      return;
    }

    await refresh();
    window.dispatchEvent(new Event(scoreUpdatedEvent));
    toast.success("Score tracker reset to 0 in Supabase.");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add test score</CardTitle>
          <CardDescription>Scores are saved to Supabase under your student account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_1fr_120px_120px_auto]" onSubmit={addScore}>
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Input placeholder="Test name" value={testName} onChange={(event) => setTestName(event.target.value)} />
            <Input type="number" placeholder="Marks" value={marks} onChange={(event) => setMarks(event.target.value)} />
            <Input type="number" placeholder="Total" value={total} onChange={(event) => setTotal(event.target.value)} />
            <Button type="submit">
              <CirclePlus className="h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise performance</CardTitle>
            <CardDescription>Recent average by subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={subjectChart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest score trend</CardTitle>
            <CardDescription>Your latest five added tests.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyLineChart data={monthlyChart} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <Badge variant="secondary">Average marks</Badge>
              <p className="mt-2 text-2xl font-black">{average}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <CirclePlus className="h-8 w-8 text-primary" />
            <div>
              <Badge variant="outline">{scores.length === 0 ? "Next step" : "Strong subject"}</Badge>
              <p className="mt-2 text-2xl font-black">{strongSubject}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Recent scores</CardTitle>
          <CardDescription>{loading ? "Loading scores..." : scores.length === 0 ? "No scores yet." : `${scores.length} score added.`}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetScores} disabled={scores.length === 0}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {scores.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Add your first test score above. The tracker will update from 0 immediately.
            </div>
          ) : (
            scores.map((score) => (
              <div key={score.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{score.testName}</p>
                  <p className="text-sm text-muted-foreground">{score.subject}</p>
                </div>
                <Badge variant="secondary">
                  {score.marks}/{score.total} - {Math.round((score.marks / score.total) * 100)}%
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
