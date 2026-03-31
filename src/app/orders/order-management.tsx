"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  DraftOrderItemInput,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  RestockPriority,
  RestockQueue,
} from "@/types/inventory";

interface OrderManagementProps {
  initialOrders: Order[];
  products: Product[];
}

interface OrderDraft {
  customerName: string;
  selectedProductId: string;
  quantity: number;
  items: DraftOrderItemInput[];
}

interface QueueEntry extends RestockQueue {
  productName: string;
}

const statusOptions: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function toStatusLabel(status: OrderStatus) {
  return status.toLowerCase().replaceAll("_", " ");
}

function makeOrderNumber(currentCount: number) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const serial = String(currentCount + 1).padStart(3, "0");
  return `ORD-${y}${m}${day}-${serial}`;
}

function nextProductStatus(stockQuantity: number): Product["status"] {
  return stockQuantity <= 0 ? "OUT_OF_STOCK" : "ACTIVE";
}

function stockWarning(available: number) {
  return `Only ${available} items available in stock`;
}

function isUnavailable(product: Product) {
  return !product.isActive || product.status === "OUT_OF_STOCK";
}

function getRestockPriority(
  stockQuantity: number,
  minStockThreshold: number,
): RestockPriority {
  if (stockQuantity <= 0) {
    return "HIGH";
  }

  const threshold = Math.max(minStockThreshold, 1);
  const shortageRatio = (threshold - stockQuantity) / threshold;

  if (shortageRatio >= 0.75) {
    return "HIGH";
  }

  if (shortageRatio >= 0.4) {
    return "MEDIUM";
  }

  return "LOW";
}

function toPriorityLabel(priority: RestockPriority) {
  return priority.toLowerCase();
}

