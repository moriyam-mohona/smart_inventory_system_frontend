"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signupWithEmail } from "@/lib/auth-service";
import type { UserRole } from "@/types/inventory";

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

      if (result.ok) {
        router.push("/dashboard");
      }
    });
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="eyebrow">Authentication</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Signup is frontend-only for now and ready to connect to your Node.js
          backend later.
        </p>

        <label className="field">
          Full Name
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
          />
        </label>

        <label className="field">
          Email
          <input
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@company.com"
          />
        </label>

        <label className="field">
          Password
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
        </label>

        <label className="field">
          Role
          <select
            className="input"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <div className="auth-actions">
          <button
            className="btn primary"
            type="button"
            onClick={handleSignup}
            disabled={
              isPending ||
              name.trim().length < 2 ||
              email.trim().length < 3 ||
              password.length < 8
            }
          >
            {isPending ? "Creating..." : "Create account"}
          </button>
          <Link className="btn" href="/auth/login">
            Back to login
          </Link>
        </div>

        {message ? <p className="server-message">{message}</p> : null}

        <p className="auth-footnote">
          Already registered? <Link href="/auth/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
