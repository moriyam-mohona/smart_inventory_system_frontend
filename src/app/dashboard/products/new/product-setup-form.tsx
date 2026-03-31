"use client";

export function ProductSetupForm({ categories }: { categories: any[] }) {
  return (
    <div>
      <p className="card-subtitle">
        Product setup form will be integrated here
      </p>
      <div style={{ marginTop: "2rem" }}>
        <h3>Available Categories</h3>
        <ul className="product-summary-list">
          {categories.slice(0, 5).map((cat: any) => (
            <li key={cat.id}>
              <strong>{cat.name}</strong>
              <div className="product-summary-details">
                <span>ID: {cat.id}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
