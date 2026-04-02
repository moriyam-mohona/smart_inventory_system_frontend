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
        <Link className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2" href="/orders/new">
          New Order Draft
        </Link>
      </section>

      <OrderManagement initialOrders={orders} products={products} />
    </main>
  );
}
