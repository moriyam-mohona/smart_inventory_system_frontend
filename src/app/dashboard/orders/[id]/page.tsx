import { FormModalShell } from "@/components/form-modal-shell";

interface Params {
  id: string;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  return (
    <FormModalShell closeHref="/dashboard/orders">
      <div className="space-y-8">
        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginBottom: "2rem" }}
        >
          <h2>Order Details</h2>
          <p className="card-subtitle">View and manage order information</p>
        </div>

        <div className="dashboard-grid">
          <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
            <h3>Order Information</h3>
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Order ID:</strong> #{id.slice(-6)}
              </p>
              <p>
                <strong>Customer:</strong> John Doe
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="pill pending">Pending</span>
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
            <h3>Order Summary</h3>
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Total Items:</strong> 3
              </p>
              <p>
                <strong>Subtotal:</strong> $250.00
              </p>
              <p>
                <strong>Tax:</strong> $25.00
              </p>
              <p style={{ fontSize: "1.1rem", marginTop: "0.75rem" }}>
                <strong>Total:</strong> $275.00
              </p>
            </div>
          </div>
        </div>

        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginTop: "2rem" }}
        >
          <h3>Order Items</h3>
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white text-left text-sm">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product 1</td>
                  <td>2</td>
                  <td>$100.00</td>
                  <td>$200.00</td>
                </tr>
                <tr>
                  <td>Product 2</td>
                  <td>1</td>
                  <td>$75.00</td>
                  <td>$75.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginTop: "2rem" }}
        >
          <h3>Update Status</h3>
          <label className="flex flex-col gap-2 w-full">
            <span>Order Status</span>
            <select className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500">
              <option>PENDING</option>
              <option>CONFIRMED</option>
              <option>SHIPPED</option>
              <option>DELIVERED</option>
              <option>CANCELLED</option>
            </select>
          </label>

          <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
            <button className="btn-primary">Update Status</button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
