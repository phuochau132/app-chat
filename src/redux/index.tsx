import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slice/authSlice";
import userSlice from "./slice/userSlice";
import postSlice from "./slice/postSlice";
import roomSlice from "./slice/roomSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    post: postSlice,
    room: roomSlice,
  },
});
export type AppDispatch = typeof store.dispatch;
