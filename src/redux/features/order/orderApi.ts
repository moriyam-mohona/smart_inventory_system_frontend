import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create new order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["order", "product", "restock"],
    }),

    // Get all orders with filtering and pagination
    getAllOrders: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/orders${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),

    // Get order details
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "order", id: arg }, "order"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, statusData }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "order", id: arg.orderId },
        "order",
      ],
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "order", id: arg },
        "order",
        "product", // Cancelling restores stock, so products are invalidated
        "restock", // Restoring stock might resolve restock queue items
      ],
    }),

    // Get order status counts summary
    getOrderStatusCounts: builder.query({
      query: () => ({
        url: `/orders/summary/status-counts`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    // Update order items
    updateOrderItems: builder.mutation({
      query: ({ orderId, itemsData }) => ({
        url: `/orders/${orderId}/items`,
        method: "PATCH",
        body: itemsData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "order", id: arg.orderId },
        "order",
        "product",
        "restock",
      ],
    }),

    // Export orders
    exportOrders: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/orders/export${queryParams}`,
          method: "GET",
        };
      },
      // Not typically cached, or we could handle it via basic fetch in components
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetOrderStatusCountsQuery,
  useUpdateOrderItemsMutation,
  useLazyExportOrdersQuery,
} = orderApi;
