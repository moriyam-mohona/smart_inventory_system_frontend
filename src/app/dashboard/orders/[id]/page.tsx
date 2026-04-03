"use client";

import { use, useState } from "react";
import { FormModalShell } from "@/components/form-modal-shell";
import { RoleVisibility } from "@/components/role-visibility";
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/redux/features/order/orderApi";

import Swal from "sweetalert2";

interface Params {
  id: string;
}

export default function OrderDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  
  const { data, isLoading, error } = useGetOrderDetailsQuery(id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const responseData = data?.data || data;
  const order = responseData?.order;
  const manager = responseData?.manager;
  const items = responseData?.items || [];
  const timeHistory = responseData?.timeHistory;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    try {
      await updateStatus({
        orderId: id,
        statusData: { status: selectedStatus },
      }).unwrap();
      Swal.fire("Success", "Order status updated successfully", "success");
      setSelectedStatus("");
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Failed to update order status", "error");
    }
  };

  const handleCancelOrder = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel the order and restore stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await cancelOrder(id).unwrap();
        Swal.fire("Cancelled", "The order has been cancelled.", "success");
      } catch (err: any) {
        Swal.fire("Error", err?.data?.message || "Failed to cancel order", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <FormModalShell closeHref="/dashboard/orders">
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      </FormModalShell>
    );
  }

  if (error || !order) {
    return (
      <FormModalShell closeHref="/dashboard/orders">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
          Failed to load order details. It may not exist.
        </div>
      </FormModalShell>
    );
  }

  return (
    <FormModalShell closeHref="/dashboard/orders">
      <div className="space-y-8">
        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm flex justify-between items-start"
          style={{ marginBottom: "2rem" }}
        >
          <div>
             <h2>Order Details</h2>
             <p className="card-subtitle">#{order.orderNumber || id.slice(-6).toUpperCase()}</p>
          </div>
          {order.status === "CANCELLED" && (
            <span className="px-3 py-1 rounded bg-red-100 text-red-700 font-medium text-sm">
              CANCELLED
            </span>
          )}
        </div>

        <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Order Information</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-slate-600">Order Ref:</strong> {order.orderNumber || `#${id.slice(-6).toUpperCase()}`}
              </p>
              <p>
                <strong className="text-slate-600">Customer:</strong> {order.customerName || "N/A"}
              </p>
              <p>
                <strong className="text-slate-600">Status:</strong>{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                  {order.status}
                </span>
              </p>
              <p>
                <strong className="text-slate-600">Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-slate-600">Total Items:</strong>{" "}
                {items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0}
              </p>
              <p style={{ fontSize: "1.2rem", marginTop: "1rem" }} className="text-amber-700">
                <strong>Total Price:</strong> ${order.totalPrice?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Product</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Quantity</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Unit Price</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items?.map((item: any) => (
                  <tr key={item.id || item._id}>
                    <td className="px-4 py-3 text-slate-900 font-medium whitespace-nowrap">
                      {item.product?.name || item.productId}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {item.product?.category?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-600">${item.unitPrice?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      ${item.lineTotal?.toFixed(2) || (item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!items?.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No items found in this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager Actions - Accessible to MANAGER and ADMIN */}
        <RoleVisibility roles={["MANAGER", "ADMIN"]}>
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <div className="border border-amber-200 rounded-2xl bg-amber-50/30 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-amber-900">Order Actions</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-end">
                <label className="flex flex-col gap-2 w-full sm:max-w-[250px]">
                  <span className="text-sm font-medium text-amber-900">Change Status</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-amber-200 rounded-xl bg-white px-4 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all"
                  >
                    <option value="" disabled>Select new status...</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </label>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus || isUpdating}
                    className="flex-1 sm:flex-none px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="flex-1 sm:flex-none px-6 py-2 border border-red-200 bg-white text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </RoleVisibility>

        {/* Admin only Advanced Details */}
        <RoleVisibility roles={["ADMIN"]}>
          <div className="mt-8 border-t border-slate-200 pt-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Advanced Metadata (Admin)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manager Info */}
              {manager && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3 uppercase tracking-wider">Creator / Manager</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Name:</span> {manager.name}</p>
                    <p><span className="text-slate-500">Email:</span> {manager.email}</p>
                    <p><span className="text-slate-500">Role:</span> <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded">{manager.role}</span></p>
                  </div>
                </div>
              )}

              {/* Timestamp Tracking */}
              {timeHistory?.orderTimestamps && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3 uppercase tracking-wider">Timestamps</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Created At:</span> {new Date(timeHistory.orderTimestamps.createdAt).toLocaleString()}</p>
                    <p><span className="text-slate-500">Updated At:</span> {new Date(timeHistory.orderTimestamps.updatedAt).toLocaleString()}</p>
                    {timeHistory.orderTimestamps.deliveredAt && (
                      <p><span className="text-slate-500">Delivered At:</span> {new Date(timeHistory.orderTimestamps.deliveredAt).toLocaleString()}</p>
                    )}
                    {timeHistory.orderTimestamps.cancelledAt && (
                      <p><span className="text-slate-500 text-red-500">Cancelled At:</span> <span className="text-red-600">{new Date(timeHistory.orderTimestamps.cancelledAt).toLocaleString()}</span></p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            {timeHistory?.timeline?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h4 className="font-semibold text-sm text-slate-700 mb-4 uppercase tracking-wider">Order Timeline</h4>
                <div className="space-y-4">
                  {timeHistory.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-800">{event.message}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(event.timestamp).toLocaleString()} &middot; By {event.actor?.name || "System"} ({event.source})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RoleVisibility>

      </div>
    </FormModalShell>
  );
}
