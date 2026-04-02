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
        <Link
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50"
          href="/products"
        >
          Back to Products
        </Link>
      </section>

      <ProductSetupForm categories={categories} />
    </main>
  );
}
