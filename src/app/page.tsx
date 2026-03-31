"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has session, redirect to dashboard
    const userSession =
      typeof window !== "undefined"
        ? localStorage.getItem("user_session")
        : null;
    if (userSession) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section className="auth-shell">
        <div className="auth-panel">
          <p className="eyebrow">Welcome</p>
          <h1>Smart Inventory Management</h1>
          <p className="auth-subtitle">
            Manage your products, inventory, and orders efficiently
          </p>

          <p
            style={{
              marginTop: "2rem",
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "var(--text-soft)",
            }}
          >
            Please login to continue
          </p>

          <div className="auth-actions">
            <Link href="/auth/login" className="btn primary">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
