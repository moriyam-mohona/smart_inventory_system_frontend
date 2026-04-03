"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { message } from "antd";

import { FormModalShell } from "@/components/form-modal-shell";
import { useAppSelector } from "@/redux/hooks";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";

export default function NewProductPage() {
  const router = useRouter();
  const userRole = useAppSelector((state) => state.auth.user?.role);

  // RTK Query — only fetch active categories (managers can create products)
  const { data: categoryRes, isLoading: loadingCategories } = useGetAllCategoriesQuery({});
  const rawCategories = Array.isArray(categoryRes?.data) ? categoryRes.data : [];
  const categories = rawCategories.filter((c: any) => c.isActive !== false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    minStockThreshold: "5",
  });

  // Auto-select first available category
  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories.length]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (userRole === "ADMIN") {
      messageApi.error("Administrators cannot add new products manually.");
      router.replace("/dashboard/products");
    }
  }, [userRole, router, messageApi]);

  const [createProduct] = useCreateProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Product name is required");
    if (!formData.categoryId) return setError("Category is required");
    if (!formData.price || Number(formData.price) <= 0) return setError("Valid price is required");
    if (Number(formData.stockQuantity) < 0) return setError("Stock cannot be negative");
    if (Number(formData.minStockThreshold) < 0) return setError("Threshold cannot be negative");

    setIsLoading(true);

    try {
      await createProduct({
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        minStockThreshold: Number(formData.minStockThreshold),
      }).unwrap();
      
      messageApi.success("Product created.");
      router.push("/dashboard/products");
    } catch (err: any) {
      const text = err?.data?.message || err.message || "Failed to create product.";
      setError(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModalShell closeHref="/dashboard/products">
      {contextHolder}
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link
            href="/dashboard/products"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Products
          </Link>
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-slate-600">New Product</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Add New Product
              </h1>
              <p className="text-sm text-slate-500">
                Create a new active product listing in the system.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Wireless Mouse"
                    maxLength={100}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {/* Category Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    disabled={isLoading || loadingCategories}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="" disabled>Select a Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {/* Initial Stock */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Initial Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    placeholder="0"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {/* Min Stock Threshold */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Restock Threshold <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.minStockThreshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStockThreshold: e.target.value }))}
                    placeholder="5"
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <Link
                  href="/dashboard/products"
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
                >
                  {isLoading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
