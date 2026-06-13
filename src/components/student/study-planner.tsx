"use client";

import { CalendarDays, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { getCurrentUser } from "@/lib/supabase/auth";

type StudyTask = {
  id: string;
  title: string;
  due_date: string | null;
  status: "todo" | "doing" | "done";
};

const days = Array.from({ length: 30 }, (_, index) => index + 1);

export function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
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
      .order("due_date", { ascending: true });

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

  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Enter a task title.");
      return;
    }

    const supabase = createClient();
    const user = await getCurrentUser();

    if (!user) {
      toast.error("Login to this app first, then save planner tasks.");
      return;
    }

    const { error } = await supabase.from("study_tasks").insert({
      user_id: user.id,
      title: title.trim(),
      due_date: dueDate || null,
      status: "todo"
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setTitle("");
    setDueDate("");
    await loadTasks();
    toast.success("Task saved to Database.");
  }

  async function toggleTask(task: StudyTask) {
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

  async function deleteTask(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("study_tasks").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadTasks();
    toast.success("Task deleted.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-3xl font-black">Study planner</h1>
        <p className="mt-2 text-muted-foreground">Tasks and deadlines are saved in Database per student.</p>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Monthly planner
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day} className="aspect-square rounded-md border p-2 text-sm font-semibold hover:bg-secondary">
                {day}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create task</CardTitle>
            <CardDescription>Saved to `study_tasks`.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={addTask}>
              <Input placeholder="Task title" value={title} onChange={(event) => setTitle(event.target.value)} />
              <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              <Button type="submit">Add task</Button>
            </form>
          </CardContent>
        </Card>
        {loading ? (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">Loading tasks...</CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">No planner tasks yet.</CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <Button size="icon" variant="ghost" onClick={() => toggleTask(task)} aria-label="Toggle task">
                  {task.status === "done" ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5" />}
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.due_date ?? "No due date"}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
