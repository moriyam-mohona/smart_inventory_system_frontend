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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
            Forgot password
          </h1>
          <p className="text-slate-600 font-medium text-[16px]">
            Enter your email to receive a password reset OTP.
          </p>
        </div>

        <section className="card-glass p-8 sm:p-10 w-full mb-8">
          {message && (
            <div
              className={`p-4 rounded-xl text-[14px] font-bold mb-6 flex items-center gap-3 border backdrop-blur-md ${
                message.includes("OTP has been sent")
                  ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                  : "bg-red-500/10 text-red-800 border-red-500/30"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {message.includes("OTP has been sent") ? (
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
                Email Address
              </label>
              <input
                className="w-full rounded-xl px-4 py-3.5 text-[15px]"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldError("");
                }}
                placeholder="developer@example.com"
              />
              {fieldError && (
                <p className="text-[13px] text-red-600 font-bold mt-1">{fieldError}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                className="btn-primary w-full shadow-lg"
                type="button"
                onClick={handleSubmit}
                disabled={isPending || email.trim().length < 3}
              >
                {isPending ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </div>
        </section>

        <p className="text-center text-slate-600 font-medium text-[15px]">
          Remembered your password?{" "}
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
