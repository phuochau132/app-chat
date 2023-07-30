import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { HOST_SERVER } from "@env";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";

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
    console.log();

    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/auth/login`,
        {
          userName: email,
          password: password,
        }
      );
      const hau = await AsyncStorage.getItem("accessToken");
      console.log(hau);
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
    console.log();
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
        `${process.env.HOST_SERVER}/api/users/profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      let data = response.data;
      return {
        user: data,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const getInfoUser = createAsyncThunk(
  "auth/changeInfo",
  async ({ id }: { id: Number }) => {
    console.log();
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
    logout: (state: any, action: any) => {
      state.user = null;
      state.status = "logout";
      DelAccessTokenToAsyncStorage();
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
        state.status = "changeInfoSucceeded";
        state.user = action.payload.user;
        Toast.show("Change Profile Successfully", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });

        state.error = null;
      })
      .addCase(changeInfo.rejected, (state: any, action: any) => {
        state.status = "changeInfoFailed";
        state.user = null;
        state.error = action.error.message;
      });
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
const DelAccessTokenToAsyncStorage = async () => {
  try {
    await AsyncStorage.setItem("accessToken", "");
  } catch (error) {
    console.error("Error saving accessToken to AsyncStorage:", error);
  }
};

export default profileSlice.reducer;
