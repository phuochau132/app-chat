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
  friends: [],
  statusUser: [],
  error: null,
  status: "",
  linkTo: "/",
};

export const loadAllUser: any = createAsyncThunk("user/loadUser", async () => {
  try {
    const response = await axiosInstance.get(`api/users`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
});
interface AddFriendData {
  senderId: number;
  receiverId: number;
}
export const addFriend = createAsyncThunk(
  "user/addFriend",
  async (data: AddFriendData) => {
    try {
      const response = await axiosInstance.post(`api/friends`, data);
      const user = response.data.user;
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
      return { type: 1, data: response.data };
    } catch (error) {
      console.log(error);
      return { type: 0 };
    }
  }
);

export const getRequestAddFriend: any = createAsyncThunk(
  "user/getAllFriend",
  async (id: number) => {
    try {
      const response = await axiosInstance.get(
        `api/friends/getRequestAddFriend/${id}`
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
      const response = await axiosInstance.post(`api/friends/accept`, {
        id,
      });
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
    console.log(id);

    try {
      const response = await axiosInstance.post(`api/friends/delete`, {
        id,
      });

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
export const getFriends: any = createAsyncThunk(
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
interface Message {
  senderId: number;
  receiverId: number;
  roomId: number;
  text: string;
}
interface Notification {
  to: string;
  sound: string;
  title: string;
  body: string;
}
const sendNotification = async (data: Notification) => {
  const response1 = await axios.post(
    `https://exp.host/--/api/v2/push/send`,
    JSON.stringify({
      to: data.to,
      sound: "default",
      title: data.title,
      body: data.body,
      data: { data: "goes here" },
    }),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return response1.data;
};
export const sendMessage: any = createAsyncThunk(
  "user/sendMessage",
  async ({
    data,
    notificationData,
  }: {
    data: Message;
    notificationData: Notification;
  }) => {
    try {
      const response = await axiosInstance.post(`api/messages`, data);
      await sendNotification(notificationData);
      console.log(response.data);
      return {
        type: 1,
        data: {
          ...response.data,
        },
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
    addMessage: (state: any, action: any) => {
      const { roomId, message } = action.payload;
      for (let index = 0; index < state.friends.length; index++) {
        const friendShip = state.friends[index];
        if (friendShip.room.id === roomId) {
          friendShip.room.message = [...friendShip.room.message, message];
          break;
        }
      }
    },
    filter: (state: any, action: any) => {
      state.listFiltered = action.payload;
      state.status = "filter";
    },
    setActiveUser: (state: any, action: any) => {
      state.statusUser = action.payload;
      state.status = "status user";
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
        state.friends = [...state.friends, action.payload.data];
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
      .addCase(getRequestAddFriend.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRequestAddFriend.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        if (action.payload.type) {
          state.listRequestAddFriend = action.payload.listRequestAddFriend;
        }
        state.error = null;
      })
      .addCase(getRequestAddFriend.rejected, (state: any, action: any) => {
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
        state.friends = state.friends.filter((item: any) => {
          return item.id != action.payload.data.id;
        });
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
      })
      // 123
      .addCase(getFriends.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getFriends.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.friends = action.payload.data;
      })
      .addCase(getFriends.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      ///123
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
      });
  },
});

export const { filter, changeProfileChosen, setActiveUser, addMessage } =
  userSlice.actions;

export default userSlice.reducer;
