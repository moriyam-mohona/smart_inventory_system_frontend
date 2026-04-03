"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";

export default function SessionRedirect() {
  const router = useRouter();
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (token && user) {
      router.push("/dashboard");
    }
  }, [token, user, router]);

  return null;
}
