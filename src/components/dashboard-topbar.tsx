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
          <h1 className="text-xl font-bold text-slate-900 m-0">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full py-1 pl-4 pr-1">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{userName}</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{userRole}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
