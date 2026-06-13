import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <span className="rounded-md bg-primary p-2 text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          Saral Mandal
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/sample-notes" className="hover:text-foreground">
            Sample Notes
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
