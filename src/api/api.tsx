import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from "react-native-simple-toast";
import axiosInstance from "../config/axiosConfig";

interface Notification {
  to: string;
  sound: string;
  title: string;
  body: string;
  data: Object;
}
const sendPushNotification = createAsyncThunk(
  "pushNotification",
  async (data: Notification) => {
    try {
      const response1 = await axios.post(
        `https://exp.host/--/api/v2/push/send`,
        JSON.stringify({
          to: data.to,
          sound: data.to ? data.to : "default",
          title: data.title ? data.title : "Notification",
          body: data.body,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      return response1.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
const getFriends: any = createAsyncThunk(
  "user/getFriends",
  async (idUser: number) => {
    try {
      const response = await axiosInstance.get(
        `api/friends/getFriends/${idUser}`
      );
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
const getPostsByUser: any = async (id: number) => {
  try {
    const response = await axiosInstance.get(`api/posts/user/${id}`);
    return {
      type: 1,
      data: response.data,
    };
  } catch (error) {
    throw error;
  }
};

export { sendPushNotification, getFriends, getPostsByUser };
