import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoId: "",
  artist: "",
  title: "",
  src: "",
  showPlayer: false,
  description: "",
  from: "",
  mode: "",
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
      state.src = action.payload.src || "";
      state.showPlayer = true;
      state.description = action.payload.description || "";
      state.mode = action.payload.mode || "";
      state.from = action.payload.from || "";
    },
    setShowPlayer: (state, action) => {
      state.showPlayer = action.payload;
    },
    resetPlayer: (state) => {
      state.videoId = "";
      state.artist = "";
      state.title = "";
      state.src = "";
      state.showPlayer = false;
      state.mode = "";
      state.from = "";
    },
  },
});

export const { play, setShowPlayer, resetPlayer } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
