import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { IAlbum } from "../album/album.types";
import { IUser } from "../user/user.types";
import { ITrack } from "./track.types";

export const trackApi = createApi({
  reducerPath: "api/track",
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
  tagTypes: ["Tracks"],
  endpoints: (build) => ({
    getTracks: build.query<
      { tracks: ITrack[]; album: IAlbum; author: IUser; docCount: number },
      { limit: number; offset: number; activeAlbumId: string | string[] }
    >({
      query: ({ limit = 5, offset = 0, activeAlbumId }) =>
        `tracks?count=${limit}&offset=${offset}&albumId=${activeAlbumId}`,
      providesTags: ["Tracks"],
    }),
    searchTrack: build.query<
      { tracks: ITrack[]; album: IAlbum; author: IUser; docCount: number },
      {
        limit: number;
        offset: number;
        activeAlbumId: string | string[];
        query: string;
      }
    >({
      query: ({ limit = 5, offset = 0, activeAlbumId, query }) =>
        `tracks/search?count=${limit}&offset=${offset}&albumId=${activeAlbumId}&query=${query}`,

      // providesTags: ["Tracks"],
    }),
    searchTracks: build.query<
      ITrack[],
      {
        limit: number;
        offset: number;
        query: string;
      }
    >({
      query: ({ limit = 5, offset = 0, query }) =>
        `tracks/search-all?count=${limit}&offset=${offset}&query=${query}`,
    }),
    addTrack: build.mutation({
      query: (body) => ({
        url: `/tracks`,
        method: "POST",
        body,
        // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      invalidatesTags: ["Tracks"],
    }),
    listenTrack: build.mutation<ITrack, string>({
      query: (id) => ({
        url: `/tracks/listen/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Tracks"],
    }),
    deleteTrack: build.mutation({
      query: (id) => ({
        url: `/tracks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tracks"],
    }),
    downloadTrack: build.mutation({
      query: (id) => ({
        url: `/tracks/download/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetTracksQuery,
  useSearchTrackQuery,
  useSearchTracksQuery,
  useAddTrackMutation,
  useListenTrackMutation,
  useDeleteTrackMutation,
  useDownloadTrackMutation,
  util: { getRunningQueriesThunk },
} = trackApi;

// export endpoints for use in SSR,
export const {
  getTracks,
  searchTrack,
  searchTracks,
  addTrack,
  listenTrack,
  deleteTrack,
  downloadTrack,
} = trackApi.endpoints;
