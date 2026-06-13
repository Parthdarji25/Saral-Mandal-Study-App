import { BarChart3, Bell, BookMarked, Brain, Calendar, ShieldCheck, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Smart dashboards", text: "Welcome state, streaks, tasks, scores, announcements, and recent activity.", icon: BarChart3 },
  { title: "Notes library", text: "Searchable subject and chapter notes with PDFs, previews, and bookmarks.", icon: BookMarked },
  { title: "Private workspace", text: "Personal notes, tasks, planners, and marks protected by Supabase policies.", icon: ShieldCheck },
  { title: "Quiz practice", text: "MCQ quizzes with instant results and score history.", icon: Brain },
  { title: "Study planner", text: "Calendar-friendly deadlines, goals, tasks, and study schedules.", icon: Calendar },
  { title: "Announcements", text: "Admins can broadcast important updates without exposing student data.", icon: Bell }
];

export default function FeaturesPage() {
  return (
    <main className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black">Everything a Commerce student needs in one energetic workspace.</h1>
        <p className="mt-4 text-muted-foreground">
          The hub combines study content, self-tracking, planning, analytics, and secure admin workflows.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, text, icon: Icon }) => (
          <Card key={title} className="interactive-card">
            <CardHeader>
              <Icon className="h-7 w-7 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
