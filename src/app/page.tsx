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
          <p>Total Orders Today</p>
          <strong>{summary.totalOrdersToday}</strong>
        </article>
        <article className="card stat-card warn">
          <p>Pending Orders</p>
          <strong>{summary.pendingOrders}</strong>
        </article>
        <article className="card stat-card success">
          <p>Completed Orders</p>
          <strong>{summary.completedOrders}</strong>
        </article>
        <article className="card stat-card danger">
          <p>Low Stock Items Count</p>
          <strong>{summary.lowStockItemsCount}</strong>
        </article>
      </section>

      <section className="card row spread center wrap">
        <div>
          <h2>Revenue Today</h2>
          <p className="metric">${summary.revenueToday.toFixed(2)}</p>
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

      <section className="card">
        <h2>Product Summary</h2>
        <p className="card-subtitle">Quick stock snapshot for key products.</p>
        <ul className="product-summary-list">
          {summary.productSummary.map((item) => (
            <li key={item.id}>
              {item.name} - {item.stockQuantity}{" "}
              {item.label === "Low Stock" ? "left" : "available"} ({item.label})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
