import Link from "next/link";
import SessionRedirect from "@/components/SessionRedirect";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">
      <SessionRedirect />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex items-center gap-3 font-extrabold text-2xl text-primary-950 tracking-tighter">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-950 to-primary-700 text-white shadow-lg shadow-primary-900/20 ring-1 ring-white/20">
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <title>Stock Control System Logo</title>
                <polyline points="21 8 21 21 3 21 3 8"></polyline>
                <rect x="1" y="3" width="22" height="5"></rect>
                <line x1="10" y1="12" x2="14" y2="12"></line>
             </svg>
          </div>
          StockControl<span className="text-primary-600">.</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/auth/login"
            className="hidden sm:block text-sm font-bold text-slate-900 hover:text-primary-700 transition-colors uppercase tracking-widest"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-2xl bg-primary-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-950/30 transition-all active:scale-95 ring-1 ring-white/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-40 pb-24 md:pt-40 md:pb-20 flex flex-col items-center justify-center text-center z-10">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/50 backdrop-blur-md text-primary-700 font-bold text-[10px] tracking-[0.3em] uppercase mb-8 border border-white shadow-xl shadow-primary-950/5">
           Built for high-velocity teams
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight max-w-5xl mb-8 leading-[0.9] text-balance">
          Operations Made  
          <span className="relative inline-block mx-4">
             <span className="text-primary-600 font-extrabold">Perfect.</span>
             <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-primary-200 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none" fill="currentColor">
                <path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" strokeWidth="2" fill="none" />
             </svg>
          </span>
          Stock Kept Precise.
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-3xl mb-14 font-normal leading-relaxed text-pretty">
          The next-generation Stock Control System for intelligent enterprises. 
          Manage supply chains, automated fulfillment, and data integrity with a modern glassmorphic interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4">
          <Link
            href="/auth/signup"
            className="px-10 py-5 rounded-[22px] bg-primary-700 text-white font-bold text-sm uppercase tracking-widest hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary-700/40 transition-all active:scale-95 ring-1 ring-white/20"
          >
            Start Operations Free
          </Link>
          <Link
            href="/auth/login"
            className="px-10 py-5 rounded-[22px] bg-white text-slate-900 font-bold text-sm uppercase tracking-widest border border-slate-200 hover:border-primary-700 hover:text-primary-700 hover:shadow-xl transition-all active:scale-95 shadow-sm"
          >
            Explore Live Demo
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative px-6 py-24 md:px-12 bg-white/30 backdrop-blur-sm z-10 border-y border-white/60">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Live Inventory Registry", 
                desc: "High-precision asset tracking with real-time audit trails and conflict-free stock mutations.", 
                icon: "📦",
                gradient: "from-blue-500/10 to-blue-500/5"
              },
              { 
                title: "Automated Fulfillment", 
                desc: "Intelligent order processing workflows with status integrity and management oversight.", 
                icon: "📋",
                gradient: "from-amber-500/10 to-amber-500/5"
              },
              { 
                title: "Asset Intelligence", 
                desc: "Deep analytics on stock lifecycle, restock thresholds, and operational velocity dashboards.", 
                icon: "📈",
                gradient: "from-emerald-500/10 to-emerald-500/5"
              }
            ].map((feature, i) => (
              <div key={i} className={`group p-8 md:p-10 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden`}>
                 <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-60`}></div>
                 <div className="text-4xl mb-6 relative z-10">{feature.icon}</div>
                 <h3 className="text-lg font-bold text-slate-950 mb-3 relative z-10">{feature.title}</h3>
                 <p className="text-slate-500 font-normal leading-relaxed mb-0 relative z-10">{feature.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 md:px-12 bg-slate-50 z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 pt-12">
            <div className="flex items-center gap-3 font-extrabold text-xl text-primary-950 uppercase tracking-tighter opacity-60">
              StockControl<span className="text-primary-600">.</span>
            </div>
       
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
               &copy; 2026 Stock Control System. All Rights Reserved.
            </div>
         </div>
      </footer>
    </main>
  );
}
