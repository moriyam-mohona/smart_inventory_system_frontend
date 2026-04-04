"use client";

export default function RootLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Mesh Background Blobs (Consistent with Theme) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-200/20 blur-[120px] rounded-full animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse duration-[6000ms] delay-700"></div>
      </div>

      <section className="relative z-10 w-full max-w-sm mx-auto p-12 text-center">
        {/* Animated Brand Identity */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative group">
            {/* Pulsing ring around logo */}
            <div className="absolute -inset-4 bg-primary-500/10 rounded-[32px] blur-2xl animate-pulse group-hover:bg-primary-500/20 transition-all duration-700"></div>
            
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700 text-white shadow-2xl shadow-primary-900/30 ring-1 ring-white/20 transform transition-transform duration-1000 animate-bounce-subtle">
              <svg 
                className="w-10 h-10" 
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
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-[0.2em] opacity-80">
              StockControl
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-ping"></span>
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Initializing Asset Engine</span>
            </div>
          </div>
        </div>

        {/* Dynamic Loading Meter */}
        <div className="w-full max-w-[200px] mx-auto h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full w-2/3 animate-loading-slide shadow-[0_0_12px_rgba(27,71,93,0.3)]"></div>
        </div>

        <p className="mt-6 text-[12px] font-bold text-slate-400 uppercase tracking-[0.1em] animate-pulse">
           Synchronizing Operations...
        </p>
      </section>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes loading-slide {
          0% { transform: translateX(-100%); width: 30%; }
          50% { transform: translateX(50%); width: 60%; }
          100% { transform: translateX(150%); width: 30%; }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .animate-loading-slide {
          animation: loading-slide 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
