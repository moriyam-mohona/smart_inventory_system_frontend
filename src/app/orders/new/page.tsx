import Link from "next/link";

import { getProducts } from "@/lib/inventory-service";

import { OrderForm } from "./order-form";

export default async function NewOrderPage() {
  const products = await getProducts();

  return (
    <main className="container stack-lg">
      <section className="hero row spread align-start">
        <div>
          <p className="eyebrow">Validation</p>
          <h1>Create and validate order drafts</h1>
          <p>
            Drafts are validated against current stock to prevent stale-cart
            conflicts before final submission.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50"
          href="/orders"
        >
          Back to Orders
        </Link>
      </section>

      <OrderForm products={products} />
    </main>
  );
}
