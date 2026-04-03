"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session-store";

export default function SessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.push("/dashboard");
    }
  }, [router]);

  return null;
}
