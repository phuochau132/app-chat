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
    const response = await axios.post(
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
      });
  },
});

export default postSlice.reducer;
