import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

const initialState = {
  error: null,
  status: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log(process.env.HOST_SERVER);
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/register`, // Change axios.get to axios.post
        {
          email: email,
          password: password,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setError: (state: any, action: any) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state: any) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state: any, action: any) => {
        console.log(123);
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setError } = registerSlice.actions;

export default registerSlice.reducer;
