interface Params {
  id: string;
}

export default function OrderDetailPage({ params }: { params: Params }) {
  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Order Details</h2>
        <p className="card-subtitle">View and manage order information</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Order Information</h3>
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Order ID:</strong> #{params.id.slice(-6)}
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

        <div className="card">
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

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3>Order Items</h3>
        <div className="table-wrap">
          <table className="table">
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

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3>Update Status</h3>
        <label className="field">
          <span>Order Status</span>
          <select className="input">
            <option>PENDING</option>
            <option>CONFIRMED</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        </label>

        <div className="setup-actions" style={{ marginTop: "1.5rem" }}>
          <button className="btn primary">Update Status</button>
          <button className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
