export default function NewCategoryPage() {
  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginBottom: "2rem" }}>
        <h2>Create New Category</h2>
        <p className="card-subtitle">
          Add a new product category to your inventory
        </p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-2 w-full">
          <span>Category Name</span>
          <input
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15 transition-all disabled:bg-slate-50 disabled:text-slate-500"
            type="text"
            placeholder="e.g., Electronics, Clothing, Groceries"
          />
        </label>

        <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
          <button className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2 border border-teal-700 bg-gradient-to-br from-teal-700 to-teal-800 text-white rounded-xl font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center focus:outline-none focus:ring-2 focus:ring-teal-700/50 focus:ring-offset-2" type="submit">
            Create Category
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-white hover:border-teal-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700/50" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
