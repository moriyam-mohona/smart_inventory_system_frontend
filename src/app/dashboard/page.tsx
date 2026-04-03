"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAdminDashboardQuery,
  useGetManagerDashboardQuery,
} from "@/redux/features/analytics/analyticsApi";

export default function DashboardHomePage() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const { data: adminRes, isLoading: adminLoading } = useGetAdminDashboardQuery("today", {
    skip: role !== "ADMIN",
  });

  const { data: managerRes, isLoading: managerLoading } = useGetManagerDashboardQuery(undefined, {
    skip: role !== "MANAGER",
  });

  if (adminLoading || managerLoading) {
    return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading dashboard...</div>;
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
      label: "Today's Orders",
      value: role === "ADMIN" ? summary.totalOrdersThisMonth : summary.totalOrdersToday, // Although named "ThisMonth", if we query `period=today` the backend might return today's orders in that field, or we might just use what is provided.
      description: role === "ADMIN" ? "Total incoming orders" : "Today's created orders",
      icon: "📊",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: role === "ADMIN" ? "Total Pending" : "Pending (For Manager)",
      value: role === "ADMIN" ? summary.pendingOrders : summary.pendingOrdersForManager,
      description: "Awaiting action",
      icon: "⏳",
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
    },
    {
      label: role === "ADMIN" ? "Total Completed" : "Completed Today",
      value: role === "ADMIN" ? summary.completedOrders : summary.completedOrdersToday,
      description: "Successfully processed",
      icon: "✓",
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      label: role === "ADMIN" ? "Active Products" : "Low Stock Alerts",
      value: role === "ADMIN" ? summary.activeProducts : summary.lowStockAlert,
      description: role === "ADMIN" ? "In database" : "Need attention",
      icon: role === "ADMIN" ? "📦" : "⚠️",
      color: role === "ADMIN" ? "from-indigo-500 to-indigo-600" : "from-red-500 to-red-600",
      textColor: role === "ADMIN" ? "text-indigo-600" : "text-red-600",
    },
  ];

  return (
    <div className="fade-in">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="card-glass p-6 group hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-slate-500 font-bold text-[12px] uppercase tracking-wider">
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
                className={`text-4xl font-extrabold leading-none ${metric.textColor} mb-2`}
              >
                {metric.value ?? 0}
              </div>
              <p className="text-slate-500 text-xs font-medium">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Summary Section */}
      <div className="card-glass p-6 md:p-8 mb-8 relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-125 duration-700"></div>
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              {role === "ADMIN" ? "Revenue Over Period" : "Revenue Today"}
            </h2>
            <p className="text-5xl font-extrabold text-primary-600 drop-shadow-sm">
              ${(role === "ADMIN" ? summary.totalRevenueThisMonth : summary.revenueToday)?.toFixed(2) ?? '0.00'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="btn-secondary"
              href="/dashboard/products"
            >
              <span className="mr-2">📦</span>
              Inventory
            </Link>
            <Link
              className="btn-secondary"
              href="/dashboard/orders"
            >
              <span className="mr-2">📋</span>
              Orders
            </Link>
            <Link
              className="btn-primary"
              href="/dashboard/orders/new"
            >
              <span className="mr-2">🆕</span>
              Create Order
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <section className="card-glass p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full shadow-sm"></span>
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Link
            href="/dashboard/categories"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              📂
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              Categories
            </span>
          </Link>
          <Link
            href="/dashboard/products"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              📦
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              Products
            </span>
          </Link>
          <Link
            href="/dashboard/products/new"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              ➕
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              Add Product
            </span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              📋
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              Orders
            </span>
          </Link>
          <Link
            href="/dashboard/orders/new"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              🆕
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              New Order
            </span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl hover:bg-white/60 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              📈
            </span>
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
              Analytics
            </span>
          </Link>
        </div>
      </section>
      
      {/* Dynamic List Section Based on Role */}
      {role === "MANAGER" && data?.lowStockItems && data.lowStockItems.length > 0 && (
        <section className="card-glass p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full shadow-sm"></span>
            Low Stock Alerts
          </h2>
          <div className="space-y-3 mt-4">
             {data.lowStockItems.map((item: any) => (
                <div key={item.productId} className="flex items-center justify-between p-4 bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                   <div className="font-bold text-slate-700">{item.productName}</div>
                   <div className="flex items-center gap-4">
                      <div className="text-sm font-semibold text-red-600">
                         {item.currentStock} left
                      </div>
                      <div className="badge badge-error">Needs Restock</div>
                   </div>
                </div>
             ))}
          </div>
        </section>
      )}

      {role === "ADMIN" && data?.stockLifecycle?.productsNeedingRestock && data.stockLifecycle.productsNeedingRestock.length > 0 && (
         <section className="card-glass p-6 md:p-8">
         <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
           <span className="w-1.5 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full shadow-sm"></span>
           Products Needing Restock
         </h2>
         <div className="space-y-3 mt-4">
            {data.stockLifecycle.productsNeedingRestock.slice(0, 5).map((item: any) => (
               <div key={item.id} className="flex items-center justify-between p-4 bg-red-500/5 backdrop-blur-md rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                  <div className="font-bold text-slate-700">{item.name}</div>
                  <div className="flex items-center gap-4">
                     <div className="text-sm font-semibold text-red-600">
                        {item.stockQuantity} left
                     </div>
                     <div className="badge badge-error">Low Stock</div>
                  </div>
               </div>
            ))}
         </div>
       </section>
      )}
    </div>
  );
}
