"use client";

import { useGetActivityLogsQuery } from "@/redux/features/activity-log/activityLogApi";

function getActivityMeta(type: string, action: string) {
  const t = (type || "").toUpperCase();
  const a = (action || "").toUpperCase();

  if (t === "USER" || a.startsWith("USER_")) {
    return {
      color: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: "Account Management",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200/60",
    };
  }
  if (t === "PRODUCT" || a.startsWith("PRODUCT_")) {
    return {
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: "Stock & Inventory",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    };
  }
  if (t === "CATEGORY" || a.startsWith("CATEGORY_")) {
    return {
      color: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      label: "Architecture",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-200/60",
    };
  }
  if (t === "ORDER" || a.startsWith("ORDER_")) {
    return {
      color: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      label: "Sales Flow",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200/60",
    };
  }
  if (a.startsWith("STOCK_") || a.startsWith("RESTOCK_")) {
    return {
      color: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/20",
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      label: "Logistics",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200/60",
    };
  }
  return {
    color: "bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-500/20",
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Operation",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200/60",
  };
}

export default function ActivityLogPage() {
  const { data, isLoading, error } = useGetActivityLogsQuery({});
  
  const activities = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).slice(0, 50);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur min-h-[160px] animate-pulse" />
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8">
           <div className="space-y-4">
             {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-200 text-center font-bold">
        Failed to load audit trail. Please refresh or try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur p-8 sm:p-10">
        <p className="label-caps text-primary-700">
          Security & Audit
        </p>
        <h1 className="mt-2 leading-tight">
          System activity trail
        </h1>
        <p className="card-subtitle mt-2 max-w-2xl">
          Real-time tracking of administrative actions, inventory movements, and account synchronization.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur overflow-hidden">
        <div className="border-b border-slate-100 px-8 py-5 flex justify-between items-center">
            <h3>Recent Timeline</h3>
            <span className="label-caps bg-slate-50 px-3 py-1 rounded-full border border-slate-100 !text-slate-400">
              Live Updates
            </span>
        </div>

        <div className="p-4 sm:p-6">
          {activities.length > 0 ? (
            <ul className="grid gap-3 list-none p-0">
              {activities.map((activity: any) => {
                const meta = getActivityMeta(activity.entityType, activity.action);
                
                return (
                  <li 
                    key={activity.id || activity._id}
                    className="group relative flex items-start gap-5 p-5 border border-slate-100/80 rounded-[22px] bg-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-primary-100/50"
                  >
                    {/* Visual Connector Line (Conceptual) */}
                    <div className="absolute left-[38px] top-[74px] bottom-[-22px] w-[1px] bg-slate-100 last:hidden" />

                    {/* Icon Circle */}
                    <div className={`mt-0.5 w-11 h-11 rounded-2xl ${meta.color} flex items-center justify-center flex-shrink-0 shadow-lg transform transition-transform group-hover:scale-110`}>
                      {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`label-caps px-2 py-0.5 rounded-md border ${meta.badgeClass}`}>
                              {meta.label}
                            </span>
                            <span className="text-slate-400 font-bold text-xs">•</span>
                            <span className="label-caps !text-slate-500 !tracking-normal">
                              {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[15px] font-bold text-slate-800 leading-snug group-hover:text-primary-800 transition-colors mb-0">
                            {activity.message || activity.action.replace(/_/g, " ")}
                          </p>
                        </div>

                        <span className="label-caps bg-slate-50/50 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-100 self-start sm:self-center">
                          {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
                        {activity.user?.name && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200">
                                {activity.user.name[0]}
                            </div>
                            <span className="text-slate-500 font-medium whitespace-nowrap">
                              By <span className="text-slate-900 font-bold underline decoration-slate-200 underline-offset-4">{activity.user.name}</span>
                            </span>
                          </div>
                        )}
                        {activity.entityType && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 label-caps">
                            <span className="text-slate-400">Target:</span>
                            <span>{activity.entityType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
               <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl mb-4 border border-slate-100 shadow-inner">
                  🎭
               </div>
               <h3 className="mb-0">Clear Audit Trail</h3>
               <p className="card-subtitle max-w-xs mx-auto">
                 No activities have been logged in the system matching your current filter.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

