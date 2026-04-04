"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";

interface UnauthGuardProps {
  children: ReactNode;
}

export const UnauthGuard = ({ children }: UnauthGuardProps) => {
  const router = useRouter();
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (token && user) {
      router.replace("/dashboard");
    }
  }, [isMounted, token, user, router]);

  // Show full-screen overlay while hydrating or when already logged in (redirecting)
  if (!isMounted || (token && user)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F3F6F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-semibold text-sm animate-pulse tracking-wide">
            {token && user ? "Redirecting to dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
