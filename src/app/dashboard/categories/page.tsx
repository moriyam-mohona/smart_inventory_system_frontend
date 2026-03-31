import Link from "next/link";
import { getCategories } from "@/lib/inventory-service";

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="card">
        <div className="row spread center wrap">
          <div>
            <h2>Product Categories</h2>
            <p className="card-subtitle">Manage your inventory categories</p>
          </div>
          <Link href="/dashboard/categories/new" className="btn primary">
            New Category
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        {categories.length > 0 ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: any) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link
                        href={`/dashboard/categories/${cat.id}`}
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
          <p className="empty">No categories yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
