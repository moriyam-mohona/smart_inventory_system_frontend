import { baseApi } from "@/redux/api/baseApi";

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: (period: 'today' | 'week' | 'month' | 'year' = 'month') => ({
        url: `/analytics/admin/dashboard?period=${period}`,
        method: "GET",
      }),
      providesTags: ["analytics", "order", "product", "activityLog", "restock"],
    }),
    getManagerDashboard: builder.query({
      query: () => ({
        url: `/analytics/manager/dashboard`,
        method: "GET",
      }),
      providesTags: ["analytics", "order", "product", "activityLog", "restock"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetManagerDashboardQuery,
} = analyticsApi;
