"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useBanCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/category/categoryApi";
import Swal from "sweetalert2";

export default function CategoriesPage() {
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const { data, isLoading, error } = useGetAllCategoriesQuery(
    userRole === "ADMIN" ? { includeBanned: true } : {}
  );

  const [createCategory] = useCreateCategoryMutation();
  const [banCategory] = useBanCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = Array.isArray(data?.data) ? data.data : [];

  const handleBan = async (categoryId: string, name: string) => {
    const result = await Swal.fire({
      title: `Ban category "${name}"?`,
      text: "This will mark the category and its products as inactive system-wide.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Ban",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await banCategory(categoryId).unwrap();
      Swal.fire("Banned", `"${name}" has been banned.`, "success");
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Failed to ban category.", "error");
    }
  };

  const handleDelete = async (categoryId: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete category "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCategory(categoryId).unwrap();
      Swal.fire("Deleted", `"${name}" has been deleted.`, "success");
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Failed to delete category.", "error");
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Product Categories
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage and organize your inventory categories
                </p>
              </div>
            </div>
          </div>
          {userRole === "MANAGER" && (
            <Link href="/dashboard/categories/new" className="btn-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Category
            </Link>
          )}
        </div>
      </div>

      {/* Content Section */}
      {error ? (
        <div className="card p-6 text-center text-red-600 border border-red-200 bg-red-50">
          Failed to load categories. Please try again.
        </div>
      ) : isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 overflow-hidden animate-pulse">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-200"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded-md w-1/4 mb-2"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-4 bg-slate-200 rounded-md w-20"></div>
                      <div className="h-4 bg-slate-200 rounded-md w-24"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-4">
          {categories.map((cat: any) => (
            <div
              key={cat.id}
              className={`card card-hover p-5 group overflow-hidden relative ${!cat.isActive ? "opacity-70" : ""}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${cat.isActive ? "from-primary-50" : "from-red-50"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              <div className="relative flex items-center justify-between gap-4">
                <Link
                  href={`/dashboard/categories/${cat.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  {/* Category Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                      cat.isActive
                        ? "bg-gradient-to-br from-primary-100 to-primary-50 group-hover:from-primary-200 group-hover:to-primary-100"
                        : "bg-gradient-to-br from-red-100 to-red-50 group-hover:from-red-200 group-hover:to-red-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 ${cat.isActive ? "text-primary-600" : "text-red-500"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold text-sm truncate transition-colors ${
                          cat.isActive
                            ? "text-slate-900 group-hover:text-primary-600"
                            : "text-slate-700 group-hover:text-red-600"
                        }`}
                      >
                        {cat.name}
                      </h3>
                      {!cat.isActive && (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200/60 uppercase tracking-widest">
                          Banned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {cat._count?.products ?? 0} Products
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {cat.createdAt
                          ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {userRole === "ADMIN" && cat.isActive && (
                    <button
                      onClick={() => handleBan(cat.id, cat.name)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Ban
                    </button>
                  )}
                  {userRole === "MANAGER" && (
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <Link href={`/dashboard/categories/${cat.id}`}>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors shadow-sm">
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No categories yet</h3>
          <p className="text-slate-500 mb-6">
            Get started by creating your first product category to organize your inventory.
          </p>
          {userRole === "MANAGER" && (
            <Link href="/dashboard/categories/new" className="btn-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create First Category
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
