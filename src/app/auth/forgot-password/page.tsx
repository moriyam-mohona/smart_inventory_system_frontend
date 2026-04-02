"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { requestPasswordReset } from "@/lib/auth-service";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email") || "";
    const expired = searchParams.get("expired") === "1";

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }

    if (expired) {
      setMessage(
        "Your previous OTP expired after 5 minutes. Please request a new OTP.",
      );
    }
  }, [searchParams]);

  function handleSubmit() {
    setMessage("");
    setFieldError("");

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message || "Enter a valid email");
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      setMessage(result.message);

      if (result.ok) {
        setTimeout(() => {
          router.push(
            `/auth/verify-otp?type=reset&email=${encodeURIComponent(email)}`,
          );
        }, 1500);
      }
    });
  }

  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col gap-6 relative overflow-hidden">
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forgot Password
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your email to receive a password reset OTP. The OTP will
            expire in 5 minutes.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-sm font-semibold border ${
              message.includes("OTP has been sent")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
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
                setFieldError("");
              }}
              placeholder="you@company.com"
            />
            {fieldError ? (
              <p className="text-xs text-red-600 mt-1">{fieldError}</p>
            ) : null}
          </div>
        </div>

        <button
          className="btn-primary"
          type="button"
          onClick={handleSubmit}
          disabled={isPending || email.trim().length < 3}
        >
          {isPending ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="text-center text-slate-500 text-sm mt-2">
          Remembered your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary-600 font-bold hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
