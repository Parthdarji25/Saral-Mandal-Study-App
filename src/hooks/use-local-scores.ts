"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { mapDatabaseScore, scoreUpdatedEvent, type ScoreEntry } from "@/lib/local-scores";
import { createClient } from "@/lib/supabase/browser";

export function useLocalScores() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScores = useCallback(async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setScores([]);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setScores([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("student_scores")
        .select("id,test_name,marks_obtained,total_marks,test_date,subjects(name)")
        .eq("user_id", user.id)
        .order("test_date", { ascending: false });

      if (error) {
        toast.error("Could not load scores from Supabase.");
        setScores([]);
      } else {
        setScores((data ?? []).map((row) => mapDatabaseScore(row)));
      }

      setLoading(false);
  }, []);

  useEffect(() => {
    loadScores();

    function refreshScores() {
      loadScores();
    }

    window.addEventListener(scoreUpdatedEvent, refreshScores);

    return () => {
      window.removeEventListener(scoreUpdatedEvent, refreshScores);
    };
  }, [loadScores]);

  return { scores, loading, refresh: loadScores };
}
