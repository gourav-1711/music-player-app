import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favorite: []
}

export const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            const isFavorite = state.favorite.find(
                (item) => item.id === action.payload.id
            )
            if (!isFavorite) {
                state.favorite.push(action.payload)
            }
        },
        removeFavorite: (state, action) => {
            state.favorite = state.favorite.filter(
                (item) => item.id !== action.payload.id
            )
        }
    }
})

export const { addFavorite, removeFavorite } = favoriteSlice.actions
export default favoriteSlice.reducer