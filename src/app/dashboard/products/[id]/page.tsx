import { FormModalShell } from "@/components/form-modal-shell";

interface Params {
  id: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return (
    <FormModalShell closeHref="/dashboard/products">
      <div className="space-y-8">
        <div
          className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm"
          style={{ marginBottom: "2rem" }}
        >
          <h2>Product Details</h2>
          <p className="card-subtitle">Edit product information</p>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 w-full">
              <span>Product Name</span>
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                type="text"
                placeholder="Product name"
              />
            </label>
            <label className="flex flex-col gap-2 w-full">
              <span>Category</span>
              <select className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500">
                <option>Select a category</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 w-full">
              <span>Price</span>
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                type="number"
                placeholder="0.00"
              />
            </label>
            <label className="flex flex-col gap-2 w-full">
              <span>Stock Quantity</span>
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                type="number"
                placeholder="0"
              />
            </label>
            <label className="flex flex-col gap-2 w-full">
              <span>Minimum Threshold</span>
              <input
                className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                type="number"
                placeholder="0"
              />
            </label>
            <label className="flex flex-col gap-2 w-full">
              <span>Status</span>
              <select className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary-700 focus:ring-4 focus:ring-primary-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500">
                <option>ACTIVE</option>
                <option>OUT_OF_STOCK</option>
              </select>
            </label>
          </div>

          <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
            <button className="btn-primary">Save Changes</button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-primary-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-700/50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </FormModalShell>
  );
}
