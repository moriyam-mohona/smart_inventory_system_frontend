"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/inventory";
import { navigationByRole, normalizeRole } from "@/lib/role-access";

interface DashboardSidebarProps {
  userRole: UserRole;
  userName: string;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = navigationByRole[normalizeRole(userRole)];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="relative flex h-screen w-full flex-shrink-0 flex-col overflow-hidden md:w-[300px] md:sticky md:top-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute -top-16 -left-16 h-44 w-44 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute bottom-24 -right-20 h-52 w-52 rounded-full bg-secondary-500/20 blur-3xl" />

      <div className="relative z-10 m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-3xl border border-white/15 bg-white/8 shadow-2xl shadow-slate-950/50 backdrop-blur-2xl">
        {/* Logo Section */}
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-700/35">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-white">
                SmartInventory
              </p>
              <p className="text-xs font-medium text-slate-300/90">
                Control Center
              </p>
            </div>
          </div>
        </div>
        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300/80">
            Navigation
          </p>
          <ul className="space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "border border-primary-300/30 bg-gradient-to-r from-primary-500/30 to-primary-700/20 text-white shadow-lg shadow-primary-900/40"
                      : "border border-transparent text-slate-300/85 hover:border-white/15 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isActive(item.href) && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-200 shadow shadow-primary-200/70" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto border-t border-white/10 p-4">
          <Link
            href="/auth/login"
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300/85 transition-all duration-200 hover:border-red-300/25 hover:bg-red-500/10 hover:text-red-200"
          >
            <span className="text-lg transition-transform duration-200 group-hover:scale-110">
              🚪
            </span>
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
