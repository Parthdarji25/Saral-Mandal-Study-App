"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/browser";

type StudySession = {
  studied_on: string;
  minutes: number;
};

function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function calculateStreak(sessions: StudySession[]) {
  const studiedDays = new Set(sessions.map((session) => session.studied_on));
  const today = toLocalDateString(new Date());
  const yesterday = toLocalDateString(addDays(new Date(), -1));

  if (!studiedDays.has(today) && !studiedDays.has(yesterday)) return 0;

  let cursor = studiedDays.has(today) ? new Date() : addDays(new Date(), -1);
  let streak = 0;

  while (studiedDays.has(toLocalDateString(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function useStudyStreak() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("study_sessions")
      .select("studied_on,minutes")
      .eq("user_id", user.id)
      .order("studied_on", { ascending: false });

    if (error) {
      toast.error(error.message);
      setSessions([]);
    } else {
      setSessions(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const today = toLocalDateString(new Date());
  const studiedToday = sessions.some((session) => session.studied_on === today);
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  async function markTodayStudied(minutes = 25) {
    setSaving(true);

    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Login to this app first, then mark your study streak.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("study_sessions").upsert(
      {
        user_id: user.id,
        studied_on: today,
        minutes
      },
      { onConflict: "user_id,studied_on" }
    );

    if (error) {
      toast.error(error.message);
    } else {
      await loadSessions();
      toast.success("Today marked as studied.");
    }

    setSaving(false);
  }

  return {
    loading,
    saving,
    streak,
    studiedToday,
    markTodayStudied
  };
}
