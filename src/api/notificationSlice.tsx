import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from "react-native-simple-toast";

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
export { sendPushNotification };
