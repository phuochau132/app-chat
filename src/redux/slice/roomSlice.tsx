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
export const sendMessage: any = createAsyncThunk(
  "room/message",
  async (data: Message) => {
    console.log(1239123);
    console.log(data);

    try {
      const response = await axiosInstance.post(`api/messages`, data);
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
      .addCase(sendMessage.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
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
