import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slice/authSlice";
import registerSlice from "./slice/registerSlice";
import userSlice from "./slice/userSlice";
import postSlice from "./slice/postSlice";
import roomSlice from "./slice/roomSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    register: registerSlice,
    user: userSlice,
    post: postSlice,
    room: roomSlice,
  },
});
