import Link from "next/link";

export default function PendingApprovalPage() {
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
            Registration complete
          </h1>
          <p className="text-slate-600 font-medium text-[16px]">
            Your manager account has been verified successfully.
          </p>
        </div>

        <section className="card-glass p-8 sm:p-10 w-full mb-8 flex flex-col items-center text-center">
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 border-[6px] border-white/60 shadow-glass ring-1 ring-emerald-500/20 backdrop-blur-md">
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                <path d="M12 8V12L15 15"></path>
              </svg>
            </div>

            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 mb-3 tracking-wide">
                Pending Admin Approval
              </h2>
              <p className="text-slate-600 font-medium text-[15px] leading-relaxed">
                You will receive an email confirmation once the administrator has
                activated your account.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="mt-8 btn-primary w-full shadow-lg"
            >
              Return to sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
