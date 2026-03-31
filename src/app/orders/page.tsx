import Link from "next/link";

import { getOrders } from "@/lib/inventory-service";

function toStatusLabel(status: string) {
  return status.toLowerCase().replaceAll("_", " ");
}

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="container stack-lg">
      <section className="hero row spread align-start">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Fulfillment workflow</h1>
          <p>Rendered via SSR for fresh operational status.</p>
        </div>
        <Link className="btn primary" href="/orders/new">
          New Order Draft
        </Link>
      </section>

      <section className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalItems = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                );
                const totalValue = order.totalPrice;

                return (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <span className={`pill ${order.status.toLowerCase()}`}>
                        {toStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      {totalItems} (${totalValue.toFixed(2)})
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
