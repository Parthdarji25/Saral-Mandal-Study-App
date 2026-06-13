"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getChaptersForSubject, saveChapterProgressToSupabase, toggleChapter } from "@/lib/chapter-progress";
import { useChapterProgress } from "@/hooks/use-chapter-progress";
import { useChapters } from "@/hooks/use-chapters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSubjects } from "@/hooks/use-subjects";

export function SubjectProgressGrid() {
  const progress = useChapterProgress();
  const { subjects, loading } = useSubjects();
  const { chapters: allChapters } = useChapters();

  async function onToggle(subject: string, chapter: number) {
    const nextProgress = toggleChapter(progress, subject, chapter);

    try {
      const savedToSupabase = await saveChapterProgressToSupabase(nextProgress);
      toast.success(savedToSupabase ? "Chapter progress saved to Database." : "Login first to save chapter progress.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save chapter progress to Database.");
    }
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Loading subjects...</CardContent>
        </Card>
      ) : subjects.map((subjectRow) => {
        const subject = subjectRow.name;
        const completed = progress[subject] ?? [];
        const dbChapters = allChapters
          .filter((chapter) => chapter.subject_id === subjectRow.id)
          .sort((a, b) => a.chapter_number - b.chapter_number)
          .map((chapter) => ({ title: chapter.title, chapter_number: chapter.chapter_number }));
        const subjectChapters = dbChapters.length > 0 ? dbChapters : getChaptersForSubject(subject);
        const displayChapters = subjectChapters.length > 0 ? subjectChapters : [{ title: "Chapter 1" }];
        const value = Math.round(((completed.length ?? 0) / displayChapters.length) * 100);

        return (
          <Card key={subjectRow.id} className="interactive-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-secondary p-3 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <Badge variant="secondary">
                  {completed.length}/{displayChapters.length} chapters
                </Badge>
              </div>
              <CardTitle>{subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span>Progress</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {displayChapters.map((chapter, index) => {
                  const chapterNumber = "chapter_number" in chapter ? chapter.chapter_number : index + 1;
                  const checked = completed.includes(chapterNumber);
                  return (
                    <Button
                      key={`${chapterNumber}-${chapter.title}`}
                      type="button"
                      size="sm"
                      variant={checked ? "default" : "outline"}
                      className="h-10 px-0"
                      title={chapter.title}
                      onClick={() => onToggle(subject, chapterNumber)}
                      aria-label={`${checked ? "Unmark" : "Mark"} ${subject} chapter ${chapterNumber}`}
                    >
                      {checked ? <CheckCircle2 className="h-4 w-4" /> : chapterNumber}
                    </Button>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
                {displayChapters.map((chapter, index) => (
                  <div key={chapter.title} className="flex gap-2">
                    <span className="font-bold text-foreground">{"chapter_number" in chapter ? chapter.chapter_number : index + 1}.</span>
                    <span>{chapter.title}</span>
                  </div>
                ))}
              </div>
              <Link href={`/notes?subject=${encodeURIComponent(subject)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                View notes <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
