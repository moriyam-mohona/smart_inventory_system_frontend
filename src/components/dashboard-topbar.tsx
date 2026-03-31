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
    <header className="dashboard-topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          <h1 className="page-title">{pageTitle}</h1>
        </div>

        <div className="topbar-right">
          <div className="topbar-user">
            <div className="user-info-compact">
              <p className="compact-name">{userName}</p>
              <p className="compact-role">{userRole}</p>
            </div>
            <div className="user-avatar-compact">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
