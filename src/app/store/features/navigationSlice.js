import { createSlice } from "@reduxjs/toolkit";

// Page constants
export const PAGES = {
  HOME: "home",
  EXPLORE: "explore",
  PLAYLIST: "playlist",
  HISTORY: "history",
  DASHBOARD: "dashboard",
  FAVORITE: "favorite",
};

const initialState = {
  currentPage: PAGES.HOME,
  previousPage: null,
  navigationHistory: [PAGES.HOME],
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    navigateToPage: (state, action) => {
      const page = action.payload;
      if (page !== state.currentPage) {
        state.previousPage = state.currentPage;
        state.currentPage = page;
        state.navigationHistory.push(page);
      }
    },
    goBack: (state) => {
      if (state.previousPage) {
        const temp = state.currentPage;
        state.currentPage = state.previousPage;
        state.previousPage = temp;
        state.navigationHistory.pop();
      }
    },
    resetNavigation: (state) => {
      state.currentPage = PAGES.HOME;
      state.previousPage = null;
      state.navigationHistory = [PAGES.HOME];
    },
  },
});

export const { navigateToPage, goBack, resetNavigation } =
  navigationSlice.actions;

export default navigationSlice.reducer;
