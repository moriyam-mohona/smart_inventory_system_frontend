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
    <aside className="bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 overflow-y-auto w-full md:w-[260px] flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-3 h-8 rounded-full bg-gradient-to-b from-teal-400 to-teal-600 shadow-sm" />
          <div>
            <p className="font-bold text-white leading-tight">Smart Inventory</p>
            <p className="text-xs text-slate-400 font-medium">Management</p>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">{userName.charAt(0).toUpperCase()}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{userName}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">{userRole}</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-sm ${
                  isActive(item.href) 
                    ? "bg-teal-600/10 text-teal-400 font-medium" 
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <Link href="/auth/login" className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium">
          <span>🚪</span>
          Logout
        </Link>
      </div>
    </aside>
  );
}
