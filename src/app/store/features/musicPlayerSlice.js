import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoId: "",
  artist: "",
  title: "",
  showPlayer: false,
};

export const musicPlayerSlice = createSlice({
  name: "musicPlayer",
  initialState,
  reducers: {
    play: (state, action) => {
      const { id, title, artist } = action.payload;
      state.videoId = id;
      state.title = title;
      state.artist = artist;
      state.showPlayer = true;
    },
    setShowPlayer: (state, action) => {
      state.showPlayer = action.payload;
    },
    resetPlayer: (state) => {
      state.videoId = "";
      state.artist = "";
      state.title = "";
      state.showPlayer = false;
    },
  },
});

export const { play, setShowPlayer, resetPlayer } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
