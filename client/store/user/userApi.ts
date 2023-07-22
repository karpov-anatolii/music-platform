import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

export const userApi = createApi({
  reducerPath: "api/user",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),

  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["User"],
  endpoints: (build) => ({
    auth: build.query({
      query: () => ({
        url: `/user/auth`,
      }),
    }),
    registration: build.mutation({
      query: (body) => ({
        url: `/user/registration`,
        method: "POST",
        body,
      }),
    }),
    login: build.mutation({
      query: (body) => ({
        url: `/user/login`,
        method: "POST",
        body,
      }),
    }),
    logout: build.query({
      query: () => ({
        url: `/user/logout`,
      }),
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),
    uploadAvatar: build.mutation({
      query: (body) => ({
        url: `/user/avatar`,
        method: "POST",
        body,
      }),
    }),
    deleteAvatar: build.mutation({
      query: (body) => {
        // console.log("MUTATION body=", body);
        return {
          url: `/user/avatar`,
          method: "DELETE",
          body,
        };
      },
    }),
  }),
});

export const {
  useAuthQuery,
  useRegistrationMutation,
  useLoginMutation,
  useLogoutQuery,
  useDeleteUserMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  util: { getRunningQueriesThunk },
} = userApi;

// export endpoints for use in SSR,
export const {
  auth,
  registration,
  login,
  logout,
  deleteUser,
  uploadAvatar,
  deleteAvatar,
} = userApi.endpoints;
