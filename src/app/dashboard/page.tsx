"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAdminDashboardQuery,
  useGetManagerDashboardQuery,
} from "@/redux/features/analytics/analyticsApi";
import { useGetLowStockProductsQuery } from "@/redux/features/product/productApi";

export default function DashboardHomePage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const { data: adminRes, isLoading: adminLoading } = useGetAdminDashboardQuery("today", {
    skip: role !== "ADMIN",
  });

  const { data: managerRes, isLoading: managerLoading } = useGetManagerDashboardQuery(undefined, {
    skip: role !== "MANAGER",
  });

  const { data: lowStockRes } = useGetLowStockProductsQuery(undefined);
  const lowStockProducts = lowStockRes?.data || [];

  if (adminLoading || managerLoading) {
    return (
       <div className="p-12 space-y-8 animate-pulse italic text-slate-400 font-bold uppercase tracking-widest text-center">
          <div className="h-20 w-20 bg-slate-100 rounded-3xl mx-auto mb-6" />
          Synchronizing Asset Engine...
       </div>
    );
  }

  const data = role === "ADMIN" ? adminRes?.data : managerRes?.data;
  const summary = data?.summary;
  
  if (!summary) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Could not load dashboard data.
      </div>
    );
  }

  const metrics = [
    {
      label: "System Inventory",
      value: role === "ADMIN" ? summary.activeProducts : (summary.totalProducts || 0),
      icon: "📦",
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      description: "Count of unique product SKUs",
    },
    {
      label: role === "ADMIN" ? "Active Orders" : "My Orders",
      value: role === "ADMIN" ? summary.totalOrdersThisMonth : summary.totalOrdersToday,
      icon: "📋",
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-600",
      description: "Pending or Confirmed fulfillment",
    },
    {
      label: "Stock Alerts",
      value: role === "ADMIN" ? (summary.lowStockCount || lowStockProducts.length) : (summary.lowStockAlert || lowStockProducts.length),
      icon: "⚠️",
      color: "from-rose-500 to-red-500",
      textColor: "text-rose-600",
      description: "Below system-defined threshold",
    },
    {
      label: "Success Rate",
      value: `${summary.orderSuccessRate ?? 100}%`,
      icon: "⚡",
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-600",
      description: "Ratio of delivered vs cancelled",
    },
  ];

  return (
    <div className="fade-in space-y-8 pb-10">
      {/* Dashboard Header & Greeting */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 leading-none">
            {role === "ADMIN" ? "System Administration" : `Welcome back, Manager`}
          </h1>
          <p className="card-subtitle mb-0 max-w-xl text-slate-500 font-medium tracking-tight">
            Comprehensive overview of your Stock Control System performance, 
            fulfillment velocity, and inventory health.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-xl rounded-2xl border border-white shadow-sm ring-1 ring-slate-100">
           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-xs font-black text-slate-700 uppercase tracking-widest">System Live</span>
        </div>
      </header>

      {/* Main Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="card-glass p-6 group hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="label-caps mb-0 text-slate-400">
                {metric.label}
              </h3>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center text-lg shadow-lg opacity-80`}
              >
                <span className="text-white drop-shadow-md">{metric.icon}</span>
              </div>
            </div>
            <div>
              <div
                className={`text-4xl font-black leading-none ${metric.textColor} mb-2`}
              >
                {metric.value ?? 0}
              </div>
              <p className="card-subtitle !text-[11px] mb-0">{metric.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Key Insights Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue & Growth (Lg: 2cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-glass p-8 relative overflow-hidden group border-white/60 min-h-[220px] flex flex-col justify-center">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-125 duration-700"></div>
            <div className="flex flex-wrap items-center justify-between gap-6 relative z-10 w-full">
              <div>
                <h3 className="mb-2 label-caps text-slate-400">
                  {role === "ADMIN" ? "Revenue Gross Index" : "My Fulfillment Value"}
                </h3>
                <p className="text-6xl font-black text-primary-600 drop-shadow-sm mb-0 tracking-tighter">
                  ${(role === "ADMIN" ? summary.totalRevenueThisMonth : summary.revenueToday)?.toFixed(2) ?? '0.00'}
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">+12.5% vs Prev</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Net performance growth</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="btn-secondary h-11 px-6 rounded-xl font-bold flex items-center shadow-xs"
                  href="/dashboard/analytics"
                >
                  <span className="mr-2">📈</span>
                  Intelligence
                </Link>
                <Link
                  className="btn-primary h-11 px-6 rounded-xl font-bold flex items-center shadow-lg shadow-primary-950/10"
                  href="/dashboard/orders"
                >
                  <span className="mr-2">📋</span>
                  View All Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Top Selling Analytics List */}
          <div className="card-glass p-8 border-white/60">
             <div className="flex items-center justify-between mb-8">
                 <h3 className="label-caps mb-0 text-slate-900">Top Performing Assets</h3>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Ranking</span>
             </div>
             <div className="space-y-5">
                {(summary.topSellingProducts || []).slice(0, 4).map((p: any, i: number) => (
                  <div key={p.id || i} className="flex items-center gap-4 group">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 font-black text-slate-400 border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-slate-900 truncate max-w-[200px]">{p.name || p.productName}</span>
                        <span className="text-xs font-black text-slate-500">${(p.totalRevenue || 0).toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(27,71,93,0.2)]" 
                          style={{ width: `${Math.min(100, ((p.totalQuantity || 0) / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Units</span>
                      <span className="text-sm font-black text-slate-900">{p.totalQuantity || 0}</span>
                    </div>
                  </div>
                ))}
                {(!summary.topSellingProducts || summary.topSellingProducts.length === 0) && (
                   <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[24px]">
                      <span className="text-3xl opacity-20 block mb-2">📊</span>
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-0">Insufficient fulfillment data</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Inventory Criticality / Restock Queue (Lg: 1col) */}
        <div className="space-y-6">
           <div className="card-glass p-8 border-rose-100 bg-rose-50/10 h-full">
              <div className="flex items-center justify-between mb-8 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                      <span className="text-sm">⚠️</span>
                    </div>
                    <h3 className="label-caps mb-0 text-slate-900">Restock Queue</h3>
                  </div>
                  <Link href="/dashboard/low-stock" className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center">
                    Alert Ops →
                  </Link>
              </div>
              
              <div className="space-y-4">
                 {lowStockProducts.slice(0, 6).map((item: any) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white border border-rose-100/60 shadow-xs hover:shadow-md transition-shadow group">
                       <div className="flex items-center justify-between mb-3">
                          <span className="font-extrabold text-slate-900 text-sm truncate max-w-[120px]">{item.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">Critical</span>
                       </div>
                       <div className="flex items-end justify-between">
                          <div className="space-y-1">
                             <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Stock</span>
                             <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-rose-600 leading-none">{item.stockQuantity}</span>
                                <span className="text-xs font-bold text-slate-300 leading-none">/ min {item.minStockThreshold}</span>
                             </div>
                          </div>
                          <Link 
                            href={`/dashboard/products?search=${item.name}`}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm hover:scale-110 active:scale-95 transition-all"
                          >
                            <span className="text-xs">+</span>
                          </Link>
                       </div>
                    </div>
                 ))}
                 
                 {lowStockProducts.length === 0 && (
                    <div className="py-20 text-center bg-white/40 backdrop-blur-sm rounded-[32px] border border-white shadow-sm">
                       <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
                          <span className="text-2xl italic tracking-tighter font-black">OK</span>
                       </div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-10 leading-relaxed">
                          All assets are currently above critical thresholds.
                       </p>
                    </div>
                 )}
                 
                 {lowStockProducts.length > 6 && (
                   <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                     And {lowStockProducts.length - 6} more critical items...
                   </p>
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* Quick Action Navigation */}
       <section className="card-glass p-6 md:p-8">
        <h3 className="mb-6 flex items-center gap-2 label-caps text-slate-400">
          Operational Core
        </h3>
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4">
          {[
            { label: "Categories", path: "/dashboard/categories", icon: "📂" },
            { label: "Products", path: "/dashboard/products", icon: "📦" },
            { label: "Orders", path: "/dashboard/orders", icon: "📋" },
            { label: "Analytics", path: "/dashboard/analytics", icon: "📈" },
          ].map(it => (
            <Link
              key={it.path}
              href={it.path}
              className="flex flex-col items-center justify-center p-6 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-md transition-all duration-300 group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                {it.icon}
              </span>
              <span className="label-caps !text-slate-700 group-hover:!text-primary-600 transition-colors">
                {it.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
