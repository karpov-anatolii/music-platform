import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITrack } from "./track.types";

const initialState: ITrack[] = [];

export const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {},
});

export const trackReducer = trackSlice.reducer;
export const trackActions = trackSlice.actions;
