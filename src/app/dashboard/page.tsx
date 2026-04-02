import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getDashboardSummary } from "@/lib/inventory-service";

export default async function DashboardHomePage() {
  noStore();
  const summary = await getDashboardSummary();

  return (
    <div>
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <h3 className="text-slate-500 font-medium text-sm mb-2">Today's Orders</h3>
          <div className="text-4xl font-extrabold leading-none mt-2 text-slate-900">{summary.totalOrdersToday}</div>
          <div className="text-slate-500 text-sm mt-2 mb-4">Total orders created</div>
        </div>
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <h3 className="text-slate-500 font-medium text-sm mb-2">Pending Orders</h3>
          <div className="text-4xl font-extrabold leading-none mt-2 text-yellow-600">
            {summary.pendingOrders}
          </div>
          <div className="text-slate-500 text-sm mt-2 mb-4">Awaiting confirmation</div>
        </div>
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <h3 className="text-slate-500 font-medium text-sm mb-2">Completed Orders</h3>
          <div className="text-4xl font-extrabold leading-none mt-2 text-green-700">
            {summary.completedOrders}
          </div>
          <div className="text-slate-500 text-sm mt-2 mb-4">Delivered or shipped</div>
        </div>
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <h3 className="text-slate-500 font-medium text-sm mb-2">Low Stock Items</h3>
          <div className="text-4xl font-extrabold leading-none mt-2 text-red-700">
            {summary.lowStockItemsCount}
          </div>
          <div className="text-slate-500 text-sm mt-2 mb-4">Need restock</div>
        </div>
      </div>

      {/* Revenue & Summary Section */}
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Revenue Today</h2>
            <p className="mt-1 text-4xl font-extrabold text-teal-700">${summary.revenueToday.toFixed(2)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all text-center" href="/dashboard/products">
              View Inventory
            </Link>
            <Link className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all text-center" href="/dashboard/orders">
              Manage Orders
            </Link>
            <Link className="inline-flex items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center" href="/dashboard/orders/new">
              Create Order
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
        <h2 className="text-xl font-bold text-slate-900">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
          <Link href="/dashboard/categories" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📂</span>
            <span className="text-sm font-medium text-slate-700">Categories</span>
          </Link>
          <Link href="/dashboard/products" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</span>
            <span className="text-sm font-medium text-slate-700">Products</span>
          </Link>
          <Link href="/dashboard/products/new" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="text-sm font-medium text-slate-700">Add Product</span>
          </Link>
          <Link href="/dashboard/orders" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</span>
            <span className="text-sm font-medium text-slate-700">Orders</span>
          </Link>
          <Link href="/dashboard/orders/new" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🆕</span>
            <span className="text-sm font-medium text-slate-700">New Order</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-teal-500 transition-colors text-center group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</span>
            <span className="text-sm font-medium text-slate-700">Analytics</span>
          </Link>
        </div>
      </section>

      {/* Product Stock Snapshot */}
      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-bold text-slate-900">Stock Snapshot</h2>
        <p className="text-slate-500 text-sm mt-2 mb-4">
          Overview of key products and their stock levels
        </p>
        {summary.productSummary.length > 0 ? (
          <ul className="grid gap-3 mt-4">
            {summary.productSummary.map((item) => (
              <li key={item.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-sm flex items-center justify-between hover:bg-slate-100 transition-colors">
                <strong className="text-slate-900">{item.name}</strong>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      item.label === "Low Stock" ? "text-yellow-700 bg-yellow-100" : "text-green-700 bg-green-100"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-slate-600 font-medium">{item.stockQuantity} units</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-center p-8 italic">No products available</p>
        )}
      </section>
    </div>
  );
}
