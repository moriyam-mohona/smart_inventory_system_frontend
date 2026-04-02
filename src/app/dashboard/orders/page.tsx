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
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>Order Management</h2>
            <p className="card-subtitle">
              Track and manage all customer orders
            </p>
          </div>
          <Link href="/dashboard/orders/new" className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2">
            Create Order
          </Link>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginTop: "2rem" }}>
        {orders.length > 0 ? (
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
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
          <p className="text-slate-500 text-center p-8 italic">No orders yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
