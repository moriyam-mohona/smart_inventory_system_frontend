"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, Suspense } from "react";
import { verifyOtp } from "@/lib/auth-service";
import { verifyOtpSchema } from "@/lib/validation/auth";

const RESET_OTP_EXPIRY_MS = 5 * 60 * 1000;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = (searchParams.get("type") as "signup" | "reset") || "signup";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [expiresAt] = useState(() => Date.now() + RESET_OTP_EXPIRY_MS);
  const [secondsLeft, setSecondsLeft] = useState(300);

  const isResetFlow = type === "reset";

  const countdownLabel = useMemo(() => {
    const safeSeconds = Math.max(0, secondsLeft);
    const min = Math.floor(safeSeconds / 60);
    const sec = safeSeconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, [secondsLeft]);

  useEffect(() => {
    if (!isResetFlow || !email) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(next);
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      router.replace(
        `/auth/forgot-password?email=${encodeURIComponent(email)}&expired=1`,
      );
    }, RESET_OTP_EXPIRY_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [email, expiresAt, isResetFlow, router]);

  function handleVerify() {
    setMessage("");
    setFieldError("");

    const parsed = verifyOtpSchema.safeParse({ otp });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message || "Invalid OTP");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtp(email, otp, type);
      setMessage(result.message);

      if (result.ok) {
        setTimeout(() => {
          if (type === "signup") {
            router.push("/auth/pending-approval");
          } else {
            // For reset password flow, navigate with the reset token
            const resetToken = result.resetToken || "";
            router.push(
              `/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`,
            );
          }
        }, 1500);
      }
    });
  }

  return (
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
          Verify your email
        </h1>
        <p className="text-slate-600 font-medium text-[16px]">
          Enter the 6-digit verification code sent to{" "}
          <strong className="text-primary-900 font-bold">{email}</strong>.
        </p>
        {isResetFlow && (
          <p className="text-[13px] font-bold text-accent-600 mt-2">
            Code expires in {countdownLabel}
          </p>
        )}
      </div>

      <section className="card-glass p-8 sm:p-10 w-full mb-8">
        {message && (
          <div
            className={`p-4 rounded-xl text-[14px] font-bold mb-6 flex items-center gap-3 border backdrop-blur-md ${
              resultMessageIsSuccess(message)
                ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                : "bg-red-500/10 text-red-800 border-red-500/30"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {resultMessageIsSuccess(message) ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-3">
            <input
              className="w-full rounded-xl px-4 py-4 text-[15px] text-center tracking-[0.5em] font-mono text-xl md:text-2xl"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                setFieldError("");
              }}
              placeholder="• • • • • •"
            />
            {fieldError && (
              <p className="text-[13px] text-red-600 font-bold text-center">{fieldError}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              className="btn-primary w-full shadow-lg"
              type="button"
              onClick={handleVerify}
              disabled={
                isPending || otp.length !== 6 || (isResetFlow && secondsLeft <= 0)
              }
            >
              {isPending ? "Verifying..." : "Verify code"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function resultMessageIsSuccess(msg: string) {
  return msg.includes("complete") || msg.includes("success");
}

export default function VerifyOtpPage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <Suspense
        fallback={
          <div className="p-8 text-center text-primary-900 font-bold backdrop-blur-md bg-white/50 rounded-xl">Loading...</div>
        }
      >
        <VerifyOtpContent />
      </Suspense>
    </main>
  );
}
