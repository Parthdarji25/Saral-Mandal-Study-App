import { SubjectProgressGrid } from "@/components/student/subject-progress-grid";

export default function SubjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black">Subjects</h1>
      <p className="mt-2 text-muted-foreground">Mark completed chapters here. Dashboard progress updates from this checklist.</p>
      <SubjectProgressGrid />
    </div>
  );
}
