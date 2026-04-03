"use client";

import { UnauthGuard } from "@/components/auth/unauth-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnauthGuard>{children}</UnauthGuard>;
}
