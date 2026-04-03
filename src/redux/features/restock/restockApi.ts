import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const restockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get restock queue with filtering and pagination
    getRestockQueue: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/restock-queue${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["restock"],
    }),

    // Restock an item
    restockItem: builder.mutation({
      query: ({ id, restockQuantity, note }) => ({
        url: `/restock-queue/${id}/restock`,
        method: "PATCH",
        body: { restockQuantity, note },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "restock", id: arg.id },
        "restock",
        "product", // Restocking updates the product count globally
        "activityLog",
      ],
    }),
  }),
});

export const { useGetRestockQueueQuery, useRestockItemMutation } = restockApi;
