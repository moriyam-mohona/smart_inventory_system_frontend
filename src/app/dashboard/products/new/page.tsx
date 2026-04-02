import { getCategories } from "@/lib/inventory-service";
import { ProductSetupForm } from "./product-setup-form";

export const revalidate = 120;

export default async function AddProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm" style={{ marginBottom: "2rem" }}>
        <h2>Add New Product</h2>
        <p className="card-subtitle">Create a new product in your inventory</p>
      </div>

      <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm">
        <ProductSetupForm categories={categories} />
      </div>
    </div>
  );
}
