import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [students, notes, quizzes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("public_notes").select("id", { count: "exact", head: true }),
    supabase.from("quizzes").select("id", { count: "exact", head: true })
  ]);

  return NextResponse.json({
    students: students.count ?? 0,
    notes: notes.count ?? 0,
    quizzes: quizzes.count ?? 0
  });
}
