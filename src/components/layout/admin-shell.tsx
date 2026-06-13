"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { adminNav } from "@/lib/constants";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppSidebar nav={adminNav} variant="admin" userName="Admin" />
      <main className="min-h-screen px-4 pb-24 pt-6 md:px-6">
        <div className="lg:pl-72">{children}</div>
      </main>
      <MobileNav nav={adminNav} />
    </div>
  );
}
