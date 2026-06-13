"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";
import type { UserRole } from "@/types/database";

type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
};

export function StudentsManager() {
  const [students, setStudents] = useState<StudentProfile[]>([]);

  async function loadStudents() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,email,role,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setStudents(data ?? []);
    }
  }

  useEffect(() => {
    loadStudents();
    const supabase = createClient();
    const channel = supabase
      .channel("admin-students-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadStudents)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateRole(id: string, role: UserRole) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadStudents();
    toast.success("Role updated.");
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Manage students</h1>
        <p className="mt-2 text-muted-foreground">Live profile list from Supabase.</p>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-secondary/60 text-left">
              <tr>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-3">{student.full_name ?? "-"}</td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={student.role === "admin" ? "gold" : "secondary"}>{student.role}</Badge>
                      <select
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        value={student.role}
                        onChange={(event) => updateRole(student.id, event.target.value as UserRole)}
                      >
                        <option value="student">student</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">{new Date(student.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
