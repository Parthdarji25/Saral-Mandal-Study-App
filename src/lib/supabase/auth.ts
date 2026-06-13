"use client";

import { createClient } from "@/lib/supabase/browser";

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.user) return session.user;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
