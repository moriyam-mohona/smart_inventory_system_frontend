"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { resetPassword } from "@/lib/auth-service";
import { resetPasswordSchema } from "@/lib/validation/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const resetToken = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  function handleReset() {
    setMessage("");
    setFieldErrors({});

    const parsed = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!parsed.success) {
      const nextFieldErrors: {
        newPassword?: string;
        confirmPassword?: string;
      } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "newPassword" || key === "confirmPassword") {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(email, newPassword, resetToken);
      setMessage(result.message);

      if (result.ok) {
        setTimeout(() => {
          router.push("/auth/login");
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
          Create new password
        </h1>
        <p className="text-slate-600 font-medium text-[16px]">
          Set a new strong password for your account associated with{" "}
          <strong className="text-primary-900 font-bold">{email}</strong>.
        </p>
      </div>

      <section className="card-glass p-8 sm:p-10 w-full mb-8">
        {message && (
          <div
            className={`p-4 rounded-xl text-[14px] font-bold mb-6 flex items-center gap-3 border backdrop-blur-md ${
              message.includes("successfully")
                ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                : "bg-red-500/10 text-red-800 border-red-500/30"
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {message.includes("successfully") ? (
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
              New Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl px-4 py-3.5 pr-12 text-[15px]"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 inline-flex items-center text-slate-400 hover:text-primary-700 transition-colors"
              >
                {showNewPassword ? (
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
            {fieldErrors.newPassword ? (
              <p className="text-[13px] text-red-600 font-bold mt-1">{fieldErrors.newPassword}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-slate-800 tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-xl px-4 py-3.5 pr-12 text-[15px]"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 inline-flex items-center text-slate-400 hover:text-primary-700 transition-colors"
              >
                {showConfirmPassword ? (
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
            {fieldErrors.confirmPassword ? (
              <p className="text-[13px] text-red-600 font-bold mt-1">{fieldErrors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="pt-2">
            <button
              className="btn-primary w-full shadow-lg"
              type="button"
              onClick={handleReset}
              disabled={
                isPending || newPassword.length < 8 || confirmPassword.length < 8
              }
            >
              {isPending ? "Updating password..." : "Update password"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <Suspense
        fallback={
          <div className="p-8 text-center text-primary-900 font-bold backdrop-blur-md bg-white/50 rounded-xl">Loading...</div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
