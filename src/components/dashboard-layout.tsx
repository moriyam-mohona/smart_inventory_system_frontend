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
    <div className="dashboard-shell">
      <DashboardSidebar userRole={userRole} userName={userName} />

      <div className="dashboard-main">
        <DashboardTopbar
          pageTitle={pageTitle}
          userName={userName}
          userRole={userRole}
        />

        <main className="dashboard-content">
          <div className="content-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
