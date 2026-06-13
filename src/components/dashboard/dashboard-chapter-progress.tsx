"use client";

import { getChapterCount, getSubjectChapterPercent } from "@/lib/chapter-progress";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { useChapters } from "@/hooks/use-chapters";
import { useSubjects } from "@/hooks/use-subjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardChapterProgress() {
  const progress = useChapterProgress();
  const { subjects } = useSubjects();
  const { chapters } = useChapters();
  const rows = subjects.map((subject) => {
    const dbTotal = chapters.filter((chapter) => chapter.subject_id === subject.id).length;
    const total = dbTotal > 0 ? dbTotal : getChapterCount(subject.name);
    const completed = progress[subject.name]?.length ?? 0;

    return {
      subject: subject.name,
      completed,
      total,
      value: total > 0 ? Math.round((completed / total) * 100) : getSubjectChapterPercent(subject.name, progress)
    };
  });
  const completed = rows.reduce((sum, row) => sum + row.completed, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter progress</CardTitle>
        <CardDescription>
          {completed === 0 ? "No chapters completed yet. Mark chapters from Subjects." : "Live completion from your subject checklist."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {rows.map((row) => (
          <div key={row.subject}>
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span>{row.subject}</span>
              <span>
                {row.value}% ({row.completed}/{row.total})
              </span>
            </div>
            <Progress value={row.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
