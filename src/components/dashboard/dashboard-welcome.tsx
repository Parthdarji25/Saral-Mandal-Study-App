"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/browser";

function firstNameFrom(fullName?: string | null, email?: string | null) {
  const name = fullName?.trim().split(/\s+/)[0];
  if (name) return name;
  return email?.split("@")[0] ?? "Student";
}

export function DashboardWelcome() {
  const [firstName, setFirstName] = useState("Student");

  useEffect(() => {
    async function loadName() {
      const user = await getCurrentUser();
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("full_name,email").eq("id", user.id).single();
      setFirstName(firstNameFrom(data?.full_name ?? user.user_metadata?.full_name, data?.email ?? user.email));
    }

    loadName();
  }, []);

  return (
    <section className="rounded-lg border bg-card p-5 md:p-7">
      <Badge variant="secondary">Class 12 Commerce</Badge>
      <h1 className="mt-3 text-3xl font-black">Welcome, {firstName}.</h1>
      <p className="mt-2 text-muted-foreground">Start with notes, add your first score, and build today&apos;s study streak.</p>
    </section>
  );
}
