"use client";

import { useEffect, ReactNode } from "react";
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

  useEffect(() => {
    if (token && user) {
      router.replace("/dashboard");
    }
  }, [token, user, router]);

  // If already logged in, show nothing while redirecting
  if (token && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
