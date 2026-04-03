"use client";

import Link from "next/link";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useAppSelector } from "@/redux/hooks";
import { Spin } from "antd";

export default function ProductsPage() {
  const { data: response, isLoading, error: queryError } = useGetAllProductsQuery({});
  const products = response?.data || response?.items || response || [];
  
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const error = queryError ? "Failed to load products" : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
                <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Products
              </h1>
              <p className="text-sm text-slate-500">
                Manage your inventory and product listings
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-col xs:flex-row">
            {userRole === "ADMIN" && (
              <Link
                href="/dashboard/categories"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                </svg>
                Categories
              </Link>
            )}
            {userRole === "MANAGER" && (
              <>
                <Link
                  href="/dashboard/categories"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                  </svg>
                  Category Tools
                </Link>
                <Link
                  href="/dashboard/products/new"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:ring-offset-2 active:scale-95"
                >
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
                  Add Product
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          <p className="font-semibold text-sm">Failed to load system products</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4">
          {products.map((product: any) => (
            <Link key={product.id || product._id} href={`/dashboard/products/${product.id || product._id}`}>
              <div className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer overflow-hidden relative">
                {/* Background accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Product Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-100 transition-colors">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>
                        {!product.isActive && (
                           <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200/60 uppercase tracking-widest">
                             Inactive
                           </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                          </svg>
                          {product.category?.name || "Uncategorized"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.16 5.314l4.897-4.896a1 1 0 011.414 0l4.896 4.896a1 1 0 01-1.414 1.414L13 3.828V13a1 1 0 11-2 0V3.828l-3.793 3.793a1 1 0 01-1.414-1.414z" />
                          </svg>
                          {product.stockQuantity} in stock
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        ${Number(product.price).toFixed(2)}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded inline-block mt-0.5 ${
                          product.status === "ACTIVE" && product.stockQuantity > product.minStockThreshold
                            ? "bg-green-100 text-green-700 border border-green-200/50"
                            : product.status === "ACTIVE" && product.stockQuantity <= product.minStockThreshold && product.stockQuantity > 0
                            ? "bg-amber-100 text-amber-700 border border-amber-200/50"
                            : "bg-red-100 text-red-700 border border-red-200/50"
                        }`}
                      >
                        {product.status === "ACTIVE" && product.stockQuantity > product.minStockThreshold
                          ? "In Stock"
                          : product.status === "ACTIVE" && product.stockQuantity <= product.minStockThreshold && product.stockQuantity > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No products yet
          </h3>
          <p className="text-slate-500 mb-6">
            {userRole === "MANAGER" ? "Start building your inventory by adding your first product." : "There are currently no products in the system."}
          </p>
          {userRole === "MANAGER" && (
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Your First Product
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
