import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filtering and pagination
    getAllProducts: builder.query({
      query: (queryData?: Record<string, unknown>) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/products${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    // Get product details by ID
    getProductDetails: builder.query({
      query: (productId: string) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "product", id: arg },
        "product",
      ],
    }),

    // Create a product (ADMIN, MANAGER)
    createProduct: builder.mutation({
      query: (productData: {
        name: string;
        categoryId: string;
        price: number;
        stockQuantity: number;
        minStockThreshold: number;
        sku?: string;
      }) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["product", "restock", "analytics", "activityLog"],
    }),

    // Update product (ADMIN, MANAGER)
    updateProduct: builder.mutation({
      query: ({
        productId,
        data,
      }: {
        productId: string;
        data: Record<string, unknown>;
      }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "product", id: arg.productId },
        "product",
        "restock",
        "analytics",
        "activityLog",
      ],
    }),

    // Restock a product directly (ADMIN, MANAGER) — adds to existing stock
    restockProduct: builder.mutation({
      query: ({
        productId,
        data,
      }: {
        productId: string;
        data: { restockQuantity: number; note?: string };
      }) => ({
        url: `/products/${productId}/restock`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "product", id: arg.productId },
        "product",
        "restock",
        "analytics",
        "activityLog",
      ],
    }),

    // Deactivate a product (ADMIN, MANAGER)
    deactivateProduct: builder.mutation({
      query: (productId: string) => ({
        url: `/products/${productId}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "product", id: arg },
        "product",
        "restock",
        "analytics",
        "activityLog",
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useRestockProductMutation,
  useDeactivateProductMutation,
} = productApi;
