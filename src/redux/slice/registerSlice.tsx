import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from "react-native-simple-toast";

const initialState = {
  error: null,
  status: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log();
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/auth/register`,
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
        state.status = "succeeded";
        Toast.show("Register Successfully", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(register.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      });
  },
});

export const { setError } = registerSlice.actions;

export default registerSlice.reducer;
