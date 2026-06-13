"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      toast.error("Supabase is not configured. Add .env.local first.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (error) throw error;
        toast.success("Check your email to verify your account.");
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(searchParams.get("redirectedFrom") ?? "/dashboard");
        router.refresh();
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/profile`
        });
        if (error) throw error;
        toast.success("Password reset link sent.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password";
  const description =
    mode === "login"
      ? "Login to continue your study streak."
      : mode === "signup"
        ? "Start tracking notes, marks, plans, and quizzes."
        : "Enter your email and we will send a reset link.";

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          {!hasSupabaseConfig ? (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
              Supabase credentials are missing. Add `.env.local` before using authentication.
            </div>
          ) : null}
          {mode === "signup" ? (
            <Input placeholder="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          ) : null}
          <Input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
          {mode !== "forgot" ? (
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          ) : null}
          <Button type="submit" disabled={loading || !hasSupabaseConfig}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-muted-foreground">
          {mode !== "login" ? <Link href="/login">Login</Link> : <Link href="/forgot-password">Forgot password?</Link>}
          {mode !== "signup" ? <Link href="/signup">Create account</Link> : null}
        </div>
      </CardContent>
    </Card>
  );
}
