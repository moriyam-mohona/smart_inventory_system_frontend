"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { normalizeRole } from "@/lib/role-access";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectCurrentUser);
  const userRole = normalizeRole(user?.role);

  return (
    <AuthGuard>
      <DashboardLayout userName={user?.name || ""} userRole={userRole}>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
