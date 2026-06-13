import { ProfileSummaryCard } from "@/components/student/profile-summary";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-black">Profile</h1>
      <p className="mt-2 text-muted-foreground">Your account details.</p>
      <ProfileSummaryCard />
    </div>
  );
}
