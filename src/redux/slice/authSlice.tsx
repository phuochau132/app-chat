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
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        `${Constants.manifest.extra.HOST_SERVER}/api/auth/login`,
        {
          userName: email,
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
  async ({ user, file }: any) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", {
        uri: file,
        name: Math.random().toString(36).substring(7) + ".jpg",
        type: "image/jpeg",
      });
    }
    formData.append("user", JSON.stringify(user));
    try {
      const response = await axios.post(
        `${Constants.manifest.extra.HOST_SERVER}/api/users/profile`,
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
        console.log(action.payload.data);
        if (action.payload.data.type) {
          state.user = action.payload.data.user;
        }
        Toast.show("Change Profile Successfully", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });

        state.error = null;
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
        console.log(91823);
        console.log(action.payload);
        if (action.payload.type) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(getInfoUserFToken.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
      });
  },
});
export const { logout } = profileSlice.actions;
export default profileSlice.reducer;
