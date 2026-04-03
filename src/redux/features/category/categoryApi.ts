import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories (supports ?includeBanned=true for ADMIN)
    getAllCategories: builder.query({
      query: (queryData?: Record<string, unknown>) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/categories${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["category"],
    }),

    // Get single category details
    getCategoryDetails: builder.query({
      query: (categoryId: string) => ({
        url: `/categories/${categoryId}/details`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "category", id: arg },
        "category",
      ],
    }),

    // Create a new category (MANAGER)
    createCategory: builder.mutation({
      query: (categoryData: { name: string }) => ({
        url: "/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["category"],
    }),

    // Update category name (ADMIN, MANAGER)
    updateCategory: builder.mutation({
      query: ({
        categoryId,
        data,
      }: {
        categoryId: string;
        data: { name: string };
      }) => ({
        url: `/categories/${categoryId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "category", id: arg.categoryId },
        "category",
      ],
    }),

    // Ban a category (ADMIN only) — marks isActive: false
    banCategory: builder.mutation({
      query: (categoryId: string) => ({
        url: `/categories/${categoryId}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "category", id: arg },
        "category",
        "product", // products in a banned category become effectively inactive
        "analytics",
      ],
    }),

    // Delete a category (MANAGER only)
    deleteCategory: builder.mutation({
      query: (categoryId: string) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category", "product"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryDetailsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useBanCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
