import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CollaborationState {
  activeUsers: Array<{
    id: string;
    name: string;
    cursor?: { line: number; column: number };
  }>;
  isConnected: boolean;
  currentRoom: string | null;
}

const initialState: CollaborationState = {
  activeUsers: [],
  isConnected: false,
  currentRoom: null,
};

const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<CollaborationState['activeUsers']>) => {
      state.activeUsers = action.payload;
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload;
    },
    leaveRoom: (state) => {
      state.currentRoom = null;
      state.activeUsers = [];
    },
  },
});

export const { setConnected, setActiveUsers, joinRoom, leaveRoom } = collaborationSlice.actions;
export default collaborationSlice.reducer;