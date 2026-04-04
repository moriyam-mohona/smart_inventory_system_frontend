"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { UserRole } from "@/types/inventory";
import { navigationByRole, normalizeRole } from "@/lib/role-access";
import { logout } from "@/redux/features/auth/authSlice";

interface DashboardSidebarProps {
  userRole: UserRole;
  userName: string;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const navItems = navigationByRole[normalizeRole(userRole)];

  const handleLogout = () => {
    // 1. Clear session from store
    dispatch(logout());
    // 2. Remove from localStorage (optional if Redux Persist is configured for the key)
    localStorage.removeItem("smart_inventory_session");
    // 3. Manually push to login (AuthGuard will also catch this)
    router.replace("/auth/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-full flex-col bg-transparent z-20">
      <div className="flex h-full flex-col relative z-10 pt-8">
        {/* Logo Section */}
        <div className="px-8 pb-10 mb-2">
          <div className="group flex items-center gap-4 cursor-pointer">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700 text-white shadow-[0_12px_24px_-8px_rgba(27,71,93,0.4)] border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
              </svg>
            </div>
            <div>
              <p className="text-[20px] font-black leading-tight text-slate-900 tracking-tight mb-0">
                SmartInv
              </p>
              <p className="label-caps !text-primary-600 mt-0.5 opacity-80">
                Studio
              </p>
            </div>
          </div>
        </div>  

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {navItems.map((section) => (
            <div key={section.sectionLabel} className="mb-8 last:mb-2">
              <p className="mb-4 px-4 label-caps !text-slate-400">
                {section.sectionLabel}
              </p>
              <ul className="space-y-1.5 flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="relative group/item">
                      {/* Active Indicator Bar */}
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full transition-all duration-500 origin-left ${
                        active ? "bg-primary-600 scale-y-100 opacity-100" : "bg-primary-300 scale-y-0 opacity-0 group-hover/item:scale-y-50 group-hover/item:opacity-30"
                      }`} />

                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[14px] font-bold transition-all duration-300 transform ${
                          active
                            ? "bg-white text-primary-900 shadow-[0_10px_30px_-10px_rgba(27,71,93,0.15)] ring-1 ring-white translate-x-1"
                            : "text-slate-500 hover:bg-white/40 hover:text-primary-800 hover:translate-x-1"
                        }`}
                      >
                        <span className={`text-[20px] transition-all duration-300 ${active ? 'text-primary-600 scale-110' : 'text-slate-400 group-hover:text-primary-500 group-hover:scale-110'}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1 !font-bold tracking-tight">{item.label}</span>
                        {active && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse shadow-[0_0_8px_rgba(27,71,93,0.5)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto p-6">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-4 text-[14px] font-bold text-slate-500 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-700 border border-transparent hover:border-rose-500/10 hover:shadow-lg hover:shadow-rose-500/5 active:scale-95"
          >
            <span className="text-[20px] transition-transform duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100">
              🚪
            </span>
            <span className="!font-bold tracking-tight">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
