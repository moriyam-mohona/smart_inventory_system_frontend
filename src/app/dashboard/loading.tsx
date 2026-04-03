import React from "react";

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 h-36 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="w-24 h-5 bg-slate-200 rounded-md"></div>
              <div className="w-10 h-10 rounded-lg bg-slate-200"></div>
            </div>
            <div>
              <div className="w-16 h-8 bg-slate-200 rounded-md mb-2"></div>
              <div className="w-32 h-4 bg-slate-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Summary Section Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 h-32 flex items-center justify-between">
        <div>
          <div className="w-36 h-6 bg-slate-200 rounded-md mb-3"></div>
          <div className="w-24 h-10 bg-slate-200 rounded-md"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-36 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-36 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-36 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      {/* Quick Access Section Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="w-32 h-6 bg-slate-200 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4 h-24 flex flex-col items-center justify-center">
              <div className="w-8 h-8 bg-slate-200 rounded-md mb-2"></div>
              <div className="w-20 h-4 bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Snapshot Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="w-40 h-6 bg-slate-200 rounded-md mb-2"></div>
        <div className="w-64 h-4 bg-slate-200 rounded-md mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 h-14 flex items-center justify-between">
              <div className="w-32 h-5 bg-slate-200 rounded-md"></div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-5 bg-slate-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
