import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl animate-float">
      <Card className="glass-panel overflow-hidden p-4">
        <div className="rounded-lg bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-200">Today&apos;s focus</p>
              <h3 className="mt-1 text-2xl font-black">Accountancy Sprint</h3>
            </div>
            <Badge variant="gold">+120 XP</Badge>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              ["Partnership basics", 92],
              ["Economics revision", 74],
              ["Statistics practice", 61]
            ].map(([title, value]) => (
              <div key={title as string} className="rounded-md bg-white/10 p-3">
                <div className="mb-2 flex justify-between text-sm">
                  <span>{title}</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value as number} />
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="absolute -bottom-6 -left-4 rounded-lg border bg-card p-4 shadow-lg">
        <p className="text-xs font-semibold text-muted-foreground">Study streak</p>
        <p className="text-2xl font-black text-primary">12 days</p>
      </div>
      <div className="absolute -right-2 top-8 rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-xs font-semibold text-muted-foreground">Next exam</p>
        <p className="font-black">28 days</p>
      </div>
    </div>
  );
}
