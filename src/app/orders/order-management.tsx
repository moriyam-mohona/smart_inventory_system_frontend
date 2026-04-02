"use client";

import { useEffect, useMemo, useState } from "react";

import { getSession } from "@/lib/session-store";
import type {
  ActivityAction,
  DraftOrderItemInput,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  RestockPriority,
  RestockQueue,
  UserRole,
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

interface ActivityEntry {
  id: string;
  action: ActivityAction;
  message: string;
  timestamp: string;
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

function toTimeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);
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
  const [currentRole, setCurrentRole] = useState<UserRole>("MANAGER");
  const [activityLogs, setActivityLogs] = useState<ActivityEntry[]>(() => {
    return initialOrders
      .slice(0, 5)
      .map((order) => ({
        id: `seed-${order.id}`,
        action: "ORDER_CREATED" as ActivityAction,
        message: `Order #${order.orderNumber} created by user`,
        timestamp: order.createdAt,
      }))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  });

  const [draft, setDraft] = useState<OrderDraft>({
    customerName: "",
    selectedProductId: products[0]?.id ?? "",
    quantity: 1,
    items: [],
  });

  const filteredOrders = useMemo(() => {
    const normalizedSearch = orderSearch.trim().toLowerCase();

    return orders
      .filter((order) => {
        const statusOk =
          statusFilter === "ALL" || order.status === statusFilter;
        const dateOk =
          dateFilter.length === 0 ||
          order.createdAt.slice(0, 10) === dateFilter;
        const searchOk =
          normalizedSearch.length === 0 ||
          order.orderNumber.toLowerCase().includes(normalizedSearch) ||
          order.customerName.toLowerCase().includes(normalizedSearch);
        return statusOk && dateOk && searchOk;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, statusFilter, dateFilter, orderSearch]);

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

  const orderPageSize = 5;
  const orderTotalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / orderPageSize),
  );
  const activeOrderPage = Math.min(orderPage, orderTotalPages);
  const paginatedOrders = filteredOrders.slice(
    (activeOrderPage - 1) * orderPageSize,
    activeOrderPage * orderPageSize,
  );

  const revenueByStatus = useMemo(() => {
    const result: Record<OrderStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    for (const order of filteredOrders) {
      result[order.status] += order.totalPrice;
    }

    return result;
  }, [filteredOrders]);

  const maxRevenue = Math.max(...Object.values(revenueByStatus), 1);

  useEffect(() => {
    const session = getSession();
    if (session?.role) {
      setCurrentRole(session.role);
    }
  }, []);

  function addActivity(
    action: ActivityAction,
    messageText: string,
    timestamp = new Date().toISOString(),
  ) {
    const entry: ActivityEntry = {
      id: `${action}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      action,
      message: messageText,
      timestamp,
    };

    setActivityLogs((current) => [entry, ...current].slice(0, 10));
  }

  useEffect(() => {
    const queueActivityEvents: Array<{
      action: ActivityAction;
      message: string;
    }> = [];

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
            queueActivityEvents.push({
              action: "RESTOCK_QUEUE_ADDED",
              message: `Product "${product.name}" added to Restock Queue`,
            });
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

    for (const event of queueActivityEvents) {
      addActivity(event.action, event.message);
    }
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
    addActivity(
      "ORDER_CREATED",
      `Order #${newOrder.orderNumber} created by user`,
      now,
    );
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

    addActivity(
      "ORDER_STATUS_UPDATED",
      `Order #${targetOrder.orderNumber} marked as ${toStatusLabel(nextStatus)}`,
      now,
    );

    setMessage("Order status updated.");
  }

  function cancelOrder(orderId: string) {
    if (currentRole !== "ADMIN") {
      setMessage("Only Admin can cancel orders.");
      return;
    }

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
    const target = orders.find((order) => order.id === orderId);
    if (target) {
      addActivity(
        "ORDER_CANCELLED",
        `Order #${target.orderNumber} cancelled by user`,
        now,
      );
    }
    setMessage("Order cancelled.");
  }

  function restockProduct(productId: string) {
    const amount = Number(restockAmounts[productId] ?? 0);

    if (!Number.isInteger(amount) || amount <= 0) {
      setMessage("Restock quantity must be a positive whole number.");
      return;
    }

    const now = new Date().toISOString();
    const productName =
      inventoryProducts.find((product) => product.id === productId)?.name ??
      "Unknown product";

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
    addActivity("STOCK_UPDATED", `Stock updated for "${productName}"`, now);
    setMessage("Stock updated from restock action.");
  }

  function removeFromQueue(productId: string) {
    if (currentRole !== "ADMIN") {
      setMessage("Only Admin can remove items from the restock queue.");
      return;
    }

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
    addActivity(
      "RESTOCK_QUEUE_REMOVED",
      `Product "${entry.productName}" removed from Restock Queue`,
      now,
    );
    setMessage("Item removed from restock queue.");
  }

  return (
    <>
      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>Activity Log</h2>
            <p className="card-subtitle">Latest 10 system actions.</p>
          </div>
          <span className="pill pending">
            Role: {currentRole.toLowerCase()}
          </span>
        </div>

        {activityLogs.length === 0 ? (
          <p className="text-slate-500 text-center p-8 italic">No recent activity yet.</p>
        ) : (
          <ul className="grid gap-3 list-none p-0">
            {activityLogs.map((entry) => (
              <li key={entry.id}>
                <strong>{toTimeLabel(entry.timestamp)}</strong> -{" "}
                {entry.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <h2>Create New Order</h2>
        <p className="card-subtitle">
          Add customer, multiple products, quantity per product, and
          auto-calculate total price.
        </p>

        <label className="flex flex-col gap-2 w-full">
          Customer Name
          <input
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
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

        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex flex-col gap-2 w-full">
            Product
            <select
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
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

          <label className="flex flex-col gap-2 w-full">
            Quantity
            <input
              className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
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

          <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50" type="button" onClick={addDraftItem}>
            Add Item
          </button>
        </div>

        <div className="order-lines">
          {draft.items.length === 0 ? (
            <p className="text-slate-500 text-center p-8 italic">No products selected yet.</p>
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
          <button className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2" type="button" onClick={createOrder}>
            Create Order
          </button>
        </div>
      </section>

      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
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

        <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm">
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
                        className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
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
                        className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
                        type="button"
                        onClick={() => restockProduct(entry.productId)}
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
                      type="button"
                      onClick={() => removeFromQueue(entry.productId)}
                      disabled={
                        entry.currentStock < entry.minStockThreshold ||
                        currentRole !== "ADMIN"
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {openRestockQueue.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="text-slate-500 text-center p-8 italic">No open restock queue items.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2>View and Manage Orders</h2>
            <p className="card-subtitle">
              Search, filter, paginate, and manage orders efficiently.
            </p>
          </div>

          <div className="row orders-filters wrap">
            <label className="field compact-field">
              Search
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                value={orderSearch}
                onChange={(event) => {
                  setOrderSearch(event.target.value);
                  setOrderPage(1);
                }}
                placeholder="Order # or customer"
              />
            </label>

            <label className="field compact-field">
              Status
              <select
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as "ALL" | OrderStatus);
                  setOrderPage(1);
                }}
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
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                type="date"
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(event.target.value);
                  setOrderPage(1);
                }}
              />
            </label>
          </div>
        </div>

        <div className="analytics-chart card-subtle">
          <h3>Revenue by Order Status</h3>
          <div className="chart-grid">
            {statusOptions.map((status) => {
              const value = revenueByStatus[status];
              const width = Math.max(
                (value / maxRevenue) * 100,
                value > 0 ? 8 : 0,
              );

              return (
                <div key={status} className="chart-row">
                  <span>{toStatusLabel(status)}</span>
                  <div className="chart-track">
                    <div className="chart-bar" style={{ width: `${width}%` }} />
                  </div>
                  <strong>${value.toFixed(2)}</strong>
                </div>
              );
            })}
          </div>
        </div>

        {message ? <p className="mt-4 p-3 font-semibold rounded-lg bg-red-100 text-red-700 text-sm">{message}</p> : null}

        <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white text-left text-sm">
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
              {paginatedOrders.map((order) => (
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
                        className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
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
                        className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
                        type="button"
                        onClick={() => applyStatus(order.id)}
                      >
                        Update
                      </button>

                      <button
                        className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        disabled={
                          order.status === "CANCELLED" ||
                          currentRole !== "ADMIN"
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <p className="text-slate-500 text-center p-8 italic">
                      No orders match the selected filters.
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="row spread center pagination-row">
          <p className="text-slate-500 text-center p-8 italic">
            Showing{" "}
            {(activeOrderPage - 1) * orderPageSize +
              (paginatedOrders.length ? 1 : 0)}
            -{(activeOrderPage - 1) * orderPageSize + paginatedOrders.length} of{" "}
            {filteredOrders.length}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
              type="button"
              disabled={activeOrderPage <= 1}
              onClick={() => setOrderPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize bg-slate-100">
              Page {activeOrderPage} / {orderTotalPages}
            </span>
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50"
              type="button"
              disabled={activeOrderPage >= orderTotalPages}
              onClick={() =>
                setOrderPage((prev) => Math.min(orderTotalPages, prev + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
