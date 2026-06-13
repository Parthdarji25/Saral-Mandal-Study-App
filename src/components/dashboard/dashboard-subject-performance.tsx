"use client";

import { PerformanceChart } from "@/components/charts/performance-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStrongSubject, getSubjectAverages } from "@/lib/local-scores";
import { useLocalScores } from "@/hooks/use-local-scores";
import { useSubjects } from "@/hooks/use-subjects";

export function DashboardSubjectPerformance() {
  const { scores } = useLocalScores();
  const { subjects } = useSubjects();
  const subjectScores = getSubjectAverages(scores, subjects.map((subject) => subject.name));
  const strongSubject = getStrongSubject(subjectScores);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Subject performance</CardTitle>
            <CardDescription>
              {scores.length === 0 ? "No test scores yet. Add a score to see real subject performance." : "Live average from your added scores."}
            </CardDescription>
          </div>
          <Badge variant={scores.length === 0 ? "outline" : "secondary"}>
            {scores.length === 0 ? "0 scores" : `Strong: ${strongSubject}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <PerformanceChart data={subjectScores} />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {subjectScores.map((item) => (
            <div key={item.subject} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span className="font-semibold">{item.subject}</span>
              <span className="text-muted-foreground">{item.score}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
