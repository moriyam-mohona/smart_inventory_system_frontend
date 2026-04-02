"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getDemoCredentials, loginWithEmail } from "@/lib/auth-service";
import { saveSession } from "@/lib/session-store";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const demo = getDemoCredentials();

  function handleLogin() {
    setMessage("");

    startTransition(async () => {
      const result = await loginWithEmail({ email, password });
      setMessage(result.message);

      if (result.ok && result.session) {
        saveSession(result.session);
        router.push("/dashboard");
      }
    });
  }

  function handleDemoLogin() {
    setEmail(demo.email);
    setPassword(demo.password);
    setMessage("Demo credentials pre-filled. Click Sign In to continue.");
  }

  return (
    <main className={styles.authShell}>
      <section className={styles.authPanel}>
        <div className={styles.brandLogo}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        
        <div>
          <h1>Welcome Back</h1>
          <p className={styles.authSubtitle}>
            Access your secure inventory dashboard
          </p>
        </div>

        {message && (
          <div className={message.includes("Demo") ? styles.successMessage : styles.serverMessage}>
            {message}
          </div>
        )}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Email Address</label>
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          className={styles.btnPrimary}
          type="button"
          onClick={handleLogin}
          disabled={isPending || email.trim().length < 3 || password.length < 4}
        >
          {isPending ? "Authenticating..." : "Sign In"}
        </button>
        
        <button className={styles.btnDemo} type="button" onClick={handleDemoLogin}>
          Pre-fill Demo Credentials
        </button>

        <p className={styles.footerText}>
          Don't have an account? <Link href="/auth/signup">Create one now</Link>
        </p>
      </section>
    </main>
  );
}
