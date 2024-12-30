import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getUserByIdApi } from "../../api/services/usersService";
import { $api } from "../../api/api";

interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  bio_website: string;
  profile_image: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  lastMessage: string;
  __v: number;
}

interface UserState {
  user: User[];
  currentUser: null | User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: string) => {
    const data = await getUserByIdApi(userId);
    return data;
  }
);

export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const response = await $api.get("/user");
  return response.data;
});

export const getFollow = createAsyncThunk(
  "user/getFollow",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/followers`);
    return response.data;
  }
);

export const getFollowing = createAsyncThunk(
  "user/getFollowing",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/following`);
    return response.data;
  }
);

export const getUsersWithChats = createAsyncThunk(
  "user/getUsersWithChats",
  async () => {
    const response = await $api.get("/messages/chats");
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeTimeInLastMessage: (state: UserState, { payload }) => {
      state.user = state.user.map((user) => {
        if (user._id === payload.userId) {
          return { ...user, lastMessage: payload.lastMessage };
        }
        return user;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUser = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload || null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })

      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })

      .addCase(getFollow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollow.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.followers_count = payload.length;
        }
      })
      .addCase(getFollow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })

      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowing.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.following_count = payload.length;
        }
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading posts";
      })
      .addCase(getUsersWithChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersWithChats.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUsersWithChats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Error when uploading users with correspondence";
      });
  },
});

export const { changeTimeInLastMessage } = userSlice.actions;
export default userSlice.reducer;