export function OrderManagement({
  initialOrders,
  products,
}: OrderManagementProps) {
  const [inventoryProducts, setInventoryProducts] =
    useState<Product[]>(products);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reservedOrderIds, setReservedOrderIds] = useState<
    Record<string, boolean>
  >(() => {
    const seed: Record<string, boolean> = {};
    for (const order of initialOrders) {
      seed[order.id] = order.status !== "PENDING";
    }
    return seed;
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [message, setMessage] = useState("");
  const [statusDrafts, setStatusDrafts] = useState<Record<string, OrderStatus>>(
    {},
  );
  const [restockQueueMap, setRestockQueueMap] = useState<
    Record<string, QueueEntry>
  >({});
  const [restockAmounts, setRestockAmounts] = useState<Record<string, number>>(
    {},
  );

  const [draft, setDraft] = useState<OrderDraft>({
    customerName: "",
    selectedProductId: products[0]?.id ?? "",
    quantity: 1,
    items: [],
  });

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const statusOk =
          statusFilter === "ALL" || order.status === statusFilter;
        const dateOk =
          dateFilter.length === 0 ||
          order.createdAt.slice(0, 10) === dateFilter;
        return statusOk && dateOk;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, statusFilter, dateFilter]);

  const draftTotal = useMemo(() => {
    return draft.items.reduce((sum, item) => {
      const product = inventoryProducts.find(
        (entry) => entry.id === item.productId,
      );
      if (!product) {
        return sum;
      }
      return sum + product.price * item.quantity;
    }, 0);
  }, [draft.items, inventoryProducts]);

  const openRestockQueue = useMemo(() => {
    return Object.values(restockQueueMap)
      .filter((entry) => entry.status === "OPEN")
      .sort((a, b) => {
        if (a.currentStock !== b.currentStock) {
          return a.currentStock - b.currentStock;
        }
        return a.updatedAt.localeCompare(b.updatedAt);
      });
  }, [restockQueueMap]);

  useEffect(() => {
    setRestockQueueMap((current) => {
      let changed = false;
      const next: Record<string, QueueEntry> = { ...current };
      const now = new Date().toISOString();

      for (const product of inventoryProducts) {
        const belowThreshold =
          product.stockQuantity < product.minStockThreshold;
        const existing = next[product.id];

        if (belowThreshold) {
          const priority = getRestockPriority(
            product.stockQuantity,
            product.minStockThreshold,
          );

          if (!existing) {
            next[product.id] = {
              id: `rq-${product.id}`,
              productId: product.id,
              productName: product.name,
              currentStock: product.stockQuantity,
              minStockThreshold: product.minStockThreshold,
              priority,
              status: "OPEN",
              note: "Auto-added when stock dropped below threshold.",
              createdAt: now,
              updatedAt: now,
              resolvedAt: null,
            };
            changed = true;
            continue;
          }

          if (
            existing.status !== "OPEN" ||
            existing.currentStock !== product.stockQuantity ||
            existing.minStockThreshold !== product.minStockThreshold ||
            existing.priority !== priority ||
            existing.productName !== product.name
          ) {
            next[product.id] = {
              ...existing,
              productName: product.name,
              currentStock: product.stockQuantity,
              minStockThreshold: product.minStockThreshold,
              priority,
              status: "OPEN",
              updatedAt: now,
              resolvedAt: null,
            };
            changed = true;
          }
          continue;
        }

        if (
          existing &&
          existing.status === "OPEN" &&
          existing.currentStock !== product.stockQuantity
        ) {
          next[product.id] = {
            ...existing,
            currentStock: product.stockQuantity,
            updatedAt: now,
            priority: getRestockPriority(
              product.stockQuantity,
              product.minStockThreshold,
            ),
          };
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [inventoryProducts]);

  function addDraftItem() {
    if (!draft.selectedProductId) {
      return;
    }

    if (!Number.isInteger(draft.quantity) || draft.quantity <= 0) {
      setMessage("Quantity must be a positive whole number.");
      return;
    }

    const selectedProduct = inventoryProducts.find(
      (product) => product.id === draft.selectedProductId,
    );

    if (!selectedProduct) {
      setMessage("Selected product is no longer available.");
      return;
    }

    if (isUnavailable(selectedProduct)) {
      setMessage("This product is currently unavailable.");
      return;
    }

    const currentLine = draft.items.find(
      (item) => item.productId === draft.selectedProductId,
    );

    if (currentLine) {
      setMessage("This product is already added to the order.");
      return;
    }

    const remaining = selectedProduct.stockQuantity;

    if (draft.quantity > remaining) {
      setMessage(stockWarning(Math.max(remaining, 0)));
      return;
    }

    setDraft((current) => ({
      ...current,
      items: [
        ...current.items,
        { productId: current.selectedProductId, quantity: current.quantity },
      ],
    }));
    setMessage("");
  }

  function removeDraftItem(productId: string) {
    setDraft((current) => ({
      ...current,
      items: current.items.filter((item) => item.productId !== productId),
    }));
  }

  function createOrder() {
    const customerName = draft.customerName.trim();

    if (customerName.length < 2) {
      setMessage("Customer name must be at least 2 characters.");
      return;
    }

    if (draft.items.length === 0) {
      setMessage("Add at least one product line item.");
      return;
    }

    const shortages = draft.items
      .map((item) => {
        const product = inventoryProducts.find(
          (entry) => entry.id === item.productId,
        );
        const available = product?.stockQuantity ?? 0;
        return {
          unavailable: product ? isUnavailable(product) : true,
          requested: item.quantity,
          available,
          ok: item.quantity <= available,
        };
      })
      .filter((row) => row.unavailable || !row.ok);

    if (shortages.length > 0) {
      if (shortages[0].unavailable) {
        setMessage("This product is currently unavailable.");
        return;
      }
      setMessage(stockWarning(shortages[0].available));
      return;
    }

    const now = new Date().toISOString();
    const orderId = `draft-order-${Date.now()}`;

    const items: OrderItem[] = draft.items.map((item, index) => {
      const product = inventoryProducts.find(
        (entry) => entry.id === item.productId,
      );
      const unitPrice = product?.price ?? 0;
      return {
        id: `${orderId}-item-${index + 1}`,
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        createdAt: now,
      };
    });

    const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

    const newOrder: Order = {
      id: orderId,
      orderNumber: makeOrderNumber(orders.length),
      customerName,
      status: "PENDING",
      totalPrice,
      createdById: null,
      cancelledAt: null,
      deliveredAt: null,
      createdAt: now,
      updatedAt: now,
      items,
    };

    setInventoryProducts((current) =>
      current.map((product) => {
        const line = draft.items.find((item) => item.productId === product.id);
        if (!line) {
          return product;
        }
        const nextStock = Math.max(product.stockQuantity - line.quantity, 0);
        return {
          ...product,
          stockQuantity: nextStock,
          status: nextProductStatus(nextStock),
          updatedAt: now,
        };
      }),
    );
    setOrders((current) => [newOrder, ...current]);
    setReservedOrderIds((current) => ({ ...current, [orderId]: true }));
    setDraft((current) => ({
      customerName: "",
      selectedProductId: current.selectedProductId,
      quantity: 1,
      items: [],
    }));
    setMessage("Order created and stock deducted.");
  }

  function applyStatus(orderId: string) {
    const nextStatus = statusDrafts[orderId];
    if (!nextStatus) {
      return;
    }

    const targetOrder = orders.find((order) => order.id === orderId);
    if (!targetOrder) {
      return;
    }

    const requiresReservation =
      nextStatus === "CONFIRMED" && !reservedOrderIds[orderId];

    if (requiresReservation) {
      for (const item of targetOrder.items) {
        const product = inventoryProducts.find(
          (entry) => entry.id === item.productId,
        );

        if (!product || isUnavailable(product)) {
          setMessage("This product is currently unavailable.");
          return;
        }

        const available = product?.stockQuantity ?? 0;

        if (item.quantity > available) {
          setMessage(stockWarning(available));
          return;
        }
      }
    }

    const now = new Date().toISOString();

    if (requiresReservation) {
      setInventoryProducts((current) =>
        current.map((product) => {
          const line = targetOrder.items.find(
            (item) => item.productId === product.id,
          );
          if (!line) {
            return product;
          }

          const nextStock = Math.max(product.stockQuantity - line.quantity, 0);
          return {
            ...product,
            stockQuantity: nextStock,
            status: nextProductStatus(nextStock),
            updatedAt: now,
          };
        }),
      );
      setReservedOrderIds((current) => ({ ...current, [orderId]: true }));
    }

    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          status: nextStatus,
          updatedAt: now,
          cancelledAt: nextStatus === "CANCELLED" ? now : order.cancelledAt,
          deliveredAt: nextStatus === "DELIVERED" ? now : order.deliveredAt,
        };
      }),
    );

    setMessage("Order status updated.");
  }

  function cancelOrder(orderId: string) {
    const now = new Date().toISOString();

    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          status: "CANCELLED",
          cancelledAt: now,
          updatedAt: now,
        };
      }),
    );

    setStatusDrafts((current) => ({
      ...current,
      [orderId]: "CANCELLED",
    }));
    setMessage("Order cancelled.");
  }

  function restockProduct(productId: string) {
    const amount = Number(restockAmounts[productId] ?? 0);

    if (!Number.isInteger(amount) || amount <= 0) {
      setMessage("Restock quantity must be a positive whole number.");
      return;
    }

    const now = new Date().toISOString();

    setInventoryProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const nextStock = product.stockQuantity + amount;
        return {
          ...product,
          stockQuantity: nextStock,
          status: nextProductStatus(nextStock),
          updatedAt: now,
        };
      }),
    );

    setRestockAmounts((current) => ({
      ...current,
      [productId]: 0,
    }));
    setMessage("Stock updated from restock action.");
  }

  function removeFromQueue(productId: string) {
    const entry = restockQueueMap[productId];
    if (!entry || entry.status !== "OPEN") {
      return;
    }

    if (entry.currentStock < entry.minStockThreshold) {
      setMessage("Cannot remove item until stock reaches threshold.");
      return;
    }

    const now = new Date().toISOString();

    setRestockQueueMap((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        status: "CLOSED",
        updatedAt: now,
        resolvedAt: now,
      },
    }));
    setMessage("Item removed from restock queue.");
  }

  return (
    <>
      <section className="card">
        <h2>Create New Order</h2>
        <p className="card-subtitle">
          Add customer, multiple products, quantity per product, and
          auto-calculate total price.
        </p>

        <label className="field">
          Customer Name
          <input
            className="input"
            value={draft.customerName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                customerName: event.target.value,
              }))
            }
            placeholder="Acme Retail"
          />
        </label>

        <div className="row">
          <label className="field">
            Product
            <select
              className="input"
              value={draft.selectedProductId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  selectedProductId: event.target.value,
                }))
              }
            >
              {inventoryProducts.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                  disabled={isUnavailable(product)}
                >
                  {product.name} (${product.price.toFixed(2)}) -{" "}
                  {product.stockQuantity} in stock
                  {isUnavailable(product) ? " (unavailable)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Quantity
            <input
              className="input"
              type="number"
              min={1}
              step={1}
              value={draft.quantity}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  quantity: Number(event.target.value || 1),
                }))
              }
            />
          </label>

          <button className="btn" type="button" onClick={addDraftItem}>
            Add Item
          </button>
        </div>

        <div className="order-lines">
          {draft.items.length === 0 ? (
            <p className="empty">No products selected yet.</p>
          ) : (
            draft.items.map((item) => {
              const product = inventoryProducts.find(
                (entry) => entry.id === item.productId,
              );
              if (!product) {
                return null;
              }

              return (
                <div key={item.productId} className="line-item">
                  <span>
                    {product.name} x {item.quantity} ($
                    {(product.price * item.quantity).toFixed(2)})
                  </span>
                  <button
                    className="text-btn"
                    type="button"
                    onClick={() => removeDraftItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="row spread center">
          <strong>Total Price: ${draftTotal.toFixed(2)}</strong>
          <button className="btn primary" type="button" onClick={createOrder}>
            Create Order
          </button>
        </div>
      </section>

      <section className="card">
        <div className="row spread center wrap">
          <div>
            <h2>Restock Queue</h2>
            <p className="card-subtitle">
              Low-stock products are auto-added and sorted by lowest stock
              first.
            </p>
          </div>
          <span className="pill pending">
            Open Queue: {openRestockQueue.length}
          </span>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Priority</th>
                <th>Restock</th>
                <th>Queue Action</th>
              </tr>
            </thead>
            <tbody>
              {openRestockQueue.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.productName}</td>
                  <td>{entry.currentStock}</td>
                  <td>{entry.minStockThreshold}</td>
                  <td>
                    <span className={`pill ${entry.priority.toLowerCase()}`}>
                      {toPriorityLabel(entry.priority)}
                    </span>
                  </td>
                  <td>
                    <div className="orders-actions">
                      <input
                        className="input"
                        type="number"
                        min={1}
                        step={1}
                        value={restockAmounts[entry.productId] ?? ""}
                        onChange={(event) =>
                          setRestockAmounts((current) => ({
                            ...current,
                            [entry.productId]: Number(event.target.value || 0),
                          }))
                        }
                        placeholder="Qty"
                      />
                      <button
                        className="btn"
                        type="button"
                        onClick={() => restockProduct(entry.productId)}
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => removeFromQueue(entry.productId)}
                      disabled={entry.currentStock < entry.minStockThreshold}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {openRestockQueue.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="empty">No open restock queue items.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="row spread center wrap">
          <div>
            <h2>View and Manage Orders</h2>
            <p className="card-subtitle">
              Filter by status or order date, then update status or cancel.
            </p>
          </div>

          <div className="row orders-filters">
            <label className="field compact-field">
              Status
              <select
                className="input"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | OrderStatus)
                }
              >
                <option value="ALL">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {toStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="field compact-field">
              Date
              <input
                className="input"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              />
            </label>
          </div>
        </div>

        {message ? <p className="server-message">{message}</p> : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <ul className="order-items-list">
                      {order.items.map((item) => {
                        const product = inventoryProducts.find(
                          (entry) => entry.id === item.productId,
                        );
                        return (
                          <li key={item.id}>
                            {product?.name ?? "Unknown product"} x{" "}
                            {item.quantity}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`pill ${order.status.toLowerCase()}`}>
                      {toStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="orders-actions">
                      <select
                        className="input"
                        value={statusDrafts[order.id] ?? order.status}
                        onChange={(event) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [order.id]: event.target.value as OrderStatus,
                          }))
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {toStatusLabel(status)}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn"
                        type="button"
                        onClick={() => applyStatus(order.id)}
                      >
                        Update
                      </button>

                      <button
                        className="btn"
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        disabled={order.status === "CANCELLED"}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="empty">
                      No orders match the selected filters.
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
