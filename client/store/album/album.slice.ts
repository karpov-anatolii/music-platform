import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlbum } from "./album.types";

export interface AlbumState {
  activeAlbum: null | IAlbum;
  albums: IAlbum[];
}

const initialState: AlbumState = {
  activeAlbum: null,
  albums: [],
};

export const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    setActiveAlbum: (state, action: PayloadAction<IAlbum>) => {
      state.activeAlbum = action.payload;
    },
    setAlbums: (state, action: PayloadAction<IAlbum[]>) => {
      state.albums = action.payload;
    },
  },
});

export const albumReducer = albumSlice.reducer;
export const albumActions = albumSlice.actions;
