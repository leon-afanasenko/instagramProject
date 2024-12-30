import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import followSlice from "./slices/followSlice";
import postsReducer from "./slices/postsSlice";
import userReducer from "./slices/userSlice";
import likesReducer from './slices/likesSlice';
import commentsReducer from './slices/commentsSlice';
import notificationsReducer from './slices/notificationsSlice';



const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    auth: authReducer,
    follow: followSlice,
    likes: likesReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
