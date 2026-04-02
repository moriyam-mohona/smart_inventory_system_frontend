import type { UserRole } from "@/types/inventory";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  userName: string;
  userRole: UserRole;
}

export function DashboardLayout({
  children,
  pageTitle = "Dashboard",
  userName,
  userRole,
}: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <DashboardSidebar userRole={userRole} userName={userName} />

      <div className="flex flex-col min-h-screen overflow-hidden">
        <DashboardTopbar
          pageTitle={pageTitle}
          userName={userName}
          userRole={userRole}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className=" mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
