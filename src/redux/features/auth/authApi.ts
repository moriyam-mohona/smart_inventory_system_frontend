import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/signup",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/signin",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/forget-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/reset-password",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user/me",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    otp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    getMe: builder.query({
      query: ({ accessToken }: { accessToken?: string }) => {
        if (accessToken) {
          return {
            url: "/auth/me",
            method: "GET",
            headers: {
              Authorization: `${accessToken}`,
            },
            credentials: "include",
          };
        }
        return {
          url: "/auth/me",
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/change-password",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateCustomer: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/customer/update-profile",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    getAllUsers: builder.query({
      query: (queryData) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/auth/all-users${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
    getSingleUserDetails: builder.query({
      query: (userId) => {
        return {
          url: `/auth/user/${userId}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useChangePasswordMutation,
  useUpdateCustomerMutation,
  useGetAllUsersQuery,
  useGetSingleUserDetailsQuery,
} = authApi;
