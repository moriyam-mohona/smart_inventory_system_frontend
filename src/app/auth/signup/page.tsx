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
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="w-full max-w-[460px] z-10 flex flex-col items-center">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10 w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 text-white flex items-center justify-center mb-6 shadow-lg shadow-primary-900/30 border border-white/20 backdrop-blur-sm">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-slate-600 font-medium text-[16px]">
            Join the smart inventory platform.
          </p>
        </div>

        <section className="card-glass p-8 sm:p-10 w-full mb-8">
          {message && (
            <div
              className={`p-4 rounded-xl text-[14px] font-bold mb-6 flex items-center gap-3 border backdrop-blur-md ${
                message.includes("success") || message.includes("Sent")
                  ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                  : "bg-red-500/10 text-red-800 border-red-500/30"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {message.includes("success") || message.includes("Sent") ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {message}
            </div>
          )}

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-slate-800 tracking-wide">
                Full Name
              </label>
              <input
                className="w-full rounded-xl px-4 py-3.5 text-[15px]"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="John Doe"
              />
              {fieldErrors.name && (
                <p className="text-[13px] text-red-600 font-bold mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-slate-800 tracking-wide">
                Email Address
              </label>
              <input
                className="w-full rounded-xl px-4 py-3.5 text-[15px]"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="developer@example.com"
              />
              {fieldErrors.email && (
                <p className="text-[13px] text-red-600 font-bold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-slate-800 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-xl px-4 py-3.5 pr-12 text-[15px]"
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
                  className="absolute inset-y-0 right-4 inline-flex items-center text-slate-400 hover:text-primary-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-0.52 1.18-1.27 2.26-2.22 3.18" />
                      <path d="M6.61 6.61C4.62 7.86 3.12 9.75 2 12c1.73 3.89 6 7 10 7 1.63 0 3.18-0.33 4.59-0.91" />
                    </svg>
                  ) : (
                    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[13px] text-red-600 font-bold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                className="btn-primary w-full shadow-lg"
                type="button"
                onClick={handleSignup}
                disabled={
                  isPending ||
                  name.trim().length < 2 ||
                  email.trim().length < 3 ||
                  password.length < 8
                }
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </div>
          </div>
        </section>

        <p className="text-center text-slate-600 font-medium text-[15px]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary-800 font-bold hover:text-primary-900 hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
