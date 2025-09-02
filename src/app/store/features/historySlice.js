import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory: (state, action) => {
      const isHistory = state.history.find(
        (item) => item.videoId === action.payload.videoId
      );
      if (!isHistory) {
        state.history.unshift(action.payload);
      } else {
        state.history = state.history.filter(
          (item) => item.videoId !== action.payload.videoId
        );
        state.history.unshift(action.payload);
      }
    },
    removeHistory: (state, action) => {
      state.history = state.history.filter(
        (item) => item.videoId !== action.payload.videoId
      );
    },
    addFullHistory: (state, action) => {
      const newItems = action.payload.filter(
        (item) => !state.history.some((hist) => hist.videoId === item.videoId)
      );
      state.history = [...state.history, ...newItems];
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { addHistory, removeHistory, addFullHistory, clearHistory } =
  historySlice.actions;
export default historySlice.reducer;
