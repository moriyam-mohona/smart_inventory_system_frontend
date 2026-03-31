import { getProductListItems } from "@/lib/inventory-service";

export const revalidate = 60;

export default async function LowStockPage() {
  const products = await getProductListItems();

  // Filter low stock items (assuming there's a minimum threshold)
  const lowStockProducts = products.filter(
    (p: any) => p.stockQuantity < p.minimumStockThreshold,
  );

  return (
    <div>
      <div className="card">
        <h2>Low Stock Items</h2>
        <p className="card-subtitle">Products that need restocking soon</p>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        {lowStockProducts.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Minimum Threshold</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product: any) => {
                  const shortage =
                    product.minimumStockThreshold - product.stockQuantity;
                  let priority = "low";
                  if (shortage > 20) priority = "high";
                  else if (shortage > 10) priority = "medium";

                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        <strong style={{ color: "var(--danger)" }}>
                          {product.stockQuantity}
                        </strong>
                      </td>
                      <td>{product.minimumStockThreshold}</td>
                      <td>
                        <span className={`pill ${priority}`}>{priority}</span>
                      </td>
                      <td>
                        <button className="text-btn">Restock</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">All products are well stocked!</p>
        )}
      </div>
    </div>
  );
}
