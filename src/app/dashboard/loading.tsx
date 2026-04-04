"use client";

import React from "react";

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8 fade-in">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="w-64 h-8 bg-slate-200/60 rounded-xl shimmer-bg"></div>
          <div className="w-96 h-4 bg-slate-200/40 rounded-lg shimmer-bg"></div>
        </div>
        <div className="w-32 h-10 bg-white/50 border border-white rounded-2xl shimmer-bg shadow-sm"></div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-glass p-6 h-40 flex flex-col justify-between border-white/60">
            <div className="flex items-start justify-between mb-4">
              <div className="w-24 h-5 bg-slate-200/60 rounded-md shimmer-bg"></div>
              <div className="w-12 h-12 rounded-2xl bg-slate-200/40 shimmer-bg"></div>
            </div>
            <div className="space-y-3">
              <div className="w-20 h-10 bg-slate-200/60 rounded-xl shimmer-bg"></div>
              <div className="w-32 h-4 bg-slate-200/40 rounded-md shimmer-bg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feature Highlight Skeleton (e.g. Revenue) */}
      <div className="card-glass p-8 h-36 flex flex-col md:flex-row items-center justify-between gap-6 border-white/60">
        <div className="space-y-3">
          <div className="w-36 h-6 bg-slate-200/60 rounded-md shimmer-bg"></div>
          <div className="w-48 h-12 bg-primary-500/10 rounded-2xl shimmer-bg"></div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-36 h-12 bg-slate-200/40 rounded-2xl shimmer-bg"></div>
          <div className="w-36 h-12 bg-slate-200/40 rounded-2xl shimmer-bg"></div>
          <div className="w-36 h-12 bg-slate-200/60 rounded-2xl shimmer-bg"></div>
        </div>
      </div>

      {/* Section Skeleton (Quick Access / Activity) */}
      <div className="card-glass p-8 border-white/60">
        <div className="w-40 h-6 bg-slate-200/60 rounded-md mb-8 shimmer-bg"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl h-32 shimmer-bg">
              <div className="w-10 h-10 bg-slate-200/60 rounded-xl mb-4 shimmer-bg"></div>
              <div className="w-24 h-4 bg-slate-200/40 rounded-md shimmer-bg"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .shimmer-bg {
          position: relative;
          overflow: hidden;
        }
        .shimmer-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
          0% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
