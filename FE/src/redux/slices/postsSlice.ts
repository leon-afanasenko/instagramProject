import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { $api } from "../../api/api";

interface Post {
  _id: string;
  user_id: string;
  profile_image: string;
  image_url: string;
  user_name: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  __v: number;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const getAllPosts = createAsyncThunk("allPosts", async () => {
  const response = await $api.get("/post/all");
  return response.data;
});

export const getAllPublicPosts = createAsyncThunk(
  "allPublicPosts",
  async () => {
    const response = await $api.get("/post/all/public");
    return response.data;
  }
);

export const getOtherUserPosts = createAsyncThunk(
  "posts/getOtherUserPosts",
  async (user_id) => {
    const response = await $api.get(`/post/${user_id}`);
    return response.data;
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const response = await $api.post(`/post/${postId}/like`, { userId });
    return { postId, likes_count: response.data.likes_count };
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({
    postId,
    updatedData,
  }: {
    postId: string;
    updatedData: Partial<Post>;
  }) => {
    const response = await $api.put(`/post/${postId}`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );

        if (postIndex !== -1) {
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            ...updatedPost,
          };
        }
      })

      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })
      .addCase(getAllPublicPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPublicPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPublicPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })
      .addCase(getOtherUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOtherUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getOtherUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes_count } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes_count = likes_count;
        }
      });
  },
});

export default postsSlice.reducer;
