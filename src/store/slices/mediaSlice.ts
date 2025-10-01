import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MediaState } from '@/types';
import { mediaAPI } from '@/services/api';

const initialState: MediaState = {
  files: [],
  loading: false,
  error: null,
};

export const fetchMedia = createAsyncThunk('media/fetchMedia', async () => {
  return await mediaAPI.getAll();
});

export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (file: File) => {
    return await mediaAPI.upload(file);
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.map((item: any) => ({
          ...item,
          id: item._id || item.id
        }));
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        const newFile = {
          ...action.payload,
          id: (action.payload as any)._id || action.payload.id
        };
        state.files.push(newFile);
      });
  },
});

export default mediaSlice.reducer;