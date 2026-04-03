"use client";

import { useState } from "react";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function OrderFormComponent() {
  const router = useRouter();
  const { data: productsResponse, isLoading: productsLoading } = useGetAllProductsQuery({});
  const allProducts = productsResponse?.data || productsResponse?.items || productsResponse || [];
  const products = allProducts.filter((product: any) => product.isActive !== false);
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [customerName, setCustomerName] = useState("");
  // Simple cart state: { productId: string, quantity: number, price: number, name: string }
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || cart.length === 0) {
      Swal.fire("Error", "Please provide a customer name and at least one item.", "error");
      return;
    }

    try {
      const orderPayload = {
        customerName,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderPayload).unwrap();
      Swal.fire("Success", "Order created successfully", "success");
      router.push("/dashboard/orders");
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Failed to create order.", "error");
    }
  };

  const total = cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 border-b pb-2">Available Products</h3>
        {productsLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {products.map((product: any) => {
              // Ensure we check correct fields regardless of how populate happens
              const stockQuantity = product.stockQuantity ?? product.stock ?? 0;
              const productPrice = product.price ?? product.unitPrice ?? 0;
              const productId = product.id ?? product._id;
              
              return (
                <li
                  key={productId}
                  className="flex justify-between items-center p-3 border border-slate-200 rounded-xl hover:border-amber-300 transition-colors"
                >
                  <div>
                    <strong className="block text-sm text-slate-800">{product.name}</strong>
                    <span className="text-xs text-slate-500">
                      ${productPrice?.toFixed(2)} &middot; {stockQuantity} in stock
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart({ ...product, id: productId, price: productPrice, stockQuantity })}
                    disabled={stockQuantity <= 0}
                    className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </li>
              );
            })}
            {products.length === 0 && (
              <li className="text-sm text-slate-500 text-center p-4">No products found.</li>
            )}
          </ul>
        )}
      </div>

      {/* Cart & Checkout */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 border-b pb-2">New Order</h3>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="flex-1 overflow-y-auto mb-4 border border-slate-200 rounded-xl bg-white">
            {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Cart is empty. Add products from the list.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium w-24">Qty</th>
                    <th className="px-3 py-2 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-3 py-2 truncate max-w-[120px]">{item.name}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-16 border border-slate-300 rounded px-1 py-1 text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 mt-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-slate-700">Total:</span>
              <span className="text-xl font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || cart.length === 0}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-600/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
