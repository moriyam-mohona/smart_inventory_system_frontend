"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";

import {
  getCategoriesByManager,
  type ManagerCategory,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

export default function CategoriesPage() {
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const [categories, setCategories] = useState<ManagerCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadCategories = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      const rows = await getCategoriesByManager(accessToken);
      setCategories(rows);
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to load categories.";
      messageApi.error(text);
    } finally {
      setLoading(false);
    }
  }, [accessToken, messageApi]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <div>
      {contextHolder}
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="card p-10 text-center text-slate-500">
          Loading categories...
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-4">
          {categories.map(
            (cat: { id: string; name: string; createdAt?: string }) => (
              <Link key={cat.id} href={`/dashboard/categories/${cat.id}`}>
                <div className="card card-hover p-5 group overflow-hidden relative">
                  {/* Background accent */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-100 transition-colors shadow-sm">
                        <svg
                          className="w-6 h-6 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 000-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate group-hover:text-primary-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Created on{" "}
                          {cat.createdAt
                            ? new Date(cat.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors shadow-sm">
                        <svg
                          className="w-4 h-4 text-slate-600 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
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
            ),
          )}
        </div>
      ) : (
        <div className="card p-12 text-center">
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No categories yet
          </h3>
          <p className="text-slate-500 mb-6">
            Get started by creating your first product category to organize your
            inventory.
          </p>
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
        </div>
      )}
    </div>
  );
}
