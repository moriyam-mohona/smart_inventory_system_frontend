import { DashboardLayout } from "@/components/dashboard-layout";
import type { UserRole } from "@/types/inventory";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user info from session store
  const userName = "John Doe";
  const userRole: UserRole = "MANAGER";

  return (
    <DashboardLayout userName={userName} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
