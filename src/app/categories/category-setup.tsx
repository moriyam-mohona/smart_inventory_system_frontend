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

        <label className="flex flex-col gap-2 w-full">
          Category Name
          <input
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Electronics"
          />
        </label>

        <div className="setup-actions">
          <button
            className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2"
            type="button"
            onClick={createCategory}
            disabled={name.trim().length < 2}
          >
            Create Category
          </button>
        </div>

        {message ? <p className="mt-4 p-3 font-semibold rounded-lg bg-red-100 text-red-700 text-sm">{message}</p> : null}
      </div>

      <div>
        <h3>Available Categories</h3>
        <p className="card-subtitle">
          Local preview before backend integration.
        </p>

        <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm">
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
