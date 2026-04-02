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
        <div className="flex items-center gap-2 font-bold text-xl text-primary-700">
          <svg
            className="w-8 h-8 text-primary-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
          SmartInventory
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="font-semibold text-slate-600 hover:text-primary-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2.5 rounded-xl bg-primary-700 text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-sm tracking-widest uppercase mb-6 border border-primary-200">
          Next-Gen Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6">
          Operations made seamless, stock kept precise.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          The ultimate Smart Inventory & Order Management System. Build your
          operations entirely on fully validated fulfillment workflows with
          intelligent conflict handling out-of-the-box.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/auth/signup"
            className="px-8 py-4 rounded-xl bg-primary-700 text-white font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all shadow-primary-700/20"
          >
            Start for free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-lg hover:border-primary-700 hover:text-primary-700 transition-all"
          >
            View Live Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
