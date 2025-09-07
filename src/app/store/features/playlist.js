import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  playlist: {},
  videos: [],
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
      // Cookies.set("music-playlist", JSON.stringify(action.payload));
      state.videos = action.payload.videos?.map((item) => ({
        id: item.snippet.resourceId?.videoId || item.id,
        title: item.snippet.title,
        src:
          item.snippet.thumbnails.maxres?.url ||
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.standard?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        artist: item.snippet.channelTitle,
        description: item.snippet.description,
        from: "playlist",
      }));
    },
    resetPlaylist: (state) => {
      state.playlist = [];
      Cookies.remove("music-playlist");
    },
  },
});

export const { addPlaylist, removePlaylist, addFullPlaylist, resetPlaylist } =
  playlist.actions;
export default playlist.reducer;
