import type { UserRole } from "@/types/inventory";

export type AppRole = Extract<UserRole, "ADMIN" | "MANAGER">;

export const navigationByRole: Record<
  AppRole,
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
    { label: "Orders", href: "/dashboard/orders", icon: "📋" },
    { label: "Restock Queue", href: "/dashboard/low-stock", icon: "⚠️" },
    { label: "Users", href: "/dashboard/users", icon: "👥" },
    { label: "Activity Log", href: "/dashboard/activity", icon: "📜" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
  ],
  MANAGER: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Categories", href: "/dashboard/categories", icon: "📂" },
    { label: "Products", href: "/dashboard/products", icon: "📦" },
    { label: "Orders", href: "/dashboard/orders", icon: "📋" },
    { label: "Restock Queue", href: "/dashboard/low-stock", icon: "⚠️" },
  ],
};

const adminOnlyPrefixes = [
  "/dashboard/users",
  "/dashboard/activity",
  "/dashboard/analytics",
];

const managerOnlyPrefixes: string[] = [];

export function normalizeRole(role?: UserRole | null): AppRole {
  return role === "ADMIN" ? "ADMIN" : "MANAGER";
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  if (adminOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return role === "ADMIN";
  }

  if (managerOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return role === "MANAGER";
  }

  return pathname.startsWith("/");
}
