import Link from "next/link";
import { getOrders } from "@/lib/inventory-service";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  const statusColors: Record<string, string> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  };

  return (
    <div>
      <div className="card">
        <div className="row spread center wrap">
          <div>
            <h2>Order Management</h2>
            <p className="card-subtitle">
              Track and manage all customer orders
            </p>
          </div>
          <Link href="/dashboard/orders/new" className="btn primary">
            Create Order
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        {orders.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id.slice(-6)}</strong>
                    </td>
                    <td>{order.customerName}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>${order.totalPrice?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span
                        className={`pill ${statusColors[order.status] || "pending"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-btn"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">No orders yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
