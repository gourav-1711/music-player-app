import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: Cookies.get("music-user") ? Cookies.get("music-user") : null,
  isLogin: Cookies.get("music-user") ? true : false,
  details: Cookies.get("details") ? JSON.parse(Cookies.get("details")) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.details = action.payload;
      // Cookies.set("details", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      Cookies.remove("music-user");
      Cookies.remove("details");
    },
    register: (state, action) => {
      state.isLogin = true;
      state.details = action.payload;
      // Cookies.set("details", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
