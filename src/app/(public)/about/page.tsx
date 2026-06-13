import { Shield, Sparkles, Users, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Students first", text: "Mobile-first screens for busy students revising between classes.", icon: Users },
  { title: "Motivation built in", text: "Streaks, XP, achievements, weekly goals, and visual momentum.", icon: Sparkles },
  { title: "Secure by default", text: "Every private table ships with strict Supabase Row Level Security.", icon: Shield }
];

export default function AboutPage() {
  return (
    <main className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black">A study app that does not feel like a school portal.</h1>
        <p className="mt-4 text-muted-foreground">
          Saral Mandal 12th Commerce App is designed for focused daily study: quick notes, measurable progress, and privacy-first data boundaries.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {values.map(({ title, text, icon: Icon }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="h-6 w-6 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
