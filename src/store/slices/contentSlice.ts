import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentState, Content } from '@/types';
import { contentAPI } from '@/services/api';

const initialState: ContentState = {
  items: [],
  currentContent: null,
  loading: false,
  error: null,
};

export const fetchContent = createAsyncThunk('content/fetchContent', async () => {
  return await contentAPI.getAll();
});

export const createContent = createAsyncThunk(
  'content/createContent',
  async (contentData: Partial<Content>) => {
    return await contentAPI.create(contentData);
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, data }: { id: string; data: Partial<Content> }) => {
    return await contentAPI.update(id, data);
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string) => {
    await contentAPI.delete(id);
    return id;
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setCurrentContent: (state, action: PayloadAction<Content | null>) => {
      state.currentContent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Fetched content payload:', action.payload);
        state.items = action.payload;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        const updatedItem = action.payload as any;
        console.log('Updating content with ID:', updatedItem._id);
        const index = state.items.findIndex(item => (item as any)._id === updatedItem._id);
        console.log('Found index:', index);
        if (index !== -1) {
          console.log('Updating existing item at index:', index);
          state.items[index] = updatedItem;
        } else {
          console.log('Item not found, this should not happen in update');
        }
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.items = state.items.filter(item => (item as any)._id !== action.payload);
      });
  },
});

export const { setCurrentContent, clearError } = contentSlice.actions;
export default contentSlice.reducer;