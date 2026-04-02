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
    setMessage("Demo credentials pre-filled. Click Sign In to continue.");
  }

  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow-lg shadow-teal-600/30">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">
            Access your secure inventory dashboard
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-sm font-semibold ${
            message.includes("Demo") 
              ? "bg-blue-50 text-blue-700 border border-blue-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">Password</label>
              <Link href="/auth/forgot-password" className="text-sm text-teal-700 font-bold hover:underline underline-offset-2">Forgot Password?</Link>
            </div>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all text-slate-900"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-3 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-teal-700/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          type="button"
          onClick={handleLogin}
          disabled={isPending || email.trim().length < 3 || password.length < 4}
        >
          {isPending ? "Authenticating..." : "Sign In"}
        </button>
        
        <button 
          className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-slate-200 bg-white text-slate-800 rounded-xl font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
          type="button" 
          onClick={handleDemoLogin}
        >
          Pre-fill Demo Credentials
        </button>

        <p className="text-center text-slate-500 text-sm mt-2">
          Don't have an account? <Link href="/auth/signup" className="text-teal-700 font-bold hover:underline underline-offset-2">Create one now</Link>
        </p>
      </section>
    </main>
  );
}
