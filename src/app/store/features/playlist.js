import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playlist: [],
};

const playlist = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addPlaylist: (state, action) => {
            state.playlist.push(action.payload);
        },
        removePlaylist: (state, action) => {
            state.playlist = state.playlist.filter(
                (playlist) => playlist.id !== action.payload.id
            );
        },
        addFullPlaylist: (state, action) => {
            state.playlist = action.payload;
        },
        resetPlaylist: (state) => {
            state.playlist = [];
        },
    },
});

export const { addPlaylist, removePlaylist, addFullPlaylist, resetPlaylist } = playlist.actions;
export default playlist.reducer;