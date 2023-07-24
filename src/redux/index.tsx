import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slice/authSlice";
import registerSlice from "./slice/registerSlice";
import userSlice from "./slice/userSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    register: registerSlice,
    user: userSlice,
  },
});
