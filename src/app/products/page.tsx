import Link from "next/link";

import { getProductListItems, getStockStatus } from "@/lib/inventory-service";

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

      <section className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStockStatus(
                  product.stockQuantity,
                  product.minStockThreshold,
                );

                return (
                  <tr key={product.id}>
                    <td>{product.sku ?? "-"}</td>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{product.minStockThreshold}</td>
                    <td>
                      <span className={`pill ${status}`}>{status}</span>
                    </td>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>
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
