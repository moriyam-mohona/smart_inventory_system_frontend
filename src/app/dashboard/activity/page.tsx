"use client";

import { useGetActivityLogsQuery } from "@/redux/features/activity-log/activityLogApi";
import { format } from "date-fns"; // Standard in many projects, but native Date is fine. We'll stick to native Date to avoid missing deps.

export default function ActivityLogPage() {
  const { data, isLoading, error } = useGetActivityLogsQuery({});
  
  const activities = data?.data || data?.items || data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
        Failed to load activity logs.
      </div>
    );
  }

  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm mb-8">
        <h2>Activity Log</h2>
        <p className="card-subtitle text-slate-500 text-sm mt-1">
          Track recent system activities and changes
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        {activities.length > 0 ? (
          <ul className="grid gap-4 list-none p-0">
            {activities.map((activity: any) => (
              <li 
                key={activity.id || activity._id}
                className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <strong className="text-slate-800 text-sm">{activity.message || activity.action}</strong>
                    <span className="text-slate-400 text-xs whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {(activity.entityType || activity.user?.name) && (
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      {activity.user?.name && (
                        <span>By: <span className="font-semibold text-slate-700">{activity.user.name}</span></span>
                      )}
                      {activity.entityType && (
                        <span>Entity: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{activity.entityType}</span></span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8 text-slate-500 italic">
            No activities recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
