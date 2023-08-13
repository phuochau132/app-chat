import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";
import Constants from "expo-constants";
const initialState = {
  room: [],
  error: null,
  status: "",
  linkTo: "/",
};
interface Message {
  senderId: number;
  receiverId: number;
  roomId: number;
  text: string;
}

export const getRoom: any = createAsyncThunk(
  "rooms",
  async (idRoom: number) => {
    try {
      const response = await axiosInstance.get(`api/rooms/${idRoom}`);
      console.log(response.data);
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      return {
        type: 0,
      };
    }
  }
);

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder

      .addCase(getRoom.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRoom.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.room = action.payload.data;
      })
      .addCase(getRoom.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      });
  },
});
export default roomSlice.reducer;
