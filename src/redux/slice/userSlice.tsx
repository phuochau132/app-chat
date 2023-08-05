import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";
const initialState = {
  listUser: [],
  profileChosen: null,
  listFiltered: [],
  listRequestAddFriend: [],
  userBeInformed: null,
  error: null,
  status: "",
  linkTo: "/",
};
export const loadAllUser: any = createAsyncThunk("user/loadUser", async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.HOST_SERVER}/api/users`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
});
export const addFriend: any = createAsyncThunk(
  "user/addFriend",
  async ({ userSend, userReceive }: { userSend: any; userReceive: any }) => {
    console.log();
    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/users/friend`,
        { userSend, userReceive }
      );
      const user = response.data;
      const response1 = await axios.post(
        `https://exp.host/--/api/v2/push/send`,
        JSON.stringify({
          to: user.expoPushToken,
          sound: "default",
          title: "You've got mail! 📬",
          body: "Here is the notification body",
          data: { data: "goes here" },
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return { type: 1 };
    } catch (error) {
      console.log(error);
      return { type: 0 };
    }
  }
);

export const getAllFriend: any = createAsyncThunk(
  "user/getAllFriend",
  async (id: number) => {
    console.log();
    try {
      const response = await axios.get(
        `${process.env.HOST_SERVER}/api/users/friend/${id}`
      );

      return {
        type: 1,
        listRequestAddFriend: response.data,
      };
    } catch (error) {
      console.log(error);
      return {
        type: 0,
      };
    }
  }
);
export const acceptRequestAF: any = createAsyncThunk(
  "user/acceptRequestAF",
  async (id: number) => {
    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/users/friend/accept`,
        {
          id,
        }
      );
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return {
        type: 0,
      };
    }
  }
);
export const delRequestAF: any = createAsyncThunk(
  "user/delRequestAF",
  async (id: number) => {
    console.log();
    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/users/friend/delete`,
        {
          id,
        }
      );

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
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    changeProfileChosen: (state: any, action: any) => {
      state.profileChosen = action.payload.user;
      state.status = "change profile chosen";
    },
    filter: (state: any, action: any) => {
      state.listFiltered = action.payload;
      state.status = "filter";
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(loadAllUser.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadAllUser.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.listUser = action.payload;
        state.error = null;
      })
      .addCase(loadAllUser.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(addFriend.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        if (action.payload.type) {
          Toast.show("Thêm bạn thành công", Toast.LONG, {
            backgroundColor: "white",
            textColor: "black",
          });
        } else {
          Toast.show("Thêm bạn không thành công", Toast.LONG, {
            backgroundColor: "white",
            textColor: "black",
          });
        }
      })
      .addCase(addFriend.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(getAllFriend.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllFriend.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (action.payload.type) {
          state.listRequestAddFriend = action.payload.listRequestAddFriend;
        }
        state.error = null;
      })
      .addCase(getAllFriend.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(acceptRequestAF.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(acceptRequestAF.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.listRequestAddFriend = state.listRequestAddFriend.filter(
          (item: any) => {
            return item.id != action.payload.data.id;
          }
        );
        Toast.show("Đã trở thành bạn bè", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(acceptRequestAF.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(delRequestAF.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(delRequestAF.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.listRequestAddFriend = state.listRequestAddFriend.filter(
          (item: any) => {
            return item.id != action.payload.data.id;
          }
        );
        Toast.show("Đã xóa yêu cầu kết bạn", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(delRequestAF.rejected, (state: any, action: any) => {
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

export const { filter, changeProfileChosen } = userSlice.actions;

export default userSlice.reducer;
