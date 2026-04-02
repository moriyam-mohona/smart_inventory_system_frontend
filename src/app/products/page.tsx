import Link from "next/link";

import { getProductListItems } from "@/lib/inventory-service";

import { ProductsManagement } from "./products-management";

export const revalidate = 120;

export default async function ProductsPage() {
  const products = await getProductListItems();

  return (
    <main className="container stack-lg">
      <section className="hero">
        <p className="eyebrow">Inventory</p>
        <h1>Products and stock overview</h1>
        <p>Rendered with ISR and refreshed every 2 minutes.</p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link className="btn-primary" href="/products/new">
            Add Product
          </Link>
          <Link
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50"
            href="/categories"
          >
            Manage Categories
          </Link>
        </div>
      </section>

      <ProductsManagement products={products} />
    </main>
  );
}
