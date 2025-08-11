import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoId: "",
  artist: "",
  title: "",
  showPlayer: false,
  description : "",
  mode : ""
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
      state.description = action.payload.description || "";
      state.mode = action.payload.mode || "";
    },
    setShowPlayer: (state, action) => {
      state.showPlayer = action.payload;
    },
    resetPlayer: (state) => {
      state.videoId = "";
      state.artist = "";
      state.title = "";
      state.showPlayer = false;
      state.mode = "";
    },
  },
});

export const { play, setShowPlayer, resetPlayer } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
