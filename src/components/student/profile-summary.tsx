"use client";

import { Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/browser";

type ProfileSummary = {
  firstName: string;
  lastName: string;
  email: string;
};

function splitName(fullName?: string | null) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ")
  };
}

export function ProfileSummaryCard() {
  const [profile, setProfile] = useState<ProfileSummary>({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const user = await getCurrentUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,email")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error(error.message);
      }

      const name = splitName(data?.full_name ?? user.user_metadata?.full_name);
      setProfile({
        firstName: name.firstName || "Student",
        lastName: name.lastName || "-",
        email: data?.email ?? user.email ?? "-"
      });
      setLoading(false);
    }

    loadProfile();
  }, []);

  return (
    <Card className="mt-6 max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-primary" />
          Student profile
        </CardTitle>
        <CardDescription>Read-only account details from your Supabase profile.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : (
          <>
            <div className="grid gap-1 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">First name</p>
              <p className="text-lg font-bold">{profile.firstName}</p>
            </div>
            <div className="grid gap-1 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Last name</p>
              <p className="text-lg font-bold">{profile.lastName}</p>
            </div>
            <div className="grid gap-1 rounded-md border p-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="break-all text-lg font-bold">{profile.email}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
