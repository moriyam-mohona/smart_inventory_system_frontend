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
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verify OTP
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Enter the 6-digit verification code sent to{" "}
          <strong className="text-slate-700">{email}</strong>.
          {type === "reset" && " This code expires in 5 minutes."}
        </p>
        {isResetFlow ? (
          <p className="text-xs font-semibold text-amber-700 mt-2">
            OTP expires in {countdownLabel}
          </p>
        ) : null}
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold border ${
            resultMessageIsSuccess(message)
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
            One-Time Password
          </label>
          <input
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all text-slate-900 text-center tracking-[0.5em] font-mono text-xl"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, ""));
              setFieldError("");
            }}
            placeholder="• • • • • •"
          />
          {fieldError ? (
            <p className="text-xs text-red-600 text-center mt-1">
              {fieldError}
            </p>
          ) : null}
          <p className="text-xs text-slate-400 text-center mt-1">
            Demo Code: 123456
          </p>
        </div>
      </div>

      <button
        className="btn-primary"
        type="button"
        onClick={handleVerify}
        disabled={
          isPending || otp.length !== 6 || (isResetFlow && secondsLeft <= 0)
        }
      >
        {isPending ? "Verifying..." : "Verify OTP"}
      </button>
    </section>
  );
}

function resultMessageIsSuccess(msg: string) {
  return msg.includes("complete");
}

export default function VerifyOtpPage() {
  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-500">Loading...</div>
        }
      >
        <VerifyOtpContent />
      </Suspense>
    </main>
  );
}
