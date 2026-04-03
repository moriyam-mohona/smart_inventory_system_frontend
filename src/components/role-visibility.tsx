"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import type { UserRole } from "@/types/inventory";

interface RoleVisibilityProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export function RoleVisibility({ roles, children }: RoleVisibilityProps) {
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role ?? null;

  if (!role || !roles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
