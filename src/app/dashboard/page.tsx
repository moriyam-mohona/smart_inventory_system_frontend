import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getDashboardSummary } from "@/lib/inventory-service";

export default async function DashboardHomePage() {
  noStore();
  const summary = await getDashboardSummary();

  const metrics = [
    {
      label: "Today's Orders",
      value: summary.totalOrdersToday,
      description: "Total orders created",
      icon: "📊",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "Pending Orders",
      value: summary.pendingOrders,
      description: "Awaiting confirmation",
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      label: "Completed Orders",
      value: summary.completedOrders,
      description: "Delivered or shipped",
      icon: "✓",
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      label: "Low Stock Items",
      value: summary.lowStockItemsCount,
      description: "Need restock",
      icon: "⚠️",
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
    },
  ];

  return (
    <div>
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-slate-600 font-medium text-sm">
                {metric.label}
              </h3>
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-lg shadow-lg shadow-${metric.textColor.split("-")[1]}-600/30`}
              >
                {metric.icon}
              </div>
            </div>
            <div>
              <div
                className={`text-4xl font-extrabold leading-none ${metric.textColor} mb-2`}
              >
                {metric.value}
              </div>
              <p className="text-slate-500 text-sm">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Summary Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-card transition-all mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Revenue Today</h2>
            <p className="mt-2 text-4xl font-extrabold text-primary-600">
              ${summary.revenueToday.toFixed(2)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 transition-all"
              href="/dashboard/products"
            >
              <span className="mr-2">📦</span>
              View Inventory
            </Link>
            <Link
              className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-primary-300 hover:text-primary-600 transition-all"
              href="/dashboard/orders"
            >
              <span className="mr-2">📋</span>
              Manage Orders
            </Link>
            <Link
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all"
              href="/dashboard/orders/new"
            >
              <span className="mr-2">🆕</span>
              Create Order
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-card transition-all mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Link
            href="/dashboard/categories"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              📂
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              Categories
            </span>
          </Link>
          <Link
            href="/dashboard/products"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              📦
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              Products
            </span>
          </Link>
          <Link
            href="/dashboard/products/new"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              ➕
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              Add Product
            </span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              📋
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              Orders
            </span>
          </Link>
          <Link
            href="/dashboard/orders/new"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              🆕
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              New Order
            </span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-colors text-center group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
              📈
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-primary-600 transition-colors">
              Analytics
            </span>
          </Link>
        </div>
      </section>

      {/* Product Stock Snapshot */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-card transition-all">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Stock Snapshot
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          Overview of key products and their stock levels
        </p>
        {summary.productSummary.length > 0 ? (
          <ul className="grid gap-3">
            {summary.productSummary.map((item) => (
              <li
                key={item.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-sm flex items-center justify-between hover:bg-white hover:border-primary-300 transition-all duration-200"
              >
                <strong className="text-slate-900">{item.name}</strong>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      item.label === "Low Stock"
                        ? "text-yellow-700 bg-yellow-100"
                        : "text-green-700 bg-green-100"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {item.stockQuantity} units
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-center p-8 italic">
            No products available
          </p>
        )}
      </section>
    </div>
  );
}
