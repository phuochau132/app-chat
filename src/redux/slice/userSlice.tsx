import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  listUser: [],
  listFiltered: [],
  error: null,
  status: "",
  linkTo: "/",
};
export const loadAllUser: any = createAsyncThunk("auth/loadUser", async () => {
  try {
    const response = await axios.get(`${process.env.HOST_SERVER}/api/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    filter: (state: any, action: any) => {
      state.listFiltered = action.payload;
      state.status = "filter";
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(loadAllUser.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAllUser.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.listUser = action.payload;
        state.error = null;
      })
      .addCase(loadAllUser.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
      });
  },
});

export const { filter } = userSlice.actions;

export default userSlice.reducer;
