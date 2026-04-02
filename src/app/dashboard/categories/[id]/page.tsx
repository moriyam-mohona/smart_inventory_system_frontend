"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";

import { FormModalShell } from "@/components/form-modal-shell";

interface Params {
  id: string;
}

function EditCategoryContent() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage("Category updated successfully!");
      setTimeout(() => {
        router.push("/dashboard/categories");
      }, 1500);
    } catch (_err) {
      setError("Failed to update category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/categories");
    } catch (_err) {
      setError("Failed to delete category. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <FormModalShell closeHref="/dashboard/categories">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link
            href="/dashboard/categories"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Categories
          </Link>
          <svg
            className="w-4 h-4 text-slate-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-slate-600">Edit Category</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.49 3.17c-.38-1.69-2.6-1.69-2.99 0a7.488 7.488 0 00-.465 2.428.5.5 0 00.491.582c.364.062.732.055 1.1-.046.37-.1.738-.243 1.1-.406.36-.158.704-.355 1.025-.589.32.234.664.43 1.025.589.36.163.73.306 1.1.406.368.101.736.108 1.1.046a.5.5 0 00.491-.582 7.488 7.488 0 00-.465-2.428zM12 8a1 1 0 10-2 0 1 1 0 002 0zM4 7v10a2 2 0 002 2h8a2 2 0 002-2V7l-4 2.5L4 7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Edit Category
              </h1>
              <p className="text-sm text-slate-500">
                Update category information
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-green-800">
                    {successMessage}
                  </span>
                </div>
              )}

              {/* Input Group */}
              <div className="mb-8">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-semibold text-slate-900 mb-3"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Electronics"
                  maxLength={100}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {categoryName.length}/100 characters
                </p>
              </div>

              {/* Category Info */}
              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-slate-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100 2h2a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Category Information
                </h4>
                <p className="text-sm text-slate-600">
                  This category is being used by your products. Updating the
                  name will reflect changes across your inventory.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2.5 border border-red-200 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-50 hover:border-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Category
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/dashboard/categories"
                    className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50 text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !categoryName.trim()}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">Loading...</div>
      }
    >
      <EditCategoryContent />
    </Suspense>
  );
}
