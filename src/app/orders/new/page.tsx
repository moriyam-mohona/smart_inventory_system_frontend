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
        <Link className="btn" href="/orders">
          Back to Orders
        </Link>
      </section>

      <OrderForm products={products} />
    </main>
  );
}
