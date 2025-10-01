import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import contentSlice from './slices/contentSlice';
import mediaSlice from './slices/mediaSlice';
import collaborationSlice from './slices/collaborationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    content: contentSlice,
    media: mediaSlice,
    collaboration: collaborationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;