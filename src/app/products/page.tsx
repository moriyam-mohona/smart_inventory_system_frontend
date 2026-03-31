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
        <div className="row">
          <Link className="btn primary" href="/products/new">
            Add Product
          </Link>
          <Link className="btn" href="/categories">
            Manage Categories
          </Link>
        </div>
      </section>

      <ProductsManagement products={products} />
    </main>
  );
}
