"use client";

import { useGetRestockQueueQuery, useRestockItemMutation } from "@/redux/features/restock/restockApi";
import Swal from "sweetalert2";

export default function LowStockPage() {
  const { data, isLoading, error } = useGetRestockQueueQuery({});
  const [restockItem, { isLoading: isRestocking }] = useRestockItemMutation();

  const restockItems = data?.data || data?.items || data || [];

  const handleRestock = async (id: string, productName: string) => {
    const { value: formValues } = await Swal.fire({
      title: "Restock Item",
      html: `
        <div class="text-left">
          <p class="mb-4 text-sm text-slate-500">Update stock for <strong>${productName}</strong>.</p>
          <label class="block text-sm font-medium text-slate-700 mb-1">New Stock Quantity *</label>
          <input id="swal-sq" type="number" class="w-full border border-slate-300 px-3 py-2 rounded-lg mb-4 focus:ring-amber-500 focus:border-amber-500" placeholder="e.g. 50" min="1" step="1">
          <label class="block text-sm font-medium text-slate-700 mb-1">Note (optional)</label>
          <input id="swal-note" type="text" class="w-full border border-slate-300 px-3 py-2 rounded-lg focus:ring-amber-500 focus:border-amber-500" placeholder="e.g. Received shipment from supplier">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm Restock",
      confirmButtonColor: "#d97706",
      preConfirm: () => {
        const sqInput = (document.getElementById("swal-sq") as HTMLInputElement).value;
        const noteInput = (document.getElementById("swal-note") as HTMLInputElement).value;
        const restockQuantity = parseInt(sqInput, 10);
        
        if (isNaN(restockQuantity) || restockQuantity <= 0) {
          Swal.showValidationMessage("Please enter a valid stock quantity above 0.");
          return false;
        }
        
        return { restockQuantity, note: noteInput || undefined };
      }
    });

    if (formValues) {
      try {
        await restockItem({ id, ...formValues }).unwrap();
        Swal.fire("Success", "Restock applied successfully. List will update automatically based on the new threshold.", "success");
      } catch (err: any) {
        Swal.fire("Error", err?.data?.message || "Failed to restock item.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="mb-0">
                Restock Queue
              </h1>
              <p className="card-subtitle !text-[14px]">
                Products that need restocking soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm">
          <p className="font-semibold text-sm">Failed to load restock queue</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      ) : restockItems.length > 0 ? (
        <div className="grid gap-4">
          {restockItems.map((item: any) => {
            const productName = item.product?.name || item.productId;
            const currentStock = item.currentStock ?? item.product?.stockQuantity ?? 0;
            const threshold = item.minStockThreshold ?? item.product?.minStockThreshold ?? 5;
            
            let priority = item.priority?.toLowerCase();
            if (!priority) {
              const shortage = threshold - currentStock;
              priority = shortage > 20 ? "high" : shortage > 10 ? "medium" : "low";
            }

            const priorityColors: Record<string, { bg: string, text: string, border: string }> = {
              high: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200/50" },
              medium: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200/50" },
              low: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200/50" },
            };
            
            const config = priorityColors[priority] || priorityColors.low;

            return (
              <div
                key={item.id || item._id}
                className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-default overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-colors">
                      <svg
                        className="w-6 h-6 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="mb-0 !text-[15px] truncate">
                          {productName}
                        </h3>
                        {currentStock === 0 && (
                           <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 label-caps !text-red-700 border border-red-200/60 !tracking-wide">
                             Out of Stock
                           </span>
                        )}
                      </div>
                       <div className="flex items-center gap-3 label-caps !text-slate-500 !tracking-tight">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.16 5.314l4.897-4.896a1 1 0 011.414 0l4.896 4.896a1 1 0 01-1.414 1.414L13 3.828V13a1 1 0 11-2 0V3.828l-3.793 3.793a1 1 0 01-1.414-1.414z" />
                          </svg>
                          <strong className="text-slate-700">{currentStock}</strong> / {threshold} threshold
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Open since {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "recently"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex-shrink-0 flex items-center gap-4">
                     <div className="text-right hidden sm:block">
                      <span
                        className={`label-caps px-2 py-1 rounded inline-block border !tracking-normal ${config.bg} ${config.text} ${config.border}`}
                      >
                        {priority} Priority
                      </span>
                    </div>
                    <button
                      onClick={() => handleRestock(item.id || item._id, productName)}
                      disabled={isRestocking}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-amber-600/30 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
           <h3 className="mb-2">
            All products are well stocked!
          </h3>
          <p className="card-subtitle">
            No items are currently below their minimum threshold.
          </p>
        </div>
      )}
    </div>
  );
}
