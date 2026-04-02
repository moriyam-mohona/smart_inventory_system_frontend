"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/inventory";

interface DashboardSidebarProps {
  userRole: UserRole;
  userName: string;
}

const navigationByRole: Record<
  UserRole,
  Array<{
    label: string;
    href: string;
    icon: string;
  }>
> = {
  ADMIN: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Categories", href: "/dashboard/categories", icon: "📂" },
    { label: "Products", href: "/dashboard/products", icon: "📦" },
    { label: "Add Product", href: "/dashboard/products/new", icon: "➕" },
    { label: "Orders", href: "/dashboard/orders", icon: "📋" },
    { label: "New Order", href: "/dashboard/orders/new", icon: "🆕" },
    { label: "Users", href: "/dashboard/users", icon: "👥" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
    { label: "Activity Log", href: "/dashboard/activity", icon: "📜" },
  ],
  MANAGER: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Categories", href: "/dashboard/categories", icon: "📂" },
    { label: "Products", href: "/dashboard/products", icon: "📦" },
    { label: "Add Product", href: "/dashboard/products/new", icon: "➕" },
    { label: "Orders", href: "/dashboard/orders", icon: "📋" },
    { label: "New Order", href: "/dashboard/orders/new", icon: "🆕" },
    { label: "Low Stock", href: "/dashboard/low-stock", icon: "⚠️" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
  ],
  USER: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Products", href: "/dashboard/products", icon: "📦" },
    { label: "My Orders", href: "/dashboard/orders", icon: "📋" },
    { label: "Create Order", href: "/dashboard/orders/new", icon: "🆕" },
  ],
};

export function DashboardSidebar({
  userRole,
  userName,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = navigationByRole[userRole];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="bg-gradient-to-b from-slate-900 to-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 overflow-y-auto w-full md:w-[260px] flex-shrink-0 border-r border-slate-700">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-600/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white leading-tight text-sm">
              SmartInventory
            </p>
            <p className="text-xs text-slate-400 font-medium">Management</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-600/30">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate text-sm">
              {userName}
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-6 px-3">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-primary-600/20 text-primary-300 shadow-lg shadow-primary-600/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive(item.href) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-700/50 mt-auto">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 text-sm font-medium group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
            🚪
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
