import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../api/api";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await $api.get(`/comments/${postId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error fetching comments");
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    {
      postId,
      userId,
      comment_text,
      profile_image,
    }: {
      postId: string;
      userId: string;
      comment_text: string;
      profile_image: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await $api.post(`/comments/${postId}`, {
        userId,
        comment_text,
        profile_image,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding comment");
    }
  }
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async (
    { commentId, userId }: { commentId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await $api.post(`/comments/like/${commentId}`, {
        userId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error liking comment");
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: { comments: [], loading: false, error: null },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c: any) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(likeComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setComments } = commentsSlice.actions;

export default commentsSlice.reducer;
