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
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-accent" />
          <div>
            <p className="sidebar-brand-title">Smart Inventory</p>
            <p className="sidebar-brand-subtitle">Management</p>
          </div>
        </div>
      </div>

      <div className="sidebar-user-info">
        <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
        <div className="user-details">
          <p className="user-name">{userName}</p>
          <p className="user-role">{userRole}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">Menu</p>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link href="/auth/login" className="logout-btn">
          <span>🚪</span>
          Logout
        </Link>
      </div>
    </aside>
  );
}
