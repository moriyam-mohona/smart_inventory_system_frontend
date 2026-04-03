import { baseApi } from "@/redux/api/baseApi";
import { createQueryParams } from "@/utils/paramsFuntion";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Auth flow (pre-login, no token needed) ───────────────────────────────

    signup: builder.mutation({
      query: (userInfo: { name: string; email: string; password: string }) => ({
        url: "/auth/signup",
        method: "POST",
        body: userInfo,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),

    login: builder.mutation({
      query: (userInfo: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),

    demoLogin: builder.mutation({
      query: () => ({
        url: "/auth/demo-login",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (payload: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),

    verifyForgotPasswordOtp: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation({
      query: (payload: {
        email: string;
        resetToken: string;
        newPassword: string;
      }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),

    refreshToken: builder.mutation({
      query: (refreshToken: string) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    // ─── Authenticated user endpoints ─────────────────────────────────────────

    // GET /auth/me — get current logged-in user's profile
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // ─── Admin: User management ───────────────────────────────────────────────

    // GET /auth — list all users (ADMIN)
    getAllUsers: builder.query({
      query: (queryData?: Record<string, unknown>) => {
        const queryParams = createQueryParams(queryData);
        return {
          url: `/auth${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["user"],
    }),

    // POST /auth/approve/:userId — approve a pending manager (ADMIN)
    approveUser: builder.mutation({
      query: (userId: string) => ({
        url: `/auth/approve/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),

    // PATCH /auth/:userId/restrict — toggle restrict/unrestrict a user (ADMIN)
    restrictUser: builder.mutation({
      query: (userId: string) => ({
        url: `/auth/${userId}/restrict`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),

    // DELETE /auth/:userId — soft-delete a user (ADMIN)
    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/auth/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),

    // POST /auth/manager — admin creates an already-approved manager account
    createManager: builder.mutation({
      query: (payload: {
        name: string;
        email: string;
        password: string;
      }) => ({
        url: "/auth/manager",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),

    // GET /auth/manager/:managerId/details — full manager profile (ADMIN)
    getManagerDetails: builder.query({
      query: (managerId: string) => ({
        url: `/auth/manager/${managerId}/details`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "user", id: arg },
        "user",
      ],
    }),

    // POST /auth/create-account — manager creates a sub-account (MANAGER)
    createAccount: builder.mutation({
      query: (payload: {
        name: string;
        email: string;
        password: string;
      }) => ({
        url: "/auth/create-account",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useDemoLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetAllUsersQuery,
  useApproveUserMutation,
  useRestrictUserMutation,
  useDeleteUserMutation,
  useCreateManagerMutation,
  useGetManagerDetailsQuery,
  useLazyGetManagerDetailsQuery,
  useCreateAccountMutation,
} = authApi;
