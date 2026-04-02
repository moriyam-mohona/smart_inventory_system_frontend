interface Params {
  id: string;
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Product Details</h2>
        <p className="card-subtitle">Edit product information</p>
      </div>

      <div className="card">
        <div className="setup-form-grid">
          <label className="field">
            <span>Product Name</span>
            <input className="input" type="text" placeholder="Product name" />
          </label>
          <label className="field">
            <span>Category</span>
            <select className="input">
              <option>Select a category</option>
            </select>
          </label>
          <label className="field">
            <span>Price</span>
            <input className="input" type="number" placeholder="0.00" />
          </label>
          <label className="field">
            <span>Stock Quantity</span>
            <input className="input" type="number" placeholder="0" />
          </label>
          <label className="field">
            <span>Minimum Threshold</span>
            <input className="input" type="number" placeholder="0" />
          </label>
          <label className="field">
            <span>Status</span>
            <select className="input">
              <option>ACTIVE</option>
              <option>OUT_OF_STOCK</option>
            </select>
          </label>
        </div>

        <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn primary">Save Changes</button>
          <button className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
