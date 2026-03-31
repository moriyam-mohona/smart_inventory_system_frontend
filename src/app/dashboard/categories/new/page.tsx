export default function NewCategoryPage() {
  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Create New Category</h2>
        <p className="card-subtitle">
          Add a new product category to your inventory
        </p>
      </div>

      <div className="card">
        <label className="field">
          <span>Category Name</span>
          <input
            className="input"
            type="text"
            placeholder="e.g., Electronics, Clothing, Groceries"
          />
        </label>

        <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn primary" type="submit">
            Create Category
          </button>
          <button className="btn" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
