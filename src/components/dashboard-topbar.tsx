"use client";

import type { UserRole } from "@/types/inventory";

interface DashboardTopbarProps {
  pageTitle?: string;
  userName: string;
  userRole: UserRole;
}

export function DashboardTopbar({
  pageTitle = "Dashboard",
  userName,
  userRole,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-md">
      <div className="px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-[22px] sm:text-2xl font-extrabold text-slate-800 m-0 tracking-tight">
              {pageTitle}
            </h1>
            <p className="hidden text-[13px] text-slate-500 font-bold sm:block mt-1 tracking-wide">
              Smart inventory control panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`hidden sm:inline-flex items-center rounded-lg px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest border backdrop-blur-sm ${
              userRole === "ADMIN"
                ? "bg-rose-500/10 text-rose-700 border-rose-500/20"
                : "bg-primary-500/10 text-primary-800 border-primary-500/20"
            }`}
          >
            {userRole}
          </span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/50 backdrop-blur-md py-1.5 pl-4 pr-1.5 shadow-sm hover:bg-white/80 transition-colors">
            <div className="hidden text-right md:block">
              <p className="text-[14px] font-bold text-slate-800 leading-tight">
                {userName}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 shadow-md shadow-primary-900/20 border border-white/20 text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
