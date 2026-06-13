import { DashboardAnnouncements } from "@/components/dashboard/dashboard-announcements";
import { DashboardChapterProgress } from "@/components/dashboard/dashboard-chapter-progress";
import { DashboardLiveStats } from "@/components/dashboard/dashboard-live-stats";
import { DashboardSubjectPerformance } from "@/components/dashboard/dashboard-subject-performance";
import { DashboardTasks } from "@/components/dashboard/dashboard-tasks";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { StudentTour } from "@/components/student/student-tour";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <StudentTour />
      <DashboardWelcome />

      <DashboardLiveStats />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardSubjectPerformance />
        <DashboardTasks />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DashboardChapterProgress />
        <DashboardAnnouncements />
      </section>
    </div>
  );
}
