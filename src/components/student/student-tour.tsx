"use client";

import Link from "next/link";
import { BarChart3, BookOpen, CalendarDays, CheckCircle2, FileText, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";

const tourSteps = [
  {
    href: "/subjects",
    icon: BookOpen,
    title: "Start with Subjects",
    text: "Pick Accountancy, Business Studies, Economics, English, Statistics, or Mathematics."
  },
  {
    href: "/notes",
    icon: FileText,
    title: "Read and bookmark notes",
    text: "Search chapter notes, filter by subject, preview PDFs, and save useful notes."
  },
  {
    href: "/scores",
    icon: BarChart3,
    title: "Add your first score",
    text: "Track test marks so the dashboard can show strong and weak subjects."
  },
  {
    href: "/planner",
    icon: CalendarDays,
    title: "Plan this week",
    text: "Create deadlines, study goals, and tasks for daily revision."
  },
  {
    href: "/quizzes",
    icon: Trophy,
    title: "Practice quizzes",
    text: "Use MCQs for quick revision and instant result tracking."
  }
];

export function StudentTour() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function loadTourState() {
      if (!hasSupabaseConfig) {
        setOpen(true);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) {
        setOpen(true);
      } else {
        setOpen(data?.onboarding_completed === false);
      }

      setLoading(false);
    }

    loadTourState();
  }, [hasSupabaseConfig]);

  async function completeTour() {
    setOpen(false);

    if (!hasSupabaseConfig) return;

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
    if (error) {
      toast.error("Tour closed. Run the latest SQL migration to save completion to Supabase.");
    }
  }

  if (loading || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 p-4 backdrop-blur">
      <Card className="mx-auto mt-8 max-w-3xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <p className="text-sm font-bold text-primary">New student setup</p>
            <h2 className="mt-1 text-2xl font-black">Welcome to Saral Mandal 12th Commerce App</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account starts fresh: 0 XP, 0 streak, empty private notes, empty planner, and private score tracking.
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close tour" onClick={completeTour}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid gap-3 p-5">
          {tourSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.href}
                href={step.href}
                onClick={completeTour}
                className="flex gap-3 rounded-md border p-4 transition hover:bg-secondary"
              >
                <div className="h-fit rounded-md bg-secondary p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 border-t p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Student data remains private through Supabase RLS.
          </div>
          <Button onClick={completeTour}>I&apos;m ready</Button>
        </div>
      </Card>
    </div>
  );
}
