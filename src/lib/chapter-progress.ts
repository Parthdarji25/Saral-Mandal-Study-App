import { subjectSyllabus } from "@/lib/constants";
import { createClient } from "@/lib/supabase/browser";

export type ChapterProgressMap = Record<string, number[]>;

export const chapterProgressUpdatedEvent = "commerce-study-hub-chapter-progress-updated";

export function getChaptersForSubject(subject: string) {
  return subjectSyllabus[subject as keyof typeof subjectSyllabus] ?? [];
}

export function getChapterCount(subject: string) {
  return Math.max(getChaptersForSubject(subject).length, 1);
}

export function getEmptyChapterProgress(): ChapterProgressMap {
  return {};
}

export function notifyChapterProgressUpdated() {
  window.dispatchEvent(new Event(chapterProgressUpdatedEvent));
}

export async function saveChapterProgressToSupabase(progress: ChapterProgressMap) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return false;

  const rows = Object.entries(progress).flatMap(([subjectName, chapters]) =>
    chapters.map((chapterNumber) => ({
      user_id: user.id,
      subject_name: subjectName,
      chapter_number: chapterNumber
    }))
  );

  const { error: deleteError } = await supabase.from("student_chapter_progress").delete().eq("user_id", user.id);
  if (deleteError) throw deleteError;

  if (rows.length === 0) return true;

  const { error: insertError } = await supabase.from("student_chapter_progress").insert(rows);
  if (insertError) throw insertError;

  notifyChapterProgressUpdated();
  return true;
}

export function getSubjectChapterPercent(subject: string, progress: ChapterProgressMap) {
  return Math.round(((progress[subject]?.length ?? 0) / getChapterCount(subject)) * 100);
}

export function getChapterProgressRows(progress: ChapterProgressMap, subjects: string[]) {
  return subjects.map((subject) => ({
    subject,
    completed: progress[subject]?.length ?? 0,
    total: getChapterCount(subject),
    value: getSubjectChapterPercent(subject, progress)
  }));
}

export function toggleChapter(progress: ChapterProgressMap, subject: string, chapter: number) {
  const current = new Set(progress[subject] ?? []);

  if (current.has(chapter)) {
    current.delete(chapter);
  } else {
    current.add(chapter);
  }

  return {
    ...progress,
    [subject]: Array.from(current).sort((a, b) => a - b)
  };
}
