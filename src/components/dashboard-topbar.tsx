"use client";

import Link from "next/link";
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 m-0 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl py-2 pl-4 pr-2 hover:shadow-sm transition-shadow">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {userName}
              </p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {userRole}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-600/30">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
