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
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] min-h-screen bg-slate-50">
      <DashboardSidebar userRole={userRole} userName={userName} />

      <div className="flex flex-col min-h-screen overflow-hidden">
        <DashboardTopbar
          pageTitle={pageTitle}
          userName={userName}
          userRole={userRole}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
