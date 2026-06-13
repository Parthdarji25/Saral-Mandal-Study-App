"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { studentNav } from "@/lib/constants";

export function StudentShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppSidebar nav={studentNav} />
      <main className="min-h-screen px-4 pb-24 pt-6 md:px-6">
        <div className="lg:pl-72">{children}</div>
      </main>
      <MobileNav nav={studentNav} />
    </div>
  );
}
