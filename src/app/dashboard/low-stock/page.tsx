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
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <h2>Restock Queue</h2>
        <p className="card-subtitle">Products that need restocking soon</p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginTop: "2rem" }}>
        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
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
          <p className="text-slate-500 text-center p-8 italic">All products are well stocked!</p>
        )}
      </div>
    </div>
  );
}
