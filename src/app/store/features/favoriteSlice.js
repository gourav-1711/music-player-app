import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorite: [],
};

export const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const isFavorite = state.favorite.some(
        (item) => item.id === action.payload.id
      );
      if (!isFavorite) {
        state.favorite.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorite = state.favorite.filter(
        (item) => item.id !== action.payload.id
      );
    },
    addFullFavorite: (state, action) => {
      const newItems = action.payload.filter(
        (item) => !state.favorite.some((fav) => fav.id === item.id)
      );

      state.favorite = [...state.favorite, ...newItems];
    },
    clearFavorite: (state) => {
      state.favorite = [];
    },
  },
});

export const { addFavorite, removeFavorite, addFullFavorite, clearFavorite } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
