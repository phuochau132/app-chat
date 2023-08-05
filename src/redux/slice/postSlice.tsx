import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";
import axios from "axios";
const initialState = {
  posts: [],
  error: null,
  status: "",
};
interface Post {
  idUser: number;
  text: string;
  files: any;
  statusPost: any;
}
export const addPost: any = createAsyncThunk("addPost", async (data: Post) => {
  try {
    const formData = new FormData();
    formData.append("text", data.text);
    formData.append("idUser", data.idUser);
    formData.append("status", data.statusPost.index);
    data.files.forEach((file: any) => {
      formData.append("files", {
        uri: file,
        name: Math.random().toString(36).substring(7) + ".jpg",
        type: "image/jpeg",
      });
    });
    const response = await axiosInstance.post(
      `${process.env.HOST_SERVER}/api/posts`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return {
      type: 1,
      data: response.data,
    };
  } catch (error) {
    throw error;
  }
});
interface PostLikes {
  idPost: number;
  idUser: number;
}
export const likePost: any = createAsyncThunk(
  "likePost",
  async (data: PostLikes) => {
    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/posts/like`,
        {
          ...data,
        }
      );
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const dislikePost: any = createAsyncThunk(
  "dislikePost",
  async (data: PostLikes) => {
    try {
      const response = await axios.post(
        `${process.env.HOST_SERVER}/api/posts/dislike`,
        {
          ...data,
        }
      );
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(addPost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        if (action.payload.type) {
          state.posts = [...state.posts, action.payload.data];
        }
        Toast.show("Thêm bài viết thành công", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(addPost.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(likePost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        console.log(action.payload.data);
        if (action.payload.type) {
          for (let index = 0; index < state.posts.length; index++) {
            const post = state.posts[index];
            if (post.id === action.payload.data.id) {
              state.posts[index] = action.payload.data;
              break;
            }
          }
        }
      })
      .addCase(likePost.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(dislikePost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(dislikePost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        console.log(action.payload.data);
        if (action.payload.type) {
          for (let index = 0; index < state.posts.length; index++) {
            const post = state.posts[index];
            if (post.id === action.payload.data.id) {
              state.posts[index] = action.payload.data;
              break;
            }
          }
        }
      })
      .addCase(dislikePost.rejected, (state: any, action: any) => {
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

export default postSlice.reducer;
