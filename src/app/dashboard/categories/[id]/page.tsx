interface Params {
  id: string;
}

export default function CategoryDetailPage({ params }: { params: Params }) {
  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Edit Category</h2>
        <p className="card-subtitle">Update category information</p>
      </div>

      <div className="card">
        <label className="field">
          <span>Category Name</span>
          <input
            className="input"
            type="text"
            placeholder="e.g., Electronics"
          />
        </label>

        <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn primary">Save Changes</button>
          <button className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
