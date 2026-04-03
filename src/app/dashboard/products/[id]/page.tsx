"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Modal, message } from "antd";

import { FormModalShell } from "@/components/form-modal-shell";
import {
  getCategoriesByManager,
  getProductDetails,
  updateProductByManager,
  deactivateProductByAdmin,
  type ManagerCategory,
  type ManagerProduct,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const accessToken = useAppSelector((state) => state.auth.access_token);
  const userRole = useAppSelector((state) => state.auth.user?.role);

  const [categories, setCategories] = useState<ManagerCategory[]>([]);
  const [productData, setProductData] = useState<ManagerProduct | null>(null);
  const [initialData, setInitialData] = useState<ManagerProduct | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    minStockThreshold: "",
    status: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = useCallback(async () => {
    if (!accessToken || !productId) return;

    try {
      setLoadingData(true);
      const [cats, foundProduct] = await Promise.all([
        getCategoriesByManager(accessToken),
        getProductDetails(accessToken, productId),
      ]);

      const activeCats = cats.filter((cat) => cat.isActive !== false);
      setCategories(activeCats);

      if (!foundProduct) {
        setError("Product not found.");
        return;
      }

      setProductData(foundProduct);
      setInitialData(foundProduct);
      setFormData({
        name: foundProduct.name,
        categoryId: foundProduct.categoryId,
        price: foundProduct.price.toString(),
        stockQuantity: foundProduct.stockQuantity.toString(),
        minStockThreshold: foundProduct.minStockThreshold.toString(),
        status: foundProduct.status,
      });
      
      // If product category is banned/inactive, we might still want to show it in the list so the dropdown works
      if (foundProduct.categoryId && !activeCats.find(c => c.id === foundProduct.categoryId)) {
        const missingCat = cats.find(c => c.id === foundProduct.categoryId);
        if (missingCat) {
          setCategories(prev => [...prev, missingCat]);
        }
      }

      setError("");
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoadingData(false);
    }
  }, [accessToken, productId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "ADMIN") return; // Admins use restrict instead of operational updates
    
    setError("");

    if (!formData.name.trim()) return setError("Product name is required");
    if (!formData.categoryId) return setError("Category is required");
    if (!formData.price || Number(formData.price) <= 0) return setError("Valid price is required");
    if (Number(formData.stockQuantity) < 0) return setError("Stock cannot be negative");
    if (Number(formData.minStockThreshold) < 0) return setError("Threshold cannot be negative");

    setIsLoading(true);

    try {
      if (!accessToken) throw new Error("Missing auth token. Please login again.");

      await updateProduct({
        productId,
        data: {
          name: formData.name.trim(),
          categoryId: formData.categoryId,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          minStockThreshold: Number(formData.minStockThreshold),
        }
      }).unwrap();

      messageApi.success("Product updated successfully.");
      router.push("/dashboard/products");
    } catch (err: any) {
      const text = err?.data?.message || err.message || "Failed to update product.";
      setError(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestrict = () => {
    Modal.confirm({
      title: "Restrict Product",
      content: "Are you sure you want to restrict this product? It will no longer be available for ordering.",
      okText: "Yes, Restrict",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        if (!accessToken || !productId) return;
        setIsLoading(true);
        try {
          // You could use a specific endpoint, but PATCHing isActive often works. If not, use backend fallback or standard react fetch.
          // Since we want RTK invalidations, let's use the mutation with isActive: false
          await updateProduct({ productId, data: { isActive: false, status: "INACTIVE" } }).unwrap();
          messageApi.success("Product restricted.");
          if (productData) {
            setProductData({ ...productData, isActive: false });
          }
        } catch (err) {
          messageApi.error("Failed to restrict product.");
        } finally {
          setIsLoading(false);
        }
      },
    });
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
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
          <span className="text-slate-600">
            {userRole === "ADMIN" ? "Product Details" : "Edit Product"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${productData?.isActive !== false ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20' : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/20'}`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {userRole === "ADMIN" ? "Product Details" : "Edit Product"}
                </h1>
                {productData?.isActive === false && (
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200/60 uppercase tracking-widest mt-1">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {userRole === "ADMIN" ? "View product system statistics and configuration." : "Update this product's inventory settings."}
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
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {userRole !== "ADMIN" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="" disabled>Select a Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.isActive === false ? "(Banned)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>

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
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Immutable Admin detail view */}
              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                 <h4 className="font-semibold text-slate-900 text-sm mb-4">
                  Product Details & Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Product ID</p>
                    <p className="text-sm text-slate-700 font-medium font-mono">{productData?.id || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Original Name</p>
                    <p className="text-sm text-slate-700 font-medium">{initialData?.name || "-"}</p>
                  </div>
                   <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm text-slate-700 font-medium">{productData?.category?.name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <p className="text-sm text-slate-700 font-medium">{productData?.status || "-"}</p>
                  </div>
                  {userRole === "ADMIN" && (
                    <>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Price</p>
                        <p className="text-sm text-slate-700 font-medium">${Number(initialData?.price || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Stock / Threshold</p>
                        <p className="text-sm text-slate-700 font-medium">{initialData?.stockQuantity || 0} / {initialData?.minStockThreshold || 0}</p>
                      </div>
                    </>
                  )}
                  {productData?.createdAt && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Created At</p>
                      <p className="text-sm text-slate-700 font-medium">{new Date(productData.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                  {productData?.updatedAt && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                      <p className="text-sm text-slate-700 font-medium">{new Date(productData.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
                {userRole === "ADMIN" && (
                  <button
                    type="button"
                    onClick={handleRestrict}
                    disabled={isLoading || loadingData || productData?.isActive === false}
                    className="w-full sm:w-auto px-6 py-2.5 border border-amber-200 text-amber-700 rounded-lg font-semibold text-sm hover:bg-amber-50 hover:border-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {productData?.isActive === false ? "Already Restricted" : "Restrict Product"}
                  </button>
                )}
                
                <div className="flex w-full sm:w-auto sm:ml-auto items-center gap-3">
                  <Link
                    href="/dashboard/products"
                    className="w-full sm:w-auto px-6 py-2.5 text-center border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                  >
                    {userRole === "ADMIN" ? "Close" : "Cancel"}
                  </Link>

                  {userRole === "MANAGER" && (
                    <button
                      type="submit"
                      disabled={isLoading || loadingData || productData?.isActive === false}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
