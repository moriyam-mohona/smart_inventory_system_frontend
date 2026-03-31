"use client";

export function OrderFormComponent({ products }: { products: any[] }) {
  return (
    <div>
      <p className="card-subtitle">
        Order form will be integrated here with product selection
      </p>
      <div style={{ marginTop: "2rem" }}>
        <h3>Available Products</h3>
        <ul className="product-summary-list">
          {products.slice(0, 5).map((product: any) => (
            <li key={product.id}>
              <strong>{product.name}</strong>
              <div className="product-summary-details">
                <span>${product.price.toFixed(2)}</span>
                <span>{product.stockQuantity} in stock</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
