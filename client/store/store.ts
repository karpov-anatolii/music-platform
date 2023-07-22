import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { albumReducer } from "./album/album.slice";
import { albumApi } from "./album/albumApi";
import { playerReducer } from "./player/player.slice";
import { trackApi } from "./track/tracksApi";
import { userReducer } from "./user/user.slice";
import { userApi } from "./user/userApi";

const rootReducer = combineReducers({
  [trackApi.reducerPath]: trackApi.reducer,
  [albumApi.reducerPath]: albumApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  player: playerReducer,
  album: albumReducer,
  user: userReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        trackApi.middleware,
        albumApi.middleware,
        userApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type TypeRootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
