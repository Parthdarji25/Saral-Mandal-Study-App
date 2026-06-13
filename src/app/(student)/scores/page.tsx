import { ScoreTracker } from "@/components/student/score-tracker";

export default function ScoresPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black">Score tracker</h1>
        <p className="mt-2 text-muted-foreground">Add marks, spot strong and weak subjects, and watch monthly movement.</p>
      </div>
      <ScoreTracker />
    </div>
  );
}
