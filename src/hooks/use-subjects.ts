"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export type SubjectOption = {
  id: string;
  name: string;
  description: string | null;
};

export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSubjects() {
    const supabase = createClient();
    const { data, error } = await supabase.from("subjects").select("id,name,description").order("name");

    if (error) {
      toast.error(error.message);
      setSubjects([]);
    } else {
      setSubjects(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSubjects();

    const supabase = createClient();
    const channel = supabase
      .channel(`student-subjects-live-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "subjects" }, loadSubjects)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { subjects, loading, refresh: loadSubjects };
}
