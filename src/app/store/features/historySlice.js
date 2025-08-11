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
        (item) => item.id === action.payload.id
      );
      if (!isHistory) {
        state.history.unshift(action.payload);
      } else {
        state.history = state.history.filter(
          (item) => item.id !== action.payload.id
        );
        state.history.unshift(action.payload);
      } 
    },
    removeHistory: (state, action) => {
      state.history = state.history.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const { addHistory, removeHistory } = historySlice.actions;
export default historySlice.reducer;
