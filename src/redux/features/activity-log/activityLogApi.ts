import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all activity logs with filtering and pagination
    getActivityLogs: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/activity-logs${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["activityLog"],
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogApi;
