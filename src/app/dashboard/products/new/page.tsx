"use client";

import { useCallback, useEffect, useState } from "react";
import { message } from "antd";

import {
  getCategoriesByManager,
  type ManagerCategory,
} from "@/lib/auth-service";
import { FormModalShell } from "@/components/form-modal-shell";
import { useAppSelector } from "@/redux/hooks";
import { ProductSetupForm } from "./product-setup-form";

export default function AddProductPage() {
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
    <FormModalShell closeHref="/dashboard/products">
      {contextHolder}
      <div className="space-y-8">
        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginBottom: "2rem" }}
        >
          <h2>Add New Product</h2>
          <p className="card-subtitle">
            Create a new product using categories created by manager.
          </p>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
          <ProductSetupForm
            categories={categories}
            loadingCategories={loading}
            onCategoriesRefresh={loadCategories}
          />
        </div>
      </div>
    </FormModalShell>
  );
}
