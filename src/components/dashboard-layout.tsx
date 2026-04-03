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
    <div className="w-full min-h-screen p-2 sm:p-4 lg:p-6 flex items-center justify-center relative z-0">
      {/* Floating Glass Container */}
      <div className="w-full max-w-[1600px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] card-glass bg-white/70 backdrop-blur-2xl border-white/80 shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-[24px] lg:rounded-[32px]">
        
        {/* Sidebar wrapper */}
        <div className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-slate-200/50 bg-white/30 backdrop-blur-md">
          <DashboardSidebar userRole={userRole} userName={userName} />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 h-full relative z-10 bg-gradient-to-br from-white/40 to-transparent">
          <DashboardTopbar
            pageTitle={pageTitle}
            userName={userName}
            userRole={userRole}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="mx-auto w-full max-w-7xl relative z-10 fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
