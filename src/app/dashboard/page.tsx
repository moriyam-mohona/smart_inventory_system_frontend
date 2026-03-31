import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getDashboardSummary } from "@/lib/inventory-service";

export default async function DashboardHomePage() {
  noStore();
  const summary = await getDashboardSummary();

  return (
    <div>
      {/* Main Metrics Grid */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Today's Orders</h3>
          <div className="card-value">{summary.totalOrdersToday}</div>
          <div className="card-subtitle">Total orders created</div>
        </div>
        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <div className="card-value" style={{ color: "var(--warn)" }}>
            {summary.pendingOrders}
          </div>
          <div className="card-subtitle">Awaiting confirmation</div>
        </div>
        <div className="dashboard-card">
          <h3>Completed Orders</h3>
          <div className="card-value" style={{ color: "var(--success)" }}>
            {summary.completedOrders}
          </div>
          <div className="card-subtitle">Delivered or shipped</div>
        </div>
        <div className="dashboard-card">
          <h3>Low Stock Items</h3>
          <div className="card-value" style={{ color: "var(--danger)" }}>
            {summary.lowStockItemsCount}
          </div>
          <div className="card-subtitle">Need restock</div>
        </div>
      </div>

      {/* Revenue & Summary Section */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="row spread center wrap">
          <div>
            <h2>Revenue Today</h2>
            <p className="metric">${summary.revenueToday.toFixed(2)}</p>
          </div>
          <div className="row wrap">
            <Link className="btn" href="/dashboard/products">
              View Inventory
            </Link>
            <Link className="btn" href="/dashboard/orders">
              Manage Orders
            </Link>
            <Link className="btn primary" href="/dashboard/orders/new">
              Create Order
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <section className="card" style={{ marginBottom: "2rem" }}>
        <h2>Quick Access</h2>
        <div className="quick-links">
          <Link href="/dashboard/categories" className="quick-link">
            <span className="quick-link-icon">📂</span>
            <span className="quick-link-label">Categories</span>
          </Link>
          <Link href="/dashboard/products" className="quick-link">
            <span className="quick-link-icon">📦</span>
            <span className="quick-link-label">Products</span>
          </Link>
          <Link href="/dashboard/products/new" className="quick-link">
            <span className="quick-link-icon">➕</span>
            <span className="quick-link-label">Add Product</span>
          </Link>
          <Link href="/dashboard/orders" className="quick-link">
            <span className="quick-link-icon">📋</span>
            <span className="quick-link-label">Orders</span>
          </Link>
          <Link href="/dashboard/orders/new" className="quick-link">
            <span className="quick-link-icon">🆕</span>
            <span className="quick-link-label">New Order</span>
          </Link>
          <Link href="/dashboard/analytics" className="quick-link">
            <span className="quick-link-icon">📈</span>
            <span className="quick-link-label">Analytics</span>
          </Link>
        </div>
      </section>

      {/* Product Stock Snapshot */}
      <section className="card">
        <h2>Stock Snapshot</h2>
        <p className="card-subtitle">
          Overview of key products and their stock levels
        </p>
        {summary.productSummary.length > 0 ? (
          <ul className="product-summary-list">
            {summary.productSummary.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <div className="product-summary-details">
                  <span
                    className={`pill ${
                      item.label === "Low Stock" ? "low" : "success"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span>{item.stockQuantity} units</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No products available</p>
        )}
      </section>
    </div>
  );
}
