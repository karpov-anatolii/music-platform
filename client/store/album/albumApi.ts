import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { IAlbum } from "./album.types";

export const albumApi = createApi({
  reducerPath: "api/albums",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    // prepareHeaders: (headers, { getState }) => {
    //   const token = localStorage.getItem("token");
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Albums"],
  endpoints: (build) => ({
    getAlbums: build.query<
      { albums: IAlbum[]; docCount: number },
      { limit: number; offset: number; userId: any }
    >({
      query: ({ limit = 5, offset = 0, userId }) =>
        `albums?count=${limit}&offset=${offset}&userId=${userId}`,
      // providesTags: ["Albums"],
    }),
    addAlbum: build.mutation({
      query: (body) => ({
        url: `/albums`,
        method: "POST",
        body,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      // invalidatesTags: ["Albums"],
    }),
    deleteAlbum: build.mutation({
      query: (id) => ({
        url: `/albums/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      // invalidatesTags: ["Albums"],
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useAddAlbumMutation,
  useDeleteAlbumMutation,
  util: { getRunningQueriesThunk },
} = albumApi;

// export endpoints for use in SSR,
export const { getAlbums, addAlbum, deleteAlbum } = albumApi.endpoints;
