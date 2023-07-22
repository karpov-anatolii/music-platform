import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./user.types";

export interface UserState {
  user: null | IUser;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
