import Link from "next/link";
import { getCategories } from "@/lib/inventory-service";

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>Product Categories</h2>
            <p className="card-subtitle">Manage your inventory categories</p>
          </div>
          <Link href="/dashboard/categories/new" className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2">
            New Category
          </Link>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginTop: "2rem" }}>
        {categories.length > 0 ? (
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
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
          <p className="text-slate-500 text-center p-8 italic">No categories yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}
