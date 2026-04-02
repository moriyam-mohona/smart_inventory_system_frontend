"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDispatch } from "react-redux";

import { getDemoCredentials, loginWithEmail } from "@/lib/auth-service";
import { saveSession } from "@/lib/session-store";
import { loginSchema } from "@/lib/validation/auth";
import { setUser } from "@/redux/features/auth/authSlice";
import type { UserRole } from "@/types/inventory";

function getDashboardRouteByRole(role: UserRole) {
  if (role === "ADMIN") {
    return "/dashboard";
  }
  if (role === "MANAGER") {
    return "/dashboard";
  }
  return "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  const demo = getDemoCredentials();

  function handleLogin() {
    setMessage("");
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      const nextFieldErrors: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await loginWithEmail({ email, password });
      setMessage(result.message);

      console.log(result.ok, result.session, result.accessToken);
      if (result.ok && result.session && result.accessToken) {
        console.log(result);

        saveSession(result.session);
        // Store tokens in Redux for API calls
        dispatch(
          setUser({
            user: result.session as any,
            access_token: result.accessToken,
            refresh_token: result.refreshToken || "",
          }),
        );

        router.push(getDashboardRouteByRole(result.session.role));
      }
      console.log(result);
    });
  }

  function handleDemoLogin() {
    setEmail(demo.email);
    setPassword(demo.password);
    setMessage("Demo credentials pre-filled. Click Sign In to continue.");
  }

  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center mb-2 shadow-lg shadow-primary-600/30">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access your secure inventory dashboard
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-sm font-semibold ${
              message.includes("Demo")
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900">
              Email Address
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all text-slate-900"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@company.com"
            />
            {fieldErrors.email ? (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-600 font-bold hover:underline underline-offset-2"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all text-slate-900"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 hover:text-slate-800"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                    <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-0.52 1.18-1.27 2.26-2.22 3.18" />
                    <path d="M6.61 6.61C4.62 7.86 3.12 9.75 2 12c1.73 3.89 6 7 10 7 1.63 0 3.18-0.33 4.59-0.91" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>
        </div>

        <button
          className="mt-2 w-full inline-flex items-center justify-center px-4 py-3 border border-primary-700 bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-700/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-primary-600 font-bold hover:underline underline-offset-2"
          >
            Create one now
          </Link>
        </p>
      </section>
    </main>
  );
}
