import { getDashboardSummary } from "@/lib/inventory-service";

export const revalidate = 120;

export default async function AnalyticsPage() {
  const summary = await getDashboardSummary();

  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginBottom: "2rem" }}>
        <h2>Analytics & Reports</h2>
        <p className="card-subtitle">
          Business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <div className="card-value">{summary.totalOrdersToday}</div>
          <div className="card-subtitle">This month</div>
        </div>
        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <div className="card-value" style={{ color: "var(--warn)" }}>
            {summary.pendingOrders}
          </div>
          <div className="card-subtitle">Awaiting action</div>
        </div>
        <div className="dashboard-card">
          <h3>Completed Orders</h3>
          <div className="card-value" style={{ color: "var(--success)" }}>
            {summary.completedOrders}
          </div>
          <div className="card-subtitle">Successfully shipped</div>
        </div>
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <div className="card-value" style={{ color: "var(--success)" }}>
            ${summary.revenueToday.toFixed(0)}
          </div>
          <div className="card-subtitle">This month</div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginTop: "2rem" }}>
        <h2>Inventory Summary</h2>
        <div className="dashboard-grid">
          <div className="card-subtle">
            <h3>Stock Overview</h3>
            <p style={{ marginTop: "1rem", color: "var(--text-soft)" }}>
              Total Products: {summary.productSummary.length}
            </p>
            <p style={{ color: "var(--text-soft)" }}>
              Low Stock Items: {summary.lowStockItemsCount}
            </p>
          </div>
          <div className="card-subtle">
            <h3>Order Status</h3>
            <p style={{ marginTop: "1rem", color: "var(--text-soft)" }}>
              Pending: {summary.pendingOrders}
            </p>
            <p style={{ color: "var(--text-soft)" }}>
              Completed: {summary.completedOrders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
