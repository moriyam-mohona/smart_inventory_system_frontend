"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signupWithEmail } from "@/lib/auth-service";
import { saveSession } from "@/lib/session-store";
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
      const result = await signupWithEmail({ name, email, password, role: "MANAGER" });
      setMessage(result.message);

      if (result.ok) {
        setTimeout(() => {
          router.push(`/auth/verify-otp?type=signup&email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    });
  }

  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow-lg shadow-teal-600/30">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">
            Join your smart inventory system
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900">Full Name</label>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all text-slate-900"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900">Email Address</label>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all text-slate-900"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900">Password</label>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all text-slate-900"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

        </div>

        <button
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-3 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-teal-700/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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

        <p className="text-center text-slate-500 text-sm mt-2">
          Already have an account? <Link href="/auth/login" className="text-teal-700 font-bold hover:underline underline-offset-2">Sign in here</Link>
        </p>
      </section>
    </main>
  );
}
