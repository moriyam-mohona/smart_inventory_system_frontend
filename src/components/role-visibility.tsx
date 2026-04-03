"use client";

import { useEffect, useState } from "react";

import { getSession } from "@/lib/session-store";
import type { UserRole } from "@/types/inventory";

interface RoleVisibilityProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export function RoleVisibility({ roles, children }: RoleVisibilityProps) {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setRole(getSession()?.role ?? null);
  }, []);

  if (!role || !roles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
