import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filtering and pagination
    getAllProducts: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/products${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    // Get product details
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "product", id: arg }, "product"],
    }),

    // Create a product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["product"],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "product", id: arg.productId },
        "product",
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productApi;
