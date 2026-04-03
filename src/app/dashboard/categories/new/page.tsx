"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { message } from "antd";

import { FormModalShell } from "@/components/form-modal-shell";
import { createCategoryByManager } from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

export default function NewCategoryPage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const userRole = useAppSelector((state) => state.auth.user?.role);
  useEffect(() => {
    if (userRole === "ADMIN") {
      messageApi.error("Administrators cannot create categories.");
      router.replace("/dashboard/categories");
    }
  }, [userRole, router, messageApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      if (!accessToken) {
        throw new Error("Missing auth token. Please login again.");
      }

      await createCategoryByManager(accessToken, {
        name: categoryName.trim(),
      });
      messageApi.success("Category created.");
      router.push("/dashboard/categories");
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "Failed to create category. Please try again.";
      setError(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModalShell closeHref="/dashboard/categories">
      {contextHolder}
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
          <span className="text-slate-600">New Category</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Create New Category
              </h1>
              <p className="text-sm text-slate-500">
                Add a new product category to organize your inventory
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
                  placeholder="e.g., Electronics, Clothing, Groceries, Furniture"
                  maxLength={100}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500 disabled:hover:border-slate-200"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {categoryName.length}/100 characters
                </p>
              </div>

              {/* Helpful Tips */}
              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100 2h2a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Naming Tips
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>
                      Use clear, descriptive names (e.g.,
                      &quot;Electronics&quot;, &quot;Office Supplies&quot;)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Keep names concise and easy to remember</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <Link
                  href="/dashboard/categories"
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !categoryName.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
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
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Category
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
