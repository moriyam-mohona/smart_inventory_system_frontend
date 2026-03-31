"use client";

import { useMemo, useState } from "react";

import type { Category } from "@/types/inventory";

interface CategorySetupProps {
  initialCategories: Category[];
}

export function CategorySetup({ initialCategories }: CategorySetupProps) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState(initialCategories);
  const [message, setMessage] = useState("");

  const normalized = useMemo(
    () => categories.map((item) => item.name.trim().toLowerCase()),
    [categories],
  );

  function createCategory() {
    const value = name.trim();

    if (value.length < 2) {
      setMessage("Category name must be at least 2 characters.");
      return;
    }

    if (normalized.includes(value.toLowerCase())) {
      setMessage("This category already exists.");
      return;
    }

    const now = new Date().toISOString();

    setCategories((current) => [
      {
        id: `draft-${Date.now()}`,
        name: value,
        createdById: null,
        createdAt: now,
        updatedAt: now,
      },
      ...current,
    ]);
    setName("");
    setMessage("Category added to frontend draft state.");
  }

  return (
    <section className="card setup-grid">
      <div>
        <h2>Create Category</h2>
        <p className="card-subtitle">
          Add product categories like Electronics, Grocery, and Clothing.
        </p>

        <label className="field">
          Category Name
          <input
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Electronics"
          />
        </label>

        <div className="setup-actions">
          <button
            className="btn primary"
            type="button"
            onClick={createCategory}
            disabled={name.trim().length < 2}
          >
            Create Category
          </button>
        </div>

        {message ? <p className="server-message">{message}</p> : null}
      </div>

      <div>
        <h3>Available Categories</h3>
        <p className="card-subtitle">
          Local preview before backend integration.
        </p>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
