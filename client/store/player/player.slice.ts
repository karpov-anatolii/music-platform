import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITrack } from "../track/track.types";
import { PlayerState } from "./player.types";

const initialState: PlayerState = {
  currentTime: 0,
  duration: 100,
  active: null,
  volume: 50,
  pause: true,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPause: (state) => {
      state.pause = true;
    },
    setPlay: (state) => {
      state.pause = false;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setActive: (state, action: PayloadAction<null | ITrack>) => {
      state.active = action.payload;
      state.duration = 0;
      state.currentTime = 0;
    },
  },
});

export const playerReducer = playerSlice.reducer;
export const playerActions = playerSlice.actions;
