import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  isPublic: boolean;
  totalVotes: number;
  createdAt: string;
}

const initialState: Poll[] = [];

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.push(action.payload);
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      const index = state.findIndex(poll => poll.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deletePoll: (state, action: PayloadAction<string>) => {
      return state.filter(poll => poll.id !== action.payload);
    },
  },
});

export const { addPoll, updatePoll, deletePoll } = pollsSlice.actions;
export default pollsSlice.reducer;