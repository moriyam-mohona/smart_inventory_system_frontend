import { getCategories } from "@/lib/inventory-service";

import { CategorySetup } from "./category-setup";

export const revalidate = 180;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="container stack-lg">
      <section className="hero">
        <p className="eyebrow">Category Setup</p>
        <h1>Configure product categories</h1>
        <p>Frontend workflow for creating and organizing product categories.</p>
      </section>

      <CategorySetup initialCategories={categories} />
    </main>
  );
}
