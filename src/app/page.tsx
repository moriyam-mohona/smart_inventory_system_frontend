"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has session, redirect to dashboard
    const userSession =
      typeof window !== "undefined"
        ? localStorage.getItem("user_session")
        : null;
    if (userSession) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-xl text-teal-800">
          <svg className="w-8 h-8 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          SmartInventory
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="font-semibold text-slate-600 hover:text-teal-700 transition-colors">Sign In</Link>
          <Link href="/auth/signup" className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">Get Started</Link>
        </div>
      </nav>

      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 font-bold text-sm tracking-widest uppercase mb-6 border border-teal-200">Next-Gen Platform</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Operations made seamless, stock kept precise.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          The ultimate Smart Inventory & Order Management System. Build your operations entirely on fully validated fulfillment workflows with intelligent conflict handling out-of-the-box.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/auth/signup" className="px-8 py-4 rounded-xl bg-teal-700 text-white font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all shadow-teal-700/20">
            Start for free
          </Link>
          <Link href="/auth/login" className="px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-lg hover:border-teal-700 hover:text-teal-700 transition-all">
            View Live Demo
          </Link>
        </div>
      </section>

      <section className="relative px-6 py-24 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent Inventory</h3>
            <p className="text-slate-600 leading-relaxed">
              Track multiple product variations and manage stock levels in absolute real-time. Define low-stock thresholds to automate reordering.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Fulfillment Workflows</h3>
            <p className="text-slate-600 leading-relaxed">
              Streamline customer order progression from preparation to shipping. Our engine ensures 100% operational fidelity during peak sales.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conflict Validation</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced monitoring instantly flags stock irregularities and prevents overselling, keeping concurrency and multi-user environments pristine.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
