import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";
import axios from "axios";
import Constants from "expo-constants";
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
export const getPosts: any = createAsyncThunk(
  "getPost",
  async (idPost: number) => {
    console.log(idPost);
    try {
      const response = await axiosInstance.get(`api/posts/${idPost}`);
      console.log(response.data);
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  }
);
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
      `${Constants.manifest.extra.HOST_SERVER}/api/posts`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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
  postId: number;
  userId: number;
}
export const likePost: any = createAsyncThunk(
  "likePost",
  async (data: PostLikes) => {
    try {
      const response = await axiosInstance.post(`api/posts/like`, {
        ...data,
      });
      return {
        type: 1,
        data: {
          postId: data.postId,
          ...response.data,
        },
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
      const response = await axiosInstance.post(`api/posts/dislike`, {
        ...data,
      });
      return {
        type: 1,

        data: {
          postId: data.postId,
          ...response.data,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
interface Comment {
  userId: number;
  postId: number;
  parentCommentId: number;
  text: string;
}
export const addComment: any = createAsyncThunk(
  "addComment",
  async (data: Comment) => {
    console.log(981328);
    console.log(data);
    try {
      const response = await axiosInstance.post(`api/comments`, data);
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
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
      .addCase(getPosts.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        const statePosts = [...state.posts];
        const newData = action.payload.data.filter(
          (item: any) => !statePosts.some((post) => post.id === item.id)
        );
        newData.forEach((item: any) => {
          item.comments = item.comments.reverse();
        });

        const updatedPosts = [...statePosts, ...newData];
        state.posts = updatedPosts;
      })
      .addCase(getPosts.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(addPost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        if (action.payload.type) {
          state.posts = [action.payload.data, ...state.posts];
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
        if (action.payload.type) {
          for (let index = 0; index < state.posts.length; index++) {
            const post = state.posts[index];
            if (post.id === action.payload.data.postId) {
              console.log(action.payload.data.id);
              post.likedUsers = [action.payload.data, ...post.likedUsers];
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
        if (action.payload.type) {
          for (let index = 0; index < state.posts.length; index++) {
            const post = state.posts[index];
            if (post.id === action.payload.data.postId) {
              console.log(action.payload.data.id);
              const updatedLikedUsers = post.likedUsers.filter((item: any) => {
                return item.id !== action.payload.data.id;
              });
              console.log(updatedLikedUsers);

              post.likedUsers = updatedLikedUsers;
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
      })
      .addCase(addComment.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        if (action.payload.type) {
          for (let index = 0; index < state.posts.length; index++) {
            const post = state.posts[index];
            if (post.id === action.payload.data.id) {
              state.posts[index].comments =
                action.payload.data.comments.reverse();
              break;
            }
          }
        }
        Toast.show("Thêm bình luận thành công.", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(addComment.rejected, (state: any, action: any) => {
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
