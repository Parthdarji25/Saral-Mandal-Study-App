"use client";

import Link from "next/link";
import { CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";
import { getCurrentUser } from "@/lib/supabase/auth";

type DashboardTask = {
  id: string;
  title: string;
  due_date: string | null;
  status: "todo" | "doing" | "done";
};

function formatDueDate(date: string | null) {
  if (!date) return "No due date";

  const today = new Date();
  const due = new Date(`${date}T00:00:00`);
  const todayKey = today.toDateString();
  const dueKey = due.toDateString();

  if (todayKey === dueKey) return "Today";

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (tomorrow.toDateString() === dueKey) return "Tomorrow";

  return due.toLocaleDateString();
}

export function DashboardTasks() {
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("study_tasks")
      .select("id,title,due_date,status")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5);

    if (error) {
      toast.error(error.message);
    } else {
      setTasks(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function toggleTask(task: DashboardTask) {
    const supabase = createClient();
    const { error } = await supabase
      .from("study_tasks")
      .update({ status: task.status === "done" ? "todo" : "done" })
      .eq("id", task.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadTasks();
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Live from your Study Planner.</CardDescription>
        </div>
        <Button size="icon" variant="ghost" aria-label="Refresh tasks" onClick={loadTasks}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {loading ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            No tasks yet. Add one from{" "}
            <Link href="/planner" className="font-bold text-primary">
              Planner
            </Link>
            .
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-md border p-3">
              <Button size="icon" variant="ghost" aria-label="Toggle task" onClick={() => toggleTask(task)}>
                {task.status === "done" ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
              </Button>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{task.title}</p>
                <p className="text-xs text-muted-foreground">{formatDueDate(task.due_date)}</p>
              </div>
              <Badge variant={task.status === "done" ? "secondary" : "outline"}>{task.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
