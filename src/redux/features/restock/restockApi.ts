import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const restockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get restock queue (OPEN items needing attention)
    getRestockQueue: builder.query({
      query: (queryData?: Record<string, unknown>) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/restock-queue${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["restock"],
    }),

    // Restock from queue — adds stock to the product directly
    restockItem: builder.mutation({
      query: ({
        id,
        restockQuantity,
        note,
      }: {
        id: string;
        restockQuantity: number;
        note?: string;
      }) => ({
        url: `/restock-queue/${id}/restock`,
        method: "PATCH",
        body: { restockQuantity, note },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "restock", id: arg.id },
        "restock",
        "product",     // stock was updated
        "activityLog", // activity was logged
        "analytics",   // stock metrics changed
      ],
    }),

    // Resolve a restock queue item without restocking (mark as handled)
    resolveRestockItem: builder.mutation({
      query: (id: string) => ({
        url: `/restock-queue/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "restock", id: arg },
        "restock",
        "activityLog",
        "analytics",
      ],
    }),
  }),
});

export const {
  useGetRestockQueueQuery,
  useRestockItemMutation,
  useResolveRestockItemMutation,
} = restockApi;
