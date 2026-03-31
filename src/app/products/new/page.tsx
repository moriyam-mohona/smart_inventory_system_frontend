import Link from "next/link";

import { getCategories } from "@/lib/inventory-service";

import { ProductSetupForm } from "./product-setup-form";

export default async function ProductSetupPage() {
  const categories = await getCategories();

  return (
    <main className="container stack-lg">
      <section className="hero row spread align-start">
        <div>
          <p className="eyebrow">Product Setup</p>
          <h1>Add products manually</h1>
          <p>
            Configure product name, category, pricing, stock quantity, minimum
            threshold, and status.
          </p>
        </div>
        <Link className="btn" href="/products">
          Back to Products
        </Link>
      </section>

      <ProductSetupForm categories={categories} />
    </main>
  );
}
