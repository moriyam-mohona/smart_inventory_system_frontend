import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new order — deducts stock, logs activity, sync restock queue
    createOrder: builder.mutation({
      query: (orderData: {
        customerName: string;
        items: Array<{ productId: string; quantity: number }>;
      }) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: [
        "order",
        "product",  // stock was deducted
        "restock",  // may have triggered a restock queue entry
        "activityLog",
        "analytics",
      ],
    }),

    // Get all orders with filtering and pagination
    getAllOrders: builder.query({
      query: (queryData?: Record<string, unknown>) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/orders${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),

    // Get single order details (includes timeline + items)
    getOrderDetails: builder.query({
      query: (orderId: string) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "order", id: arg },
        "order",
      ],
    }),

    // Update order status (PENDING → CONFIRMED → SHIPPED → DELIVERED)
    updateOrderStatus: builder.mutation({
      query: ({
        orderId,
        statusData,
      }: {
        orderId: string;
        statusData: { status: string };
      }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "order", id: arg.orderId },
        "order",
        "activityLog",
        "analytics",
      ],
    }),

    // Cancel order — restores product stock and syncs restock queue
    cancelOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "order", id: arg },
        "order",
        "product",    // stock restored
        "restock",    // restock queue may have been updated
        "activityLog",
        "analytics",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi;
