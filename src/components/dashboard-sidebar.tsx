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
    <aside className="flex h-full w-full flex-col bg-transparent z-20">
      <div className="flex h-full flex-col relative z-10 pt-4">
        {/* Logo Section */}
        <div className="px-6 pb-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-900 to-primary-700 text-white shadow-md shadow-primary-900/20 border border-white/20">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
              </svg>
            </div>
            <div>
              <p className="text-[17px] font-extrabold leading-tight text-slate-800 tracking-tight">
                SmartInventory
              </p>
              <p className="text-[12px] font-bold text-primary-700 uppercase tracking-widest mt-0.5">
                Control
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          <ul className="space-y-1.5 flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-bold transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-white/80 text-primary-800 shadow-sm border border-white"
                      : "text-slate-600 hover:bg-white/50 hover:text-primary-800"
                  }`}
                >
                  <span className={`text-[18px] transition-transform duration-300 group-hover:scale-110 ${isActive(item.href) ? 'text-primary-700' : 'text-slate-400 group-hover:text-primary-600'}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 tracking-wide">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto p-4 border-t border-slate-200/50">
          <Link
            href="/auth/login"
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-bold text-slate-600 transition-all duration-300 hover:bg-red-500/10 hover:text-red-700 border border-transparent hover:border-red-500/20"
          >
            <span className="text-[18px] transition-transform duration-300 group-hover:scale-110 text-slate-400 group-hover:text-red-600">
              🚪
            </span>
            <span className="tracking-wide">Sign out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
