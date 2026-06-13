"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchCommand } from "@/components/search-command";
import { createClient } from "@/lib/supabase/browser";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function AppSidebar({
  nav,
  userName = "Saral Student",
  avatarUrl,
  variant = "student"
}: {
  nav: NavItem[];
  userName?: string | null;
  avatarUrl?: string | null;
  variant?: "student" | "admin";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const homeHref = variant === "admin" ? "/admin" : "/dashboard";

  function isActive(href: string) {
    return pathname === href || (href !== "/admin" && pathname.startsWith(href));
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-card/80 p-4 backdrop-blur-xl lg:block">
        <Link href={homeHref} className="flex items-center gap-2 px-2 py-3 font-extrabold">
          <span className="rounded-md bg-primary p-2 text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          Saral Mandal
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center gap-3">
              <SearchCommand />
            </div>
            <ThemeToggle />
            <Avatar>
              <AvatarImage src={avatarUrl ?? undefined} alt={userName ?? "User"} />
              <AvatarFallback>{initials(userName)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href={homeHref} className="flex items-center gap-2 font-extrabold" onClick={() => setMobileMenuOpen(false)}>
                <span className="rounded-md bg-primary p-2 text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </span>
                Saral Mandal
              </Link>
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="grid gap-2 overflow-y-auto p-4">
              {nav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                      active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t p-4">
              <Button className="w-full justify-start gap-2" variant="outline" onClick={logout}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
