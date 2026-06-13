import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroIllustration } from "@/components/landing/hero-illustration";

const features = [
  { icon: BookOpen, title: "Chapter-wise notes", text: "Public notes, PDFs, filters, bookmarks, and sample material for every Commerce subject." },
  { icon: CalendarCheck, title: "Plans that stick", text: "Tasks, deadlines, weekly goals, exam countdowns, and personal study schedules." },
  { icon: Trophy, title: "Gamified progress", text: "XP, streaks, badges, milestones, quiz scores, and momentum students can actually feel." },
  { icon: LockKeyhole, title: "Private by design", text: "Supabase RLS keeps marks, notes, tasks, plans, and analytics isolated per student." }
];

export default function LandingPage() {
  return (
    <main>
      <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Badge variant="secondary" className="mb-4">
            Built for 11th and 12th Commerce
          </Badge>
          <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">
            Saral Mandal 12th Commerce App
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            A modern study workspace for notes, scores, quizzes, planners, analytics, streaks, and admin announcements.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Create student account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="container grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="interactive-card">
              <CardHeader>
                <div className="mb-3 w-fit rounded-md bg-secondary p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="border-y bg-card/60">
        <div className="container grid gap-6 py-12 md:grid-cols-3">
          {["6 default subjects", "RLS protected data", "Admin CMS included"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-bold">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
