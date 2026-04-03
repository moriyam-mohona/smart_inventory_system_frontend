import { FormModalShell } from "@/components/form-modal-shell";
import { OrderFormComponent } from "./order-form";

export const dynamic = "force-dynamic";

export default function NewOrderPage() {
  return (
    <FormModalShell closeHref="/dashboard/orders">
      <div className="space-y-8">
        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginBottom: "2rem" }}
        >
          <h2>Create New Order</h2>
          <p className="card-subtitle">
            Create a new customer order with products from your inventory
          </p>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
          <OrderFormComponent />
        </div>
      </div>
    </FormModalShell>
  );
}
