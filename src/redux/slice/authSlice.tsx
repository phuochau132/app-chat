import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import Constants from "expo-constants";
import axiosInstance from "../../config/axiosConfig";

//"accountNonExpired": true, "accountNonLocked": true, "authorities": [{"authority": "[]"}], "credentialsNonExpired": true, "email": "hau", "enabled": true, "full_name": "nguyenhau", "id": 1, "name": "hau", "roles": [], "username": "hau"}

const initialState = {
  user: null,
  error: null,
  status: "",
  linkTo: "/",
};

const baseUrl = Constants.manifest?.extra?.HOST_SERVER;
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        userName: email,
        password: password,
      });
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async ({ email }: { email: string }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/forgot-password`, {
        email: email,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
interface ChangeInfo {
  user: {
    id: number;
    name: string;
    nickName: string;
    story: String;
    birthDay: string;
    avatar: string;
  };
  file: any;
}
export const changeInfo = createAsyncThunk(
  "auth/changeInfo",
  async ({ user }: any) => {
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      let data = response.data;

      return {
        data: {
          type: 1,
          user: data,
        },
      };
    } catch (error) {
      return {
        data: {
          type: 0,
        },
      };
    }
  }
);

export const getInfoUserFToken = createAsyncThunk(
  "auth/getInfoUserFToken",
  async (accessToken: string) => {
    try {
      const response = await axiosInstance.post(`api/users`, {
        token: accessToken,
      });
      const data = response.data;
      return {
        type: 1,
        user: data,
      };
    } catch (error) {
      throw new Error("Failed to fetch user information.");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({
    userName,
    password,
    fullName,
    email,
  }: {
    email: string;
    password: string;
    fullName: string;
    userName: string;
  }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/auth/register`, {
        userName: userName,
        password: password,
        fullName: fullName,
        email: email,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: any) => {
      state.status = "logout";
      state.user = null;
    },
    setLinkTo: (state: any, action: any) => {
      state.linkTo = action.payload;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(login.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        registerForPushNotificationsAsync().then(async (token: any) => {
          const formData = new FormData();
          formData.append(
            "user",
            JSON.stringify({
              ...action.payload.user,
              expoPushToken: token,
            })
          );
          try {
            const response = await axios.post(
              `${Constants.manifest?.extra?.HOST_SERVER}/api/users/profile`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (error) {}
        });

        Toast.show("Login Successfully", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(login.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
        state.error = action.error.message;
      })
      .addCase(changeInfo.pending, (state: any) => {
        state.status = "loading";
        state.status = "";
        state.error = "";
      })
      .addCase(changeInfo.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (action.payload.data.type) {
          state.user = action.payload.data.user;
        }
        Toast.show("Change Profile Successfully", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });

        state.error = null;
      })
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
      })
      .addCase(changeInfo.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(getInfoUserFToken.pending, (state: any) => {
        state.status = "loading";
        state.status = "";
        state.error = "";
      })
      .addCase(getInfoUserFToken.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (action.payload.type) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(getInfoUserFToken.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(forgotPassword.pending, (state: any) => {
        state.status = "loading";
        state.status = "";
        state.error = "";
      })
      .addCase(forgotPassword.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        Toast.show(
          "Vui lòng kiểm tra email để thay đổi password!",
          Toast.LONG,
          {
            backgroundColor: "white",
            textColor: "black",
          }
        );
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state: any, action: any) => {
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
export const { logout } = profileSlice.actions;
export default profileSlice.reducer;
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "d70f4566-cd44-4b07-9053-61d3d60d8732",
      })
    ).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}
