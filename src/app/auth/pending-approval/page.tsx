import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="w-full max-w-md mx-auto py-12 flex flex-col justify-center min-h-[calc(100vh-100px)] px-4">
      <section className="border border-slate-200 rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl p-8 flex flex-col items-center text-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-lg shadow-primary-600/10 border-4 border-white">
          <svg
            className="w-8 h-8"
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
            Registration Complete
          </h1>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Your manager account has been verified successfully. Your profile is
            currently{" "}
            <strong className="text-slate-700">Pending Admin Approval</strong>.
          </p>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            You will receive an email confirmation once the administrator has
            activated your account.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 border-2 border-slate-200 bg-white text-slate-800 rounded-xl font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          Return to Login
        </Link>
      </section>
    </main>
  );
}
