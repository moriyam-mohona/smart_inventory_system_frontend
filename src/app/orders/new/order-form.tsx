"use client";

import { useMemo, useState, useTransition } from "react";

import type { Product, ValidationIssue } from "@/types/inventory";

interface OrderFormProps {
  products: Product[];
}

interface DraftItem {
  productId: string;
  quantity: number;
}

function validateDraftItems(
  items: DraftItem[],
  products: Product[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      issues.push({
        productId: item.productId,
        code: "INVALID_QUANTITY",
        message: "Quantity must be a positive whole number.",
      });
      continue;
    }

    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );

    if (!product) {
      issues.push({
        productId: item.productId,
        code: "NOT_FOUND",
        message: "Product no longer exists in the catalog.",
      });
      continue;
    }

    if (product.stockQuantity <= 0) {
      issues.push({
        productId: item.productId,
        code: "OUT_OF_STOCK",
        message: `${product.name} is currently out of stock.`,
      });
      continue;
    }

    if (item.quantity > product.stockQuantity) {
      issues.push({
        productId: item.productId,
        code: "INSUFFICIENT_STOCK",
        message: `Requested ${item.quantity} units, but only ${product.stockQuantity} are available.`,
      });
    }
  }

  return issues;
}

export function OrderForm({ products }: OrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [serverMessage, setServerMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId,
      );
      if (!product) {
        return sum;
      }
      return sum + product.price * item.quantity;
    }, 0);
  }, [items, products]);

  function addItem() {
    if (!selectedProductId) {
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      setServerMessage("Quantity must be at least 1.");
      return;
    }

    setItems((current) => {
      const existing = current.find(
        (item) => item.productId === selectedProductId,
      );
      if (existing) {
        return current.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, { productId: selectedProductId, quantity }];
    });
  }

  function removeItem(productId: string) {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }

  function submitDraft() {
    setServerMessage("");
    setIssues([]);

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (!customerName || customerName.trim().length < 2) {
        setIssues([
          {
            productId: "FORM",
            code: "INVALID_QUANTITY",
            message: "Customer name must be at least 2 characters.",
          },
        ]);
        setServerMessage("Validation failed.");
        return;
      }

      if (items.length === 0) {
        setIssues([
          {
            productId: "FORM",
            code: "INVALID_QUANTITY",
            message: "Add at least one line item before validating.",
          },
        ]);
        setServerMessage("Validation failed.");
        return;
      }

      const validationIssues = validateDraftItems(items, products);
      setIssues(validationIssues);
      setServerMessage(
        validationIssues.length > 0
          ? "Conflicts detected. Review line items and try again."
          : "Draft validated successfully. No stock conflicts detected.",
      );
    });
  }

  return (
    <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
      <h2>Create Order Draft</h2>
      <p className="card-subtitle">
        Frontend validation simulates stock conflict checks before backend
        integration.
      </p>

      <label className="flex flex-col gap-2 w-full">
        Customer Name
        <input
          className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="Acme Distribution"
        />
      </label>

      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex flex-col gap-2 w-full">
          Product
          <select
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.stockQuantity} in stock)
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 w-full">
          Quantity
          <input
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value || 1))}
          />
        </label>

        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50"
          type="button"
          onClick={addItem}
        >
          Add Item
        </button>
      </div>

      <div className="order-lines">
        {items.length === 0 ? (
          <p className="text-slate-500 text-center p-8 italic">
            No items added yet.
          </p>
        ) : (
          items.map((item) => {
            const product = products.find(
              (candidate) => candidate.id === item.productId,
            );
            if (!product) {
              return null;
            }

            return (
              <div key={item.productId} className="line-item">
                <span>
                  {product.name} x {item.quantity}
                </span>
                <button
                  className="text-btn"
                  type="button"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="row spread">
        <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
        <button
          className="btn-primary"
          type="button"
          onClick={submitDraft}
          disabled={
            isPending || items.length === 0 || customerName.trim().length < 2
          }
        >
          {isPending ? "Validating..." : "Validate Draft"}
        </button>
      </div>

      {serverMessage ? (
        <p className="mt-4 p-3 font-semibold rounded-lg bg-red-100 text-red-700 text-sm">
          {serverMessage}
        </p>
      ) : null}
      {issues.length > 0 ? (
        <ul className="issues">
          {issues.map((issue, index) => (
            <li key={`${issue.productId}-${issue.code}-${index}`}>
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
