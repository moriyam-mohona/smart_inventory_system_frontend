"use client";

import { useMemo, useState } from "react";

import type { Category, ProductStatus } from "@/types/inventory";

interface ProductSetupFormProps {
  categories: Category[];
}

interface ProductDraft {
  name: string;
  categoryId: string;
  price: string;
  stockQuantity: string;
  minStockThreshold: string;
  status: ProductStatus;
}

const initialDraft: ProductDraft = {
  name: "",
  categoryId: "",
  price: "",
  stockQuantity: "",
  minStockThreshold: "5",
  status: "ACTIVE",
};

export function ProductSetupForm({ categories }: ProductSetupFormProps) {
  const [draft, setDraft] = useState<ProductDraft>({
    ...initialDraft,
    categoryId: categories[0]?.id ?? "",
  });
  const [message, setMessage] = useState("");
  const [draftProducts, setDraftProducts] = useState<
    Array<ProductDraft & { id: string; createdAt: string }>
  >([]);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === draft.categoryId),
    [categories, draft.categoryId],
  );

  function updateField<K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function createProduct() {
    const name = draft.name.trim();
    const price = Number(draft.price);
    const stockQuantity = Number(draft.stockQuantity);
    const minStockThreshold = Number(draft.minStockThreshold);

    if (name.length < 2) {
      setMessage("Product name must be at least 2 characters.");
      return;
    }

    if (!draft.categoryId) {
      setMessage("Select a category.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Price must be a positive number.");
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setMessage("Stock quantity must be 0 or greater.");
      return;
    }

    if (!Number.isInteger(minStockThreshold) || minStockThreshold < 0) {
      setMessage("Minimum stock threshold must be 0 or greater.");
      return;
    }

    const now = new Date().toISOString();

    setDraftProducts((current) => [
      {
        ...draft,
        name,
        id: `product-draft-${Date.now()}`,
        createdAt: now,
      },
      ...current,
    ]);

    setDraft((current) => ({
      ...initialDraft,
      categoryId: current.categoryId,
      minStockThreshold: "5",
      status: "ACTIVE",
    }));
    setMessage("Product added to frontend draft state.");
  }

  return (
    <section className="card setup-grid">
      <div>
        <h2>Add Product</h2>
        <p className="card-subtitle">
          Manual product entry flow for setup before backend integration.
        </p>

        <div className="setup-form-grid">
          <label className="field">
            Product Name
            <input
              className="input"
              value={draft.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Noise Cancelling Headphones"
            />
          </label>

          <label className="field">
            Category
            <select
              className="input"
              value={draft.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Price
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={draft.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="149.99"
            />
          </label>

          <label className="field">
            Stock Quantity
            <input
              className="input"
              type="number"
              min="0"
              step="1"
              value={draft.stockQuantity}
              onChange={(event) =>
                updateField("stockQuantity", event.target.value)
              }
              placeholder="25"
            />
          </label>

          <label className="field">
            Minimum Stock Threshold
            <input
              className="input"
              type="number"
              min="0"
              step="1"
              value={draft.minStockThreshold}
              onChange={(event) =>
                updateField("minStockThreshold", event.target.value)
              }
              placeholder="5"
            />
          </label>

          <label className="field">
            Status
            <select
              className="input"
              value={draft.status}
              onChange={(event) =>
                updateField("status", event.target.value as ProductStatus)
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </label>
        </div>

        <div className="setup-actions">
          <button className="btn primary" type="button" onClick={createProduct}>
            Add Product
          </button>
          <span className="setup-hint">
            Category: {selectedCategory?.name ?? "Not selected"}
          </span>
        </div>

        {message ? <p className="server-message">{message}</p> : null}
      </div>

      <div>
        <h3>Draft Products</h3>
        <p className="card-subtitle">Preview list from manual setup entries.</p>

        {draftProducts.length === 0 ? (
          <p className="empty">No draft products added yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Min Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {draftProducts.map((product) => {
                  const category = categories.find(
                    (item) => item.id === product.categoryId,
                  );
                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{category?.name ?? "Unknown"}</td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{product.stockQuantity}</td>
                      <td>{product.minStockThreshold}</td>
                      <td>
                        <span
                          className={`pill ${product.status.toLowerCase()}`}
                        >
                          {product.status === "ACTIVE"
                            ? "active"
                            : "out of stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
