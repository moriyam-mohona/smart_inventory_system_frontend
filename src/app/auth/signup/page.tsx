"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signupWithEmail } from "@/lib/auth-service";
import { signupSchema } from "@/lib/validation/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  function handleSignup() {
    setMessage("");
    setFieldErrors({});

    const parsed = signupSchema.safeParse({ name, email, password });

    if (!parsed.success) {
      const nextFieldErrors: {
        name?: string;
        email?: string;
        password?: string;
      } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "password") {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await signupWithEmail({
        name,
        email,
        password,
        role: "MANAGER",
      });
      setMessage(result.message);

      if (result.ok) {
        setTimeout(() => {
          router.push(
            `/auth/verify-otp?type=signup&email=${encodeURIComponent(email)}`,
          );
        }, 1500);
      }
    });
  }

  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden">
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
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h1>
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
            <label className="text-sm font-semibold text-slate-900">
              Full Name
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all text-slate-900"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="John Doe"
            />
            {fieldErrors.name ? (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
            ) : null}
          </div>

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
            <label className="text-sm font-semibold text-slate-900">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all text-slate-900"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="At least 8 characters"
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
          className="btn-primary"
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
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary-600 font-bold hover:underline underline-offset-2"
          >
            Sign in here
          </Link>
        </p>
      </section>
    </main>
  );
}
