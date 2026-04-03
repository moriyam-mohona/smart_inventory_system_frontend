"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { canAccessPath, normalizeRole } from "@/lib/role-access";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    // 1. Check if user is logged in
    if (!token || !user) {
      router.replace("/auth/login");
      return;
    }

    // 2. Check Role-based access
    const userRole = normalizeRole(user.role);
    if (!canAccessPath(userRole, pathname)) {
      router.replace("/dashboard");
    }
  }, [token, user, pathname, router]);

  // If no auth data, show nothing (or a loader)
  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
