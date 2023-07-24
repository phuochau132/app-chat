import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { HOST_SERVER } from "@env";
import axiosInstance from "../../config/axiosConfig";
import { ToastAndroid } from "react-native";

//"accountNonExpired": true, "accountNonLocked": true, "authorities": [{"authority": "[]"}], "credentialsNonExpired": true, "email": "hau", "enabled": true, "full_name": "nguyenhau", "id": 1, "name": "hau", "roles": [], "username": "hau"}
interface User {
  accountNonExpired: boolean;
}
const initialState = {
  user: null,
  error: null,
  status: "",
  linkTo: "/",
};
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log(123);
      console;
      console.log(123);
      console.log(123);
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/v1/auth/login`,
        {
          email: email,
          password: password,
        }
      );
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
export const changeAvatar = createAsyncThunk(
  "auth/changeAvatar",
  async (formData: any) => {
    const response = await axiosInstance.post(
      `/account/profile/changeAvatar`,
      formData
    );
    let data = response.data;
    return data;
  }
);

export const changeInfo = createAsyncThunk(
  "auth/changeInfo",
  async ({
    id,
    fullName,
    phone,
    address,
  }: {
    id: Number;
    fullName: String;
    phone: String;
    address: String;
  }) => {
    const response = await axiosInstance.post(
      `http://localhost:3006/account/profile/changeInfoAccount`,
      { id, fullName, phone, address }
    );
    let data = response.data;
    return data;
  }
);
export const getInfoUser = createAsyncThunk(
  "auth/changeInfo",
  async ({ id }: { id: Number }) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3006/account/getAllUser`,
        {
          params: {
            id,
          },
        }
      );
      const data = response.data;
      const user = data.filter((item: any) => item.id === id);
      return user;
    } catch (error) {
      throw new Error("Failed to fetch user information.");
    }
  }
);
const profileSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logout: async (state: any, action: any) => {
    //   state.user = null;
    //   state.status = "logout";
    //   // localStorage.setItem("user", null);
    //   // localStorage.setItem("accessToken", null);
    //   await AsyncStorage.setItem("key", "value");
    // },
    setLinkTo: (state: any, action: any) => {
      state.linkTo = action.payload;
    },
    // setError: (state: any, action: any) => {
    //   state.error = action.payload;
    // },
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
        ToastAndroid.show("Login success!", ToastAndroid.SHORT);
      })
      .addCase(login.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
      });
    // .addCase(changeAvatar.pending, (state: any, action: any) => {
    //   state.status = "loading";
    //   state.status = "";
    //   state.error = "";
    // })
    // .addCase(changeAvatar.fulfilled, (state: any, action: any) => {
    //   state.status = "changeAvatarSucceeded";
    //   state.user.avatar = action.payload.pathAvatar;
    //   // localStorage.setItem(
    //   //   "user",
    //   //   JSON.stringify({
    //   //     ...state.user,
    //   //     avatar: action.payload.pathAvatar,
    //   //   })
    //   // );
    //   state.error = null;
    // })
    // .addCase(changeAvatar.rejected, (state: any, action: any) => {
    //   state.status = "changeAvatarFailed";
    //   state.user = null;
    //   state.error = action.error.message;
    // })
    // .addCase(changeInfo.pending, (state: any) => {
    //   state.status = "loading";
    //   state.status = "";
    //   state.error = "";
    // })
    // .addCase(changeInfo.fulfilled, (state: any, action: any) => {
    //   state.status = "changeInfoSucceeded";
    //   state.user = {
    //     ...state.user,
    //     ...action.payload.user,
    //   };
    //   AsyncStorage.setItem("key", "value");
    //   // localStorage.setItem(
    //   //   "user",
    //   //   JSON.stringify({
    //   //     ...state.user,
    //   //     ...action.payload.user,
    //   //   })
    //   // );
    //   state.error = null;
    // })
    // .addCase(changeInfo.rejected, (state: any, action: any) => {
    //   state.status = "changeInfoFailed";
    //   state.user = null;
    //   state.error = action.error.message;
    // });
  },
});

// export const { logout, setLinkTo, setError } = profileSlice.actions;
const saveAccessTokenToAsyncStorage = async (accessToken: string) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
  } catch (error) {
    console.error("Error saving accessToken to AsyncStorage:", error);
  }
};

export default profileSlice.reducer;
