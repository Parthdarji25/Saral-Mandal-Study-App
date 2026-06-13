"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const actions = ["Find Accountancy notes", "Open score tracker", "Create study task", "Practice Economics quiz"];

export function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="outline" className="hidden w-64 justify-start text-muted-foreground md:flex" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
        Search anything
        <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">Ctrl K</span>
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-background/80 p-4 backdrop-blur" onClick={() => setOpen(false)}>
          <Card className="mx-auto mt-24 max-w-xl p-3" onClick={(event) => event.stopPropagation()}>
            <Input autoFocus placeholder="Search notes, chapters, tasks..." />
            <div className="mt-3 grid gap-2">
              {actions.map((action) => (
                <button key={action} className="rounded-md px-3 py-2 text-left text-sm hover:bg-secondary" onClick={() => setOpen(false)}>
                  {action}
                </button>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
