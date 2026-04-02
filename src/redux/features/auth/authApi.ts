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
          url: "/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    demoLogin: builder.mutation({
      query: () => {
        return {
          url: "/auth/demo-login",
          method: "POST",
        };
      },
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    verifyForgotPasswordOtp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/verify-forgot-password-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => {
        return {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        };
      },
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
              Authorization: `Bearer ${accessToken}`,
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
          url: `/auth${queryParams}`,
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
    createAccount: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/create-account",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    approveUser: builder.mutation({
      query: (userId) => {
        return {
          url: `/auth/approve/${userId}`,
          method: "POST",
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useOtpMutation,
  useLoginMutation,
  useDemoLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useUpdateUserMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useChangePasswordMutation,
  useUpdateCustomerMutation,
  useGetAllUsersQuery,
  useGetSingleUserDetailsQuery,
  useCreateAccountMutation,
  useApproveUserMutation,
} = authApi;
