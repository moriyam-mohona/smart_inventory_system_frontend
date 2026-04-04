"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  useGetAdminDashboardQuery,
  useGetManagerDashboardQuery,
} from "@/redux/features/analytics/analyticsApi";

export default function AnalyticsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const { data: adminRes, isLoading: adminLoading } = useGetAdminDashboardQuery("month", {
    skip: role !== "ADMIN",
  });

  const { data: managerRes, isLoading: managerLoading } = useGetManagerDashboardQuery(undefined, {
    skip: role !== "MANAGER",
  });

  if (adminLoading || managerLoading) {
    return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading analytics dashboard...</div>;
  }

  const adminData = adminRes?.data;
  const managerData = managerRes?.data;

  if (role === "ADMIN" && adminData) {
    return <AdminAnalyticsView data={adminData} />;
  }

  if (role === "MANAGER" && managerData) {
    return <ManagerAnalyticsView data={managerData} />;
  }

  return (
    <div className="p-12 text-center text-slate-500 font-medium">
      Unable to load analytics. Please ensure you have the correct permissions.
    </div>
  );
}

function AdminAnalyticsView({ data }: { data: any }) {
  const summary = data.summary;
  const stock = data.stockLifecycle;
  const fulfillment = data.fulfillmentStatus;
  const revenue = data.revenueAnalytics;

  return (
    <div className="space-y-6 w-full fade-in">
      {/* Header Section */}
      <div className="card-glass p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="mb-0">Admin Analytics & Reports</h2>
          <p className="card-subtitle mt-1">
            Real-time business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="badge badge-info shadow-sm px-4 py-2 text-sm ring-1 ring-primary-500/20 backdrop-blur-xl bg-white/50">
            System-wide Overview
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Card */}
        <div className="card-glass p-6 group hover:-translate-y-1 transition-transform duration-300">
          <h3 className="label-caps mb-2 !text-slate-500">Total Orders</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800">
              {summary.totalOrdersThisMonth}
            </span>
            <span className="label-caps !text-slate-400 !tracking-normal">This month</span>
          </div>
          <div className="mt-5 h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 w-full rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="card-glass p-6 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
             <div className="w-24 h-24 rounded-full bg-amber-500 blur-xl"></div>
          </div>
          <h3 className="label-caps mb-2 relative z-10 !text-amber-600/80">Pending Orders</h3>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-black text-amber-600">{summary.pendingOrders}</span>
            <span className="label-caps !text-amber-500/70 !tracking-normal">Awaiting action</span>
          </div>
          <div className="mt-5 h-1.5 w-full bg-amber-500/10 rounded-full overflow-hidden relative z-10">
             <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Completed Orders Card */}
        <div className="card-glass p-6 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute -bottom-4 -left-4 p-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
             <div className="w-24 h-24 rounded-full bg-emerald-500 blur-xl"></div>
          </div>
          <h3 className="label-caps mb-2 relative z-10 !text-emerald-600/80">Completed Orders</h3>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-black text-emerald-600">{summary.completedOrders}</span>
            <span className="label-caps !text-emerald-500/70 !tracking-normal">Successfully shipped</span>
          </div>
          <div className="mt-5 h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden relative z-10">
             <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full w-full"></div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="border border-primary-600/30 rounded-[24px] shadow-glass relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-6 group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <h3 className="label-caps mb-2 relative z-10 !text-primary-200">Total Revenue</h3>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-black text-white drop-shadow-md">${revenue?.totalRevenueThisMonth?.toFixed(0) ?? summary.totalRevenueThisMonth?.toFixed(0)}</span>
            <span className="label-caps !text-primary-200/80 !tracking-normal">
              {summary.monthOverMonthGrowth > 0 ? "+" : ""}{summary.monthOverMonthGrowth}% MoM
            </span>
          </div>
          <div className="mt-5 h-1.5 w-full bg-primary-950/40 rounded-full overflow-hidden relative z-10">
             <div className="h-full bg-gradient-to-r from-white/60 to-white/90 rounded-full w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="card-glass p-6 md:p-8 relative overflow-hidden group">
           <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-primary-500/10 group-hover:scale-150"></div>
            <h3 className="mb-6 flex items-center gap-3 relative z-10">
              <span className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full shadow-sm"></span>
              Stock Lifecycle
            </h3>
           <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 hover:bg-white/70 hover:shadow-sm transition-all duration-300">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-lg shadow-[inset_0_0_8px_rgba(59,130,246,0.1)]">
                       {summary.activeProducts ?? stock?.activeProducts ?? 0}
                    </div>
                     <div>
                       <div className="font-bold text-slate-700">Active Products</div>
                       <p className="card-subtitle !text-[11px] mb-0">Out of {stock?.totalProducts ?? 0} total</p>
                    </div>
                 </div>
                 <div className="badge badge-info shadow-sm bg-white/50">Active</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/10 hover:bg-red-500/10 hover:shadow-sm transition-all duration-300">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 font-bold text-lg shadow-[inset_0_0_8px_rgba(239,68,68,0.1)]">
                       {stock?.lowStockWarnings ?? 0}
                    </div>
                     <div>
                       <div className="font-bold text-slate-700">Low Stock Warnings</div>
                       <p className="card-subtitle !text-[11px] mb-0">Items near depletion</p>
                    </div>
                 </div>
                 <div className="badge badge-error shadow-sm bg-white/50">Needs Restock</div>
              </div>
           </div>
        </div>

        <div className="card-glass p-6 md:p-8 relative overflow-hidden group">
           <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/10 group-hover:scale-150"></div>
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
             <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-sm"></span>
             Fulfillment Status
           </h3>
           <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-4 bg-amber-500/5 backdrop-blur-md rounded-2xl border border-amber-500/10 hover:bg-amber-500/10 hover:shadow-sm transition-all duration-300">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-lg shadow-[inset_0_0_8px_rgba(245,158,11,0.1)] relative">
                       {fulfillment?.processingOrders ?? 0}
                       <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white animate-ping"></span>
                       <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white"></span>
                    </div>
                     <div>
                       <div className="font-bold text-slate-700">Processing Orders</div>
                       <p className="card-subtitle !text-[11px] mb-0">Confirmed & Shipped</p>
                    </div>
                 </div>
                 <div className="badge badge-warning shadow-sm bg-white/50">Processing</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 backdrop-blur-md rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/10 hover:shadow-sm transition-all duration-300">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]">
                       {fulfillment?.completedOrders ?? 0}
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">Completed Orders</div>
                      <div className="text-xs text-slate-500 font-medium">Cancellation Rate: {fulfillment?.cancellationRate}%</div>
                    </div>
                 </div>
                 <div className="badge badge-success shadow-sm bg-white/50">Fulfilled</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ManagerAnalyticsView({ data }: { data: any }) {
  const summary = data.summary;
  const metrics = data.todayMetrics;
  const overview = data.orderOverview;

  return (
    <div className="space-y-6 w-full fade-in">
      <div className="card-glass p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
          <h2 className="mb-0">Manager Daily Reports</h2>
          <p className="card-subtitle mt-1">
            Today's operational metrics and insights
          </p>
        </div>
        <div className="badge badge-success shadow-sm px-4 py-2 text-sm ring-1 ring-emerald-500/20 backdrop-blur-xl bg-white/50">
          Live Daily Dashboard
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="card-glass p-6 group hover:-translate-y-1 transition-transform">
          <h3 className="label-caps mb-2 !text-slate-500">Orders Today</h3>
          <div className="text-4xl font-black text-slate-800 leading-none">{summary.totalOrdersToday}</div>
        </div>
         <div className="card-glass p-6 group hover:-translate-y-1 transition-transform">
          <h3 className="label-caps mb-2 !text-amber-600/80">Pending (For Manager)</h3>
          <div className="text-4xl font-black text-amber-600 leading-none">{summary.pendingOrdersForManager}</div>
        </div>
         <div className="card-glass p-6 group hover:-translate-y-1 transition-transform">
          <h3 className="label-caps mb-2 !text-emerald-600/80">Completed Today</h3>
          <div className="text-4xl font-black text-emerald-600 leading-none">{summary.completedOrdersToday}</div>
        </div>
         <div className="border border-primary-600/30 rounded-[24px] shadow-glass bg-gradient-to-br from-primary-900 to-primary-800 p-6 group hover:-translate-y-1 transition-transform">
          <h3 className="label-caps mb-2 !text-primary-200">Revenue Today</h3>
          <div className="text-4xl font-black text-white leading-none">${summary.revenueToday?.toFixed(0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="card-glass p-6 md:p-8">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full shadow-sm"></span>
             Today's Pipeline
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
                 <div className="font-bold text-slate-700">Created</div>
                 <div className="font-bold text-slate-900">{metrics?.ordersCreated ?? 0}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
                 <div className="font-bold text-slate-700">Confirmed</div>
                 <div className="font-bold text-slate-900">{metrics?.ordersConfirmed ?? 0}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
                 <div className="font-bold text-slate-700">Shipped</div>
                 <div className="font-bold text-slate-900">{metrics?.ordersShipped ?? 0}</div>
              </div>
           </div>
        </div>

        <div className="card-glass p-6 md:p-8">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
             <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-sm"></span>
             Overall Order Status
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-500/5 backdrop-blur-md rounded-2xl border border-amber-500/10">
                 <div className="font-bold text-slate-700">Awaiting Confirmation</div>
                 <div className="font-bold text-amber-600">{overview?.awaitingConfirmation ?? 0}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-500/5 backdrop-blur-md rounded-2xl border border-blue-500/10">
                 <div className="font-bold text-slate-700">Awaiting Shipment</div>
                 <div className="font-bold text-blue-600">{overview?.awaitingShipment ?? 0}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 backdrop-blur-md rounded-2xl border border-emerald-500/10">
                 <div className="font-bold text-slate-700">Delivered</div>
                 <div className="font-bold text-emerald-600">{overview?.delivered ?? 0}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
