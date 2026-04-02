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
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-700/20 sm:flex">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 m-0 tracking-tight">
              {pageTitle}
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Smart inventory control panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border backdrop-blur ${
              userRole === "ADMIN"
                ? "bg-rose-500/10 text-rose-700 border-rose-200"
                : "bg-emerald-500/10 text-emerald-700 border-emerald-200"
            }`}
          >
            {userRole}
          </span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 py-2 pl-4 pr-2 shadow-sm backdrop-blur-md">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {userName}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {userRole}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-lg shadow-primary-600/25">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
