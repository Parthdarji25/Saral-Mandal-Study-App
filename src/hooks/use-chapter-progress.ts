"use client";

import { useEffect, useState } from "react";
import {
  chapterProgressUpdatedEvent,
  getEmptyChapterProgress,
  type ChapterProgressMap
} from "@/lib/chapter-progress";
import { createClient } from "@/lib/supabase/browser";

export function useChapterProgress() {
  const [progress, setProgress] = useState<ChapterProgressMap>(() => ({}));

  useEffect(() => {
    async function loadSupabaseProgress() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setProgress(getEmptyChapterProgress());
        return;
      }

      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setProgress(getEmptyChapterProgress());
        return;
      }

      const { data, error } = await supabase
        .from("student_chapter_progress")
        .select("subject_name, chapter_number")
        .eq("user_id", user.id);

      if (error) {
        setProgress(getEmptyChapterProgress());
        return;
      }

      const nextProgress = getEmptyChapterProgress();
      data?.forEach((row) => {
        nextProgress[row.subject_name] = [...(nextProgress[row.subject_name] ?? []), row.chapter_number].sort((a, b) => a - b);
      });

      setProgress(nextProgress);
    }

    loadSupabaseProgress();

    function refreshProgress() {
      loadSupabaseProgress();
    }

    window.addEventListener(chapterProgressUpdatedEvent, refreshProgress);

    return () => {
      window.removeEventListener(chapterProgressUpdatedEvent, refreshProgress);
    };
  }, []);

  return progress;
}
