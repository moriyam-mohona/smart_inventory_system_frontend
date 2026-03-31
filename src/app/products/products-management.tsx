"use client";

import { useMemo, useState } from "react";

import { getSession } from "@/lib/session-store";
import type { ProductListItem } from "@/types/inventory";

type StockFilter = "ALL" | "LOW" | "OUT" | "OK";

interface ProductsManagementProps {
  products: ProductListItem[];
}

function stockState(product: ProductListItem): StockFilter {
  if (product.stockQuantity <= 0) {
    return "OUT";
  }
  if (product.stockQuantity <= product.minStockThreshold) {
    return "LOW";
  }
  return "OK";
}

function toPillClass(state: StockFilter) {
  if (state === "OUT") {
    return "out-of-stock";
  }
  if (state === "LOW") {
    return "low";
  }
  return "in-stock";
}

function toLabel(state: StockFilter) {
  if (state === "OUT") {
    return "out-of-stock";
  }
  if (state === "LOW") {
    return "low";
  }
  return "in-stock";
}

export function ProductsManagement({ products }: ProductsManagementProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StockFilter>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const role = getSession()?.role ?? "MANAGER";

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const state = stockState(product);
      const textMatch =
        normalized.length === 0 ||
        product.name.toLowerCase().includes(normalized) ||
        (product.sku ?? "").toLowerCase().includes(normalized) ||
        product.categoryName.toLowerCase().includes(normalized);
      const stateMatch = filter === "ALL" || state === filter;
      return textMatch && stateMatch;
    });
  }, [products, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="card">
      <div className="row spread center wrap">
        <div>
          <h2>Products Data Grid</h2>
          <p className="card-subtitle">
            Search, filter, and paginate inventory records for large datasets.
          </p>
        </div>
        <span className="pill pending">Role: {role.toLowerCase()}</span>
      </div>

      <div className="row products-filters wrap">
        <label className="field compact-field">
          Search
          <input
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Name, SKU, or category"
          />
        </label>

        <label className="field compact-field">
          Stock Filter
          <select
            className="input"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value as StockFilter);
              setPage(1);
            }}
          >
            <option value="ALL">All</option>
            <option value="LOW">Low stock</option>
            <option value="OUT">Out of stock</option>
            <option value="OK">In stock</option>
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => {
              const state = stockState(product);
              return (
                <tr key={product.id}>
                  <td>{product.sku ?? "-"}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.minStockThreshold}</td>
                  <td>
                    <span className={`pill ${toPillClass(state)}`}>
                      {toLabel(state)}
                    </span>
                  </td>
                  <td>{new Date(product.updatedAt).toLocaleString()}</td>
                </tr>
              );
            })}
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <p className="empty">No products match your filters.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="row spread center pagination-row">
        <p className="empty">
          Showing {(currentPage - 1) * pageSize + (paginated.length ? 1 : 0)}-
          {(currentPage - 1) * pageSize + paginated.length} of {filtered.length}
        </p>
        <div className="row">
          <button
            className="btn"
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="pill">
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="btn"
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
