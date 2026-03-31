"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getDemoCredentials, loginWithEmail } from "@/lib/auth-service";
import { saveSession } from "@/lib/session-store";

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
    setMessage("Demo credentials pre-filled. Click Sign in to continue.");
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="eyebrow">Authentication</p>
        <h1>Sign in to Smart Inventory</h1>
        <p className="auth-subtitle">
          Use your email and password to access the operations dashboard.
        </p>

        <label className="field">
          Email
          <input
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="manager@smartinventory.dev"
          />
        </label>

        <label className="field">
          Password
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </label>

        <div className="auth-actions">
          <button
            className="btn primary"
            type="button"
            onClick={handleLogin}
            disabled={
              isPending || email.trim().length < 3 || password.length < 4
            }
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
          <button className="btn" type="button" onClick={handleDemoLogin}>
            Demo Login
          </button>
        </div>

        {message ? <p className="server-message">{message}</p> : null}

        <p className="auth-footnote">
          New here? <Link href="/auth/signup">Create your account</Link>
        </p>
      </section>
    </main>
  );
}
