"use client";

import { BarChart3, CalendarClock, Flame, Trophy } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAverageScore } from "@/lib/local-scores";
import { useLocalScores } from "@/hooks/use-local-scores";
import { useStudyStreak } from "@/hooks/use-study-streak";

export function DashboardLiveStats() {
  const { scores } = useLocalScores();
  const { loading, saving, streak, studiedToday, markTodayStudied } = useStudyStreak();
  const average = getAverageScore(scores);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="interactive-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-md bg-secondary p-3 text-primary">
            <Flame className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Study streak</p>
            <p className="text-2xl font-black">{loading ? "..." : `${streak} days`}</p>
            <p className="text-xs text-muted-foreground">
              {studiedToday ? "Today is marked studied" : "Mark today to keep it going"}
            </p>
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={() => markTodayStudied()}
              disabled={saving || studiedToday}
            >
              {studiedToday ? "Done today" : saving ? "Saving..." : "Mark Today Studied"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <StatCard title="XP points" value="0" helper="Earn XP from activity" icon={Trophy} />
      <StatCard title="Average marks" value={`${average}%`} helper={scores.length === 0 ? "Add your first test" : `${scores.length} score tracked`} icon={BarChart3} />
      <StatCard title="Weekly goal" value="0%" helper="Create a planner task" icon={CalendarClock} />
    </section>
  );
}
