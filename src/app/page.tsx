import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { getDashboardSummary } from "@/lib/inventory-service";

export default async function Home() {
  noStore();
  const summary = await getDashboardSummary();

  return (
    <main className="container stack-lg">
      <section className="hero">
        <p className="eyebrow">Realtime Dashboard</p>
        <h1>Smart Inventory and Order Management</h1>
        <p>
          Server-rendered for operational freshness with proactive stock alerts
          and fulfillment visibility.
        </p>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <p>Total Products</p>
          <strong>{summary.totalProducts}</strong>
        </article>
        <article className="card stat-card warn">
          <p>Low Stock</p>
          <strong>{summary.lowStockProducts}</strong>
        </article>
        <article className="card stat-card danger">
          <p>Out of Stock</p>
          <strong>{summary.outOfStockProducts}</strong>
        </article>
        <article className="card stat-card success">
          <p>Active Orders</p>
          <strong>{summary.activeOrders}</strong>
        </article>
      </section>

      <section className="card row spread center wrap">
        <div>
          <h2>Today&apos;s processed order value</h2>
          <p className="metric">${summary.todayRevenue.toFixed(2)}</p>
        </div>
        <div className="row">
          <Link className="btn" href="/products">
            View Products
          </Link>
          <Link className="btn primary" href="/orders">
            Review Orders
          </Link>
        </div>
      </section>
    </main>
  );
}
