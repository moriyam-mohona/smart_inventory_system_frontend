"use client";

import { useState } from "react";
import { Modal, Button, Tag, Table, Select, Descriptions, Divider, InputNumber, Input, message } from "antd";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { RoleVisibility } from "@/components/role-visibility";

export default function OrdersPage() {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"CREATE" | "DETAILS">("CREATE");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  const { data: response, isLoading: ordersLoading } = useGetAllOrdersQuery({});
  const orders = response?.data || response?.items || response || [];

  const { data: detailsData, isFetching: detailsLoading } = useGetOrderDetailsQuery(selectedOrderId ?? "", {
    skip: !selectedOrderId || modalType !== "DETAILS",
  });

  const { data: productsRes, isLoading: productsLoading } = useGetAllProductsQuery({});
  const allProducts = Array.isArray(productsRes?.data) ? productsRes.data : [];
  const activeProducts = allProducts.filter((p: any) => p.isActive && p.stockQuantity > 0);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const statusColors: any = {
    PENDING: "gold",
    CONFIRMED: "blue",
    SHIPPED: "purple",
    DELIVERED: "green",
    CANCELLED: "red",
  };

  const statusLabels: any = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const openCreate = () => {
    setModalType("CREATE");
    setSelectedOrderId(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCart([]);
    setIsModalOpen(true);
  };

  const openDetails = (id: string) => {
    setModalType("DETAILS");
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCart([]);
  };

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        messageApi.warning("No more stock available for this item.");
        return;
      }
      setCart(cart.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, maxStock: product.stockQuantity }]);
    }
    messageApi.success(`${product.name} added to order.`);
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((item) => item.productId !== productId));
      return;
    }
    setCart(cart.map((item) => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const handleCreateOrder = async () => {
    if (!customerName.trim()) {
      messageApi.error("Please enter a customer name.");
      return;
    }
    if (cart.length === 0) {
      messageApi.error("Please add at least one item to the order.");
      return;
    }
    try {
      await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        customerAddress: customerAddress.trim() || undefined,
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap();
      messageApi.success("Order placed successfully!");
      closeModal();
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Failed to place order. Please try again.");
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedOrderId) return;
    try {
      await updateStatus({ orderId: selectedOrderId, statusData: { status } }).unwrap();
      messageApi.success(`Order status updated to ${statusLabels[status] ?? status}.`);
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleCancelOrder = () => {
    if (!selectedOrderId) return;
    Modal.confirm({
      title: "Cancel this order?",
      content: "Cancelling will return all items back to stock. This cannot be undone.",
      okText: "Yes, cancel order",
      okType: "danger",
      cancelText: "Keep order",
      onOk: async () => {
        try {
          await cancelOrder(selectedOrderId).unwrap();
          messageApi.success("Order cancelled and stock restored.");
          closeModal();
        } catch (err: any) {
          messageApi.error(err?.data?.message || "Failed to cancel order.");
        }
      },
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <div className="space-y-5">
      {contextHolder}

      {/* Page Header */}
      <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-br from-white to-amber-50/40 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="label-caps text-amber-700 mb-1">Order Management</p>
          <h1 className="leading-tight mb-1">Orders</h1>
          <p className="card-subtitle">Track, manage, and update customer orders.</p>
        </div>
        {(userRole === "MANAGER" || userRole === "ADMIN") && (
          <Button
            type="primary"
            onClick={openCreate}
            className="btn-primary h-10 px-5 rounded-xl font-bold text-sm shadow-md shadow-amber-600/15 border-amber-700/20 bg-amber-600 hover:!bg-amber-700 shrink-0"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </span>
          </Button>
        )}
      </div>

      {/* Order List */}
      <div className="space-y-2.5">
        {ordersLoading ? (
          <div className="grid gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/60 animate-pulse rounded-2xl border border-slate-100" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-2.5">
            {orders.map((order: any) => (
              <div
                key={order.id || order._id}
                onClick={() => openDetails(order.id || order._id)}
                className="group flex items-center justify-between gap-4 px-5 py-4 border border-slate-100/80 rounded-2xl bg-white shadow-sm hover:shadow-md hover:shadow-amber-100/60 hover:border-amber-200 cursor-pointer transition-all duration-200"
              >
                {/* Left: icon + info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${order.status === "CANCELLED" ? "bg-slate-100 text-slate-300" : "bg-amber-50 text-amber-500 group-hover:bg-amber-100"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                      <span className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">
                        {order.orderNumber || `#${(order.id || order._id).slice(-6).toUpperCase()}`}
                      </span>
                      <Tag color={statusColors[order.status]} className="rounded-full text-[10px] font-bold border-none px-2 py-0 m-0">
                        {statusLabels[order.status] ?? order.status}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium flex-wrap">
                      <span className="text-slate-700 font-semibold">{order.customerName}</span>
                      <span className="text-slate-300">·</span>
                      <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <span className="hidden sm:inline">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: price + arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-base leading-none">${Number(order.totalPrice).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-500 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 p-14 text-center rounded-2xl">
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-slate-700 mb-1">No orders yet</h3>
            <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
              Create your first order to start tracking customer purchases.
            </p>
            {(userRole === "MANAGER" || userRole === "ADMIN") && (
              <Button
                type="primary"
                className="mt-6 h-10 px-6 rounded-xl font-bold bg-amber-600 hover:!bg-amber-700 border-none"
                onClick={openCreate}
              >
                Create Order
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={modalType === "CREATE" ? 980 : 740}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden"
        title={null}
      >
        {modalType === "CREATE" ? (
          /* ── Create Order Modal ── */
          <div className="flex flex-col lg:flex-row h-[80vh] lg:h-[620px]">

            {/* Left: Product picker */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/60 border-r border-slate-100">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-white">
                <h2 className="mb-0">Add Products</h2>
                <p className="card-subtitle mt-0.5">Click a product to add it to the order.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {productsLoading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 bg-white rounded-xl border border-slate-100" />
                    ))}
                  </div>
                ) : activeProducts.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-sm font-medium">
                    No products available in stock.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeProducts.map((p: any) => {
                      const inCart = cart.find((c) => c.productId === p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => addToCart(p)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border bg-white shadow-sm cursor-pointer transition-all group ${inCart ? "border-amber-300 bg-amber-50/40" : "border-slate-200 hover:border-amber-300 hover:shadow-amber-50"}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 truncate text-sm mb-0 group-hover:text-amber-700 transition-colors">{p.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">${p.price} · {p.stockQuantity} in stock</p>
                          </div>
                          <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${inCart ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600"}`}>
                            {inCart ? (
                              <span className="text-xs font-black">{inCart.quantity}</span>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="mb-0">Order Summary</h2>
                <p className="card-subtitle mt-0.5">Review items and enter customer details.</p>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden p-5 gap-3">
                {/* Customer details */}
                <div className="space-y-2.5">
                  <p className="label-caps text-slate-400 mb-1">Customer Details</p>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Name <span className="text-rose-400">*</span></label>
                    <Input
                      placeholder="e.g. John Doe"
                      size="middle"
                      className="rounded-xl h-10 border-slate-200 font-medium"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone <span className="text-slate-300 font-normal">optional</span></label>
                    <Input
                      placeholder="e.g. +8801712345678"
                      size="middle"
                      className="rounded-xl h-10 border-slate-200 font-medium"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Address <span className="text-slate-300 font-normal">optional</span></label>
                    <Input
                      placeholder="e.g. Dhaka, Bangladesh"
                      size="middle"
                      className="rounded-xl h-10 border-slate-200 font-medium"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/60">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 opacity-40 select-none text-center px-4">
                      <svg className="w-10 h-10 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm font-medium text-slate-500">No items added yet</p>
                      <p className="text-xs text-slate-400 mt-1">Click products on the left to add them here.</p>
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 bg-white px-3 py-2.5 rounded-lg border border-slate-100 shadow-sm">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 text-sm truncate mb-0">{item.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">${item.unitPrice} per unit</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <InputNumber
                              min={0}
                              max={item.maxStock}
                              value={item.quantity}
                              onChange={(val) => updateQuantity(item.productId, Number(val))}
                              size="small"
                              className="w-16 rounded-lg"
                            />
                            <span className="font-bold text-slate-800 text-sm w-16 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total + actions */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500">Order Total</span>
                    <span className="text-xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2.5">
                    <Button onClick={closeModal} className="h-10 flex-1 rounded-xl font-semibold text-slate-500 border-slate-200 bg-slate-50">
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleCreateOrder}
                      loading={isCreating}
                      disabled={!customerName.trim() || cart.length === 0}
                      className="h-10 flex-[2] rounded-xl btn-primary font-bold shadow-md shadow-primary-600/15"
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Order Details Modal ── */
          <div className="flex flex-col max-h-[88vh]">

            {/* Details header */}
            <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="label-caps text-amber-700 mb-0.5">Order Details</p>
                  <h2 className="mb-0">Order #{selectedOrderId?.slice(-6).toUpperCase()}</h2>
                </div>
              </div>
              {detailsData?.data?.order?.status && (
                <Tag
                  color={statusColors[detailsData.data.order.status]}
                  className="rounded-full font-bold px-3 py-0.5 text-xs m-0"
                >
                  {statusLabels[detailsData.data.order.status] ?? detailsData.data.order.status}
                </Tag>
              )}
            </div>

            {/* Details body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {detailsLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-32 bg-slate-100 rounded-2xl" />
                  <div className="h-48 bg-slate-50 rounded-2xl" />
                </div>
              ) : detailsData?.data && (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer info */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Order Info
                      </h4>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Customer">
                          <span className="font-bold text-slate-800">{detailsData.data.order.customerName}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Order No.">
                          <span className="font-mono font-bold text-amber-700 text-xs">{detailsData.data.order.orderNumber}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Placed on">
                          {new Date(detailsData.data.order.createdAt).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last updated">
                          {new Date(detailsData.data.order.updatedAt).toLocaleString()}
                        </Descriptions.Item>
                        {detailsData.data.order.cancelledAt && (
                          <Descriptions.Item label="Cancelled at">
                            <span className="text-rose-600 font-medium">{new Date(detailsData.data.order.cancelledAt).toLocaleString()}</span>
                          </Descriptions.Item>
                        )}
                        {detailsData.data.order.deliveredAt && (
                          <Descriptions.Item label="Delivered at">
                            <span className="text-emerald-600 font-medium">{new Date(detailsData.data.order.deliveredAt).toLocaleString()}</span>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Processed by">
                          <span className="font-medium text-slate-700">{detailsData.data.manager?.name || "—"}</span>
                          {detailsData.data.manager?.role && (
                            <Tag className="ml-2 rounded-full text-[9px] font-bold border-none m-0 px-2 bg-slate-100 text-slate-500">{detailsData.data.manager.role}</Tag>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Order ID">
                          <span className="font-mono text-[10px] text-slate-400 break-all">{detailsData.data.order.id}</span>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>

                    {/* Price summary */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                      <p className="label-caps mb-2 text-slate-400">Order Total</p>
                      <p className="text-4xl font-black text-slate-900 leading-none">
                        ${detailsData.data.order.totalPrice.toLocaleString()}
                      </p>
                      <Divider className="my-4" />
                      <div className="flex justify-center gap-6">
                        <div>
                          <p className="label-caps text-slate-400 mb-1">Products</p>
                          <p className="text-lg font-bold text-slate-800">{detailsData.data.items?.length || 0}</p>
                        </div>
                        <div className="w-px bg-slate-100" />
                        <div>
                          <p className="label-caps text-slate-400 mb-1">Total Units</p>
                          <p className="text-lg font-bold text-slate-800">
                            {detailsData.data.items?.reduce((acc: number, cur: any) => acc + cur.quantity, 0) || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items table */}
                  <div>
                    <h4 className="label-caps !text-slate-400 mb-3 ml-1">Items Ordered</h4>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <Table
                        dataSource={detailsData.data.items}
                        pagination={false}
                        size="small"
                        className="inventory-table"
                        rowKey="id"
                        columns={[
                          {
                            title: "Product",
                            key: "name",
                            render: (_: any, r: any) => (
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 mb-0 leading-tight">{r.product?.name || r.productId}</p>
                                {r.product?.category?.name && (
                                  <p className="text-[11px] text-slate-400 mt-0.5 mb-0">{r.product.category.name}</p>
                                )}
                              </div>
                            ),
                          },
                          {
                            title: "Stock Status",
                            key: "stockStatus",
                            align: "center" as const,
                            render: (_: any, r: any) => {
                              const s = r.product?.status;
                              const colors: any = { IN_STOCK: "green", LOW_STOCK: "orange", OUT_OF_STOCK: "red" };
                              const labels: any = { IN_STOCK: "In Stock", LOW_STOCK: "Low Stock", OUT_OF_STOCK: "Out of Stock" };
                              return s ? <Tag color={colors[s] ?? "default"} className="rounded-full text-[10px] font-bold border-none m-0 px-2">{labels[s] ?? s}</Tag> : <span className="text-slate-300">—</span>;
                            },
                          },
                          {
                            title: "Unit Price",
                            dataIndex: "unitPrice",
                            key: "price",
                            align: "right" as const,
                            render: (v: any) => <span className="text-slate-500 font-medium">${v}</span>,
                          },
                          {
                            title: "Qty",
                            dataIndex: "quantity",
                            key: "qty",
                            align: "center" as const,
                            render: (v: any) => (
                              <Tag className="rounded-md font-bold bg-slate-100 border-none m-0 px-2">{v}</Tag>
                            ),
                          },
                          {
                            title: "Subtotal",
                            dataIndex: "lineTotal",
                            key: "total",
                            align: "right" as const,
                            render: (v: any, r: any) => (
                              <span className="font-bold text-slate-900">${v ?? (r.quantity * r.unitPrice)}</span>
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Update status (Manager/Admin only) */}
                  {(userRole === "MANAGER" || userRole === "ADMIN") &&
                    detailsData.data.order.status !== "CANCELLED" &&
                    detailsData.data.order.status !== "DELIVERED" && (
                      <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100">
                        <h4 className="label-caps !text-amber-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Update Order Status
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-amber-700 mb-1.5">New Status</label>
                            <Select
                              className="w-full h-10"
                              placeholder="Select a status..."
                              defaultValue={detailsData.data.order.status}
                              onChange={handleStatusChange}
                              loading={isUpdatingStatus}
                              options={[
                                { label: "Pending", value: "PENDING" },
                                { label: "Confirmed", value: "CONFIRMED" },
                                { label: "Shipped", value: "SHIPPED" },
                                { label: "Delivered", value: "DELIVERED" },
                              ]}
                            />
                          </div>
                          <Button
                            danger
                            onClick={handleCancelOrder}
                            loading={isCancelling}
                            className="h-10 px-5 rounded-xl font-bold border-rose-200 bg-white text-rose-600 hover:!bg-rose-50"
                          >
                            Cancel Order
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* Admin audit trail */}
                  <RoleVisibility roles={["ADMIN"]}>
                    {detailsData.data.timeHistory?.timeline?.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="label-caps !text-slate-400 mb-4 ml-1">Activity History</h4>
                        <div className="space-y-3 pl-4 border-l-2 border-slate-100 ml-3">
                          {detailsData.data.timeHistory.timeline.map((event: any, idx: number) => (
                            <div key={idx} className="relative pl-5">
                              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-amber-300" />
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                  {event.action?.replace(/_/g, " ")}
                                </span>
                                {event.source && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                    {event.source.replace(/_/g, " ")}
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-slate-700 text-sm leading-tight mb-0.5">{event.message}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                {new Date(event.timestamp).toLocaleString()} · {event.actor?.name || "System"}
                                {event.actor?.role && <span className="ml-1 text-slate-300">({event.actor.role})</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </RoleVisibility>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <Button onClick={closeModal} block className="h-9 rounded-xl font-semibold text-slate-500 border-slate-200 bg-white hover:!bg-slate-50">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
