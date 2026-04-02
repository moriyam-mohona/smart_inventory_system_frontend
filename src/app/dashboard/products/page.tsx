import Link from "next/link";
import { getProductListItems } from "@/lib/inventory-service";

export const revalidate = 120;

export default async function ProductsPage() {
  const products = await getProductListItems();

  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>Product Inventory</h2>
            <p className="card-subtitle">View and manage all your products</p>
          </div>
          <div className="row wrap">
            <Link href="/dashboard/categories" className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50">
              Manage Categories
            </Link>
            <Link href="/dashboard/products/new" className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2">
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginTop: "2rem" }}>
        {products.length > 0 ? (
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.categoryName || "—"}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      <span
                        className={`pill ${product.status === "ACTIVE" ? "in-stock" : "out-of-stock"}`}
                      >
                        {product.status === "ACTIVE"
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-btn"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center p-8 italic">No products yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}
