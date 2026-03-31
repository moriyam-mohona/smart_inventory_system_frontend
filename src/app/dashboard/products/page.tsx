import Link from "next/link";
import { getProductListItems } from "@/lib/inventory-service";

export const revalidate = 120;

export default async function ProductsPage() {
  const products = await getProductListItems();

  return (
    <div>
      <div className="card">
        <div className="row spread center wrap">
          <div>
            <h2>Product Inventory</h2>
            <p className="card-subtitle">View and manage all your products</p>
          </div>
          <div className="row wrap">
            <Link href="/dashboard/categories" className="btn">
              Manage Categories
            </Link>
            <Link href="/dashboard/products/new" className="btn primary">
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        {products.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
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
          <p className="empty">No products yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}
