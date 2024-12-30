import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { $api } from "../../api/api";

interface IFollowState {
  follower: null | string[];
  following: null | string[];
}

const initialState: IFollowState = {
  follower: null,
  following: null,
};

export const getFollowMe = createAsyncThunk(
  "user/getFollow",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/followers`);
    return response.data;
  }
);

export const getFollowingMe = createAsyncThunk(
  "user/getFollowing",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/following`);
    return response.data;
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFollowMe.fulfilled, (state, { payload }) => {
      state.following = payload.map((item: any) => item.user_id._id);
    });
    builder.addCase(getFollowingMe.fulfilled, (state, { payload }) => {
      state.follower = payload.map((item: any) => item.user_id._id);
    });
  },
});

export default followSlice.reducer;
