"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export type ChapterOption = {
  id: string;
  subject_id: string;
  title: string;
  chapter_number: number;
};

export function useChapters() {
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChapters() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chapters")
      .select("id,subject_id,title,chapter_number")
      .order("chapter_number", { ascending: true });

    if (error) {
      toast.error(error.message);
      setChapters([]);
    } else {
      setChapters(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadChapters();

    const supabase = createClient();
    const channel = supabase
      .channel(`chapters-live-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chapters" }, loadChapters)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { chapters, loading, refresh: loadChapters };
}
