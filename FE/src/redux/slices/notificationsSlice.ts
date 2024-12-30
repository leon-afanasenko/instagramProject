import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../api/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await $api.get(`/notifications/${userId}/actions`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Ошибка при загрузке уведомлений"
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { actions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload.slice(0, 10);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default notificationsSlice.reducer;
