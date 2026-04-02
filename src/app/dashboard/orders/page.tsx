import Link from "next/link";
import { getOrders } from "@/lib/inventory-service";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: string }
  > = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "🔄" },
    CONFIRMED: { bg: "bg-blue-100", text: "text-blue-700", icon: "✓" },
    SHIPPED: { bg: "bg-purple-100", text: "text-purple-700", icon: "📦" },
    DELIVERED: { bg: "bg-green-100", text: "text-green-700", icon: "✓✓" },
    CANCELLED: { bg: "bg-red-100", text: "text-red-700", icon: "✕" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Orders
              </h1>
              <p className="text-sm text-slate-500">
                Track and manage customer orders
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/orders/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-amber-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:ring-offset-2 active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Order
          </Link>
        </div>
      </div>

      {/* Content Section */}
      {orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map(
            (order: {
              id: string;
              customerName?: string;
              items?: unknown[];
              totalPrice?: number;
              status: string;
              createdAt: string;
            }) => {
              const config = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                  <div className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer overflow-hidden relative">
                    {/* Background accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Order Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-colors">
                          <svg
                            className="w-6 h-6 text-amber-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-amber-600 transition-colors">
                              Order #{order.id.slice(-6).toUpperCase()}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                              </svg>
                              {order.customerName || "Customer"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
                              </svg>
                              {order.items?.length || 0} items
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v2a1 1 0 102 0V3a1 1 0 00-1-1zm0 10a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm0-5a1 1 0 00-1 1v2a1 1 0 102 0V8a1 1 0 00-1-1zm6-5a1 1 0 00-1 1v2a1 1 0 102 0V3a1 1 0 00-1-1zm0 10a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm0-5a1 1 0 00-1 1v2a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-slate-900 text-sm">
                            ${order.totalPrice?.toFixed(2) || "0.00"}
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${config.bg} ${config.text}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                          <svg
                            className="w-4 h-4 text-slate-600 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            },
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No orders yet
          </h3>
          <p className="text-slate-500 mb-6">
            Start managing orders by creating your first order.
          </p>
          <Link
            href="/dashboard/orders/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-amber-600/30 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Your First Order
          </Link>
        </div>
      )}
    </div>
  );
}
