"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signupWithEmail } from "@/lib/auth-service";
import { saveSession } from "@/lib/session-store";
import type { UserRole } from "@/types/inventory";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MANAGER");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSignup() {
    setMessage("");

    startTransition(async () => {
      const result = await signupWithEmail({ name, email, password, role });
      setMessage(result.message);

      if (result.ok && result.session) {
        saveSession(result.session);
        router.push("/dashboard");
      }
    });
  }

  return (
    <main className={styles.authShell}>
      <section className={styles.authPanel}>
        <div className={styles.brandLogo}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        
        <div>
          <h1>Create Account</h1>
          <p className={styles.authSubtitle}>
            Join your smart inventory system
          </p>
        </div>

        {message && <div className={styles.serverMessage}>{message}</div>}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div className={styles.field}>
            <label>Role</label>
            <select
              className={styles.input}
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="MANAGER" style={{color: "black"}}>Manager</option>
              <option value="ADMIN" style={{color: "black"}}>Administrator</option>
            </select>
          </div>
        </div>

        <button
          className={styles.btnPrimary}
          type="button"
          onClick={handleSignup}
          disabled={
            isPending ||
            name.trim().length < 2 ||
            email.trim().length < 3 ||
            password.length < 8
          }
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link href="/auth/login">Sign in here</Link>
        </p>
      </section>
    </main>
  );
}
