"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, message } from "antd";

import { FormModalShell } from "@/components/form-modal-shell";
import {
  banCategoryByAdmin,
  deleteCategoryByManager,
  getCategoryDetails,
  updateCategoryByManager,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const [categoryName, setCategoryName] = useState("");
  const [initialCategoryName, setInitialCategoryName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const categoryId = useMemo(
    () => (typeof params?.id === "string" ? params.id : ""),
    [params?.id],
  );

  const loadCategory = useCallback(async () => {
    if (!accessToken || !categoryId) {
      return;
    }

    try {
      setLoadingCategory(true);
      const details = await getCategoryDetails(accessToken, categoryId);

      setCategoryName(details.name);
      setInitialCategoryName(details.name);
      setIsActive(details.isActive !== false);
      setDetails(details);
      setError("");
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Failed to load category.";
      setError(text);
    } finally {
      setLoadingCategory(false);
    }
  }, [accessToken, categoryId, userRole]);

  useEffect(() => {
    void loadCategory();
  }, [loadCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (!accessToken || !categoryId) {
      setError("Missing auth token. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      await updateCategoryByManager(accessToken, categoryId, {
        name: categoryName.trim(),
      });
      setInitialCategoryName(categoryName.trim());
      setSuccessMessage("Category updated successfully!");
      messageApi.success("Category updated.");
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "Failed to update category. Please try again.";
      setError(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = () => {
    Modal.confirm({
      title: "Ban Category",
      content: "Are you sure you want to ban this category? This is an admin-only action and will disable this category's functionality.",
      okText: "Yes, Ban Category",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!accessToken || !categoryId) {
          setError("Missing auth token. Please login again.");
          return;
        }

        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
          await banCategoryByAdmin(accessToken, categoryId);
          messageApi.success("Category banned.");
          setIsActive(false);
        } catch (err) {
          const text =
            err instanceof Error
              ? err.message
              : "Failed to ban category. Please try again.";
          setError(text);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to permanently delete this category? This action cannot be undone and will fail if the category contains products.",
      okText: "Yes, Delete It",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!accessToken || !categoryId) {
          setError("Missing auth token. Please login again.");
          return;
        }

        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
          await deleteCategoryByManager(accessToken, categoryId);
          messageApi.success("Category deleted.");
          router.push("/dashboard/categories");
        } catch (err) {
          const text =
            err instanceof Error
              ? err.message
              : "Failed to delete category. It might still contain products.";
          setError(text);
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <FormModalShell closeHref="/dashboard/categories">
      {contextHolder}
      <div className="space-y-8">
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
          <span className="text-slate-600">{userRole === "ADMIN" ? "Category Details" : "Edit Category"}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isActive ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20' : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20'}`}>
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.49 3.17c-.38-1.69-2.6-1.69-2.99 0a7.488 7.488 0 00-.465 2.428.5.5 0 00.491.582c.364.062.732.055 1.1-.046.37-.1.738-.243 1.1-.406.36-.158.704-.355 1.025-.589.32.234.664.43 1.025.589.36.163.73.306 1.1.406.368.101.736.108 1.1.046a.5.5 0 00.491-.582 7.488 7.488 0 00-.465-2.428zM12 8a1 1 0 10-2 0 1 1 0 002 0zM4 7v10a2 2 0 002 2h8a2 2 0 002-2V7l-4 2.5L4 7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {userRole === "ADMIN" ? "Category Details" : "Edit Category"}
                </h1>
                {!isActive && (
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200/60 uppercase tracking-widest mt-1">
                    Banned
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {userRole === "ADMIN" ? "View category statistics and manage restrictions." : "Update category details or manage status"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
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

              {userRole !== "ADMIN" && (
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
                    disabled={isLoading || loadingCategory || !isActive}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500 disabled:hover:border-slate-200"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {categoryName.length}/100 characters
                  </p>
                </div>
              )}

              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-slate-900 text-sm mb-4">
                  Category Details & Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Original Name</p>
                    <p className="text-sm text-slate-700 font-medium">{initialCategoryName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <p className="text-sm text-slate-700 font-medium">{isActive ? "Active" : "Banned"}</p>
                  </div>
                  
                  {details && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Products</p>
                        <p className="text-sm text-slate-700 font-medium">{details.summary?.totalProducts ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Active / Out of Stock</p>
                        <p className="text-sm text-slate-700 font-medium">{details.summary?.activeProducts ?? 0} / {details.summary?.outOfStockProducts ?? 0}</p>
                      </div>
                      
                      {details.createdBy && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-500 mb-1">Created By</p>
                          <p className="text-sm text-slate-700 font-medium">
                            {details.createdBy.name} <span className="text-slate-400 font-normal">({details.createdBy.email})</span> - <span className="text-xs bg-slate-200 py-0.5 px-1.5 rounded">{details.createdBy.role}</span>
                          </p>
                        </div>
                      )}
                      
                      {details.createdAt && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Created At</p>
                          <p className="text-sm text-slate-700 font-medium">{new Date(details.createdAt).toLocaleString()}</p>
                        </div>
                      )}
                      
                      {details.updatedAt && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                          <p className="text-sm text-slate-700 font-medium">{new Date(details.updatedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                {userRole === "ADMIN" && (
                  <button
                    type="button"
                    onClick={handleBan}
                    disabled={isLoading || loadingCategory || !isActive}
                    className="w-full sm:w-auto px-6 py-2.5 border border-amber-200 text-amber-700 rounded-lg font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isActive ? "Ban Category" : "Already Banned"}
                  </button>
                )}
                {userRole !== "ADMIN" && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading || loadingCategory}
                    className="w-full sm:w-auto px-6 py-2.5 border border-red-200 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-50 hover:border-red-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete Category
                  </button>
                )}
                
                {userRole !== "ADMIN" ? (
                  <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                    <Link
                      href="/dashboard/categories"
                      className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50 text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        loadingCategory ||
                        !categoryName.trim() ||
                        categoryName.trim() === initialCategoryName ||
                        !isActive
                      }
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
                    <Link
                      href="/dashboard/categories"
                      className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50 text-center"
                    >
                      Back to Categories
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
