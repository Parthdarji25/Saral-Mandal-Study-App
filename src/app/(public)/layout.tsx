import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="study-gradient min-h-screen">
      <PublicHeader />
      {children}
    </div>
  );
}
