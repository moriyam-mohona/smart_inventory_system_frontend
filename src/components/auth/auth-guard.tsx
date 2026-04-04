"use client";

import { useEffect, useState, ReactNode } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 1. Not authenticated → redirect to login
    if (!token || !user) {
      router.replace("/auth/login");
      return;
    }

    // 2. Check Role-based access
    const userRole = normalizeRole(user.role);
    if (!canAccessPath(userRole, pathname)) {
      router.replace("/dashboard");
    }
  }, [isMounted, token, user, pathname, router]);

  // Show full-screen overlay while checking auth or redirecting
  if (!isMounted || !token || !user) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F3F6F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-semibold text-sm animate-pulse tracking-wide">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
