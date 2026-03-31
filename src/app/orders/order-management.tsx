"use client";

import { useMemo, useState } from "react";

import type {
  DraftOrderItemInput,
  Order,
  OrderItem,
  OrderStatus,
  Product,
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

export function OrderManagement({ initialOrders, products }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [message, setMessage] = useState("");
  const [statusDrafts, setStatusDrafts] = useState<Record<string, OrderStatus>>({});

  const [draft, setDraft] = useState<OrderDraft>({
    customerName: "",
    selectedProductId: products[0]?.id ?? "",
    quantity: 1,
    items: [],
  });

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const statusOk = statusFilter === "ALL" || order.status === statusFilter;
        const dateOk =
          dateFilter.length === 0 || order.createdAt.slice(0, 10) === dateFilter;
        return statusOk && dateOk;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, statusFilter, dateFilter]);

  const draftTotal = useMemo(() => {
    return draft.items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        return sum;
      }
      return sum + product.price * item.quantity;
    }, 0);
  }, [draft.items, products]);

  function addDraftItem() {
    if (!draft.selectedProductId) {
      return;
    }

    if (!Number.isInteger(draft.quantity) || draft.quantity <= 0) {
      setMessage("Quantity must be a positive whole number.");
      return;
    }

    const selectedProduct = products.find(
      (product) => product.id === draft.selectedProductId,
    );

    if (!selectedProduct) {
      setMessage("Selected product is no longer available.");
      return;
    }

    setDraft((current) => {
      const existing = current.items.find(
        (item) => item.productId === current.selectedProductId,
      );

      if (existing) {
        return {
          ...current,
          items: current.items.map((item) =>
            item.productId === current.selectedProductId
              ? { ...item, quantity: item.quantity + current.quantity }
              : item,
          ),
        };
      }

      return {
        ...current,
        items: [
          ...current.items,
          { productId: current.selectedProductId, quantity: current.quantity },
        ],
      };
    });
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

    const now = new Date().toISOString();
    const orderId = `draft-order-${Date.now()}`;

    const items: OrderItem[] = draft.items.map((item, index) => {
      const product = products.find((entry) => entry.id === item.productId);
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

    setOrders((current) => [newOrder, ...current]);
    setDraft((current) => ({
      customerName: "",
      selectedProductId: current.selectedProductId,
      quantity: 1,
      items: [],
    }));
    setMessage("Order created in frontend state.");
  }

  function applyStatus(orderId: string) {
    const nextStatus = statusDrafts[orderId];
    if (!nextStatus) {
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

  return (
    <>
      <section className="card">
        <h2>Create New Order</h2>
        <p className="card-subtitle">
          Add customer, multiple products, quantity per product, and auto-calculate
          total price.
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
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (${product.price.toFixed(2)})
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
              const product = products.find((entry) => entry.id === item.productId);
              if (!product) {
                return null;
              }

              return (
                <div key={item.productId} className="line-item">
                  <span>
                    {product.name} x {item.quantity} (${(
                      product.price * item.quantity
                    ).toFixed(2)})
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
                        const product = products.find(
                          (entry) => entry.id === item.productId,
                        );
                        return (
                          <li key={item.id}>
                            {product?.name ?? "Unknown product"} x {item.quantity}
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
                    <p className="empty">No orders match the selected filters.</p>
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
