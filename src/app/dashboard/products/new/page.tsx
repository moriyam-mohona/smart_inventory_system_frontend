import { getCategories } from "@/lib/inventory-service";
import { ProductSetupForm } from "./product-setup-form";

export const revalidate = 120;

export default async function AddProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Add New Product</h2>
        <p className="card-subtitle">Create a new product in your inventory</p>
      </div>

      <div className="card">
        <ProductSetupForm categories={categories} />
      </div>
    </div>
  );
}
