import Link from "next/link";

import { getOrders, getProducts } from "@/lib/inventory-service";

import { OrderManagement } from "./order-management";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);

  return (
    <main className="container stack-lg">
      <section className="hero row spread align-start">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Fulfillment workflow</h1>
          <p>Rendered via SSR for fresh operational status.</p>
        </div>
        <Link className="btn-primary" href="/orders/new">
          New Order Draft
        </Link>
      </section>

      <OrderManagement initialOrders={orders} products={products} />
    </main>
  );
}
