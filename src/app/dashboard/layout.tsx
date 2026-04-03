"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session-store";
import { canAccessPath, normalizeRole } from "@/lib/role-access";
import type { AuthSession } from "@/types/auth";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      router.replace("/auth/login");
      return;
    }

    setSession(activeSession);
    setReady(true);
  }, [router]);

  const userRole = useMemo(() => normalizeRole(session?.role), [session?.role]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!canAccessPath(userRole, pathname)) {
      router.replace("/dashboard");
    }
  }, [pathname, ready, router, userRole]);

  if (!ready || !session) {
    return (
      <div className="p-8 text-center text-slate-500">Loading dashboard...</div>
    );
  }

  return (
    <DashboardLayout userName={session.name} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
