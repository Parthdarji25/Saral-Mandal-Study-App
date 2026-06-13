import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="rounded-full bg-secondary p-3 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
