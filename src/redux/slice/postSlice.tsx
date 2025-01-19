import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import Toast from "react-native-simple-toast";
import axios from "axios";
import Constants from "expo-constants";
const initialState = {
  posts: [],
  error: null,
  status: "",
  userPosts: [],
};
interface Post {
  idUser: number;
  text: string;
  files: any;
  statusPost: any;
}
export const getPostsByUser: any = createAsyncThunk(
  "getPostsByUser",
  async (id: number) => {
    try {
      const response = await axiosInstance.get(`api/posts/user/${id}`);
      return {
        type: 1,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  }
);
export const getPost: any = createAsyncThunk(
  "getPost",
  async (idPost: number) => {
    try {
      const response = await axiosInstance.get(`api/posts/${idPost}`);
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
      `${Constants.manifest?.extra?.HOST_SERVER}/api/posts`,
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
export const delPost: any = createAsyncThunk("delPost", async (id: number) => {
  try {
    const response = await axios.delete(
      `${Constants.manifest?.extra?.HOST_SERVER}/api/posts/${id}`
    );
    return {
      type: 1,
      data: response.data,
      id: id,
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
      .addCase(getPost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        const statePosts = [...state.posts];
        let newData = action.payload.data.filter(
          (item: any) => !statePosts.some((post) => post.id === item.id)
        );
        newData = newData.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const updatedPosts = [...statePosts, ...newData];
        state.posts = updatedPosts;
      })
      .addCase(getPost.rejected, (state: any, action: any) => {
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
              post.likedUsers = [action.payload.data, ...post.likedUsers];
              break;
            }
          }
          for (let index = 0; index < state.userPosts.length; index++) {
            const post = state.userPosts[index];
            if (post.id === action.payload.data.postId) {
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
              const updatedLikedUsers = post.likedUsers.filter((item: any) => {
                return item.id !== action.payload.data.id;
              });
              post.likedUsers = updatedLikedUsers;
              break;
            }
          }
          for (let index = 0; index < state.userPosts.length; index++) {
            const post = state.userPosts[index];
            if (post.id === action.payload.data.postId) {
              const updatedLikedUsers = post.likedUsers.filter((item: any) => {
                return item.id !== action.payload.data.id;
              });
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
      })
      .addCase(delPost.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(delPost.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.userPosts = state.userPosts.filter((item: any) => {
          return item.id != action.payload.id;
        });
        Toast.show("Xóa bài viết thành công.", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(delPost.rejected, (state: any, action: any) => {
        state.status = "failed";
        state.user = null;
        state.error = action.error.message;
        Toast.show(action.error.message, Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      })
      .addCase(getPostsByUser.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPostsByUser.fulfilled, (state: any, action: any) => {
        state.status = "succeeded";
        state.error = null;
        state.userPosts = action.payload.data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .addCase(getPostsByUser.rejected, (state: any, action: any) => {
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
