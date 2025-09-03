import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    user: Cookies.get("music-user") || null,
    isLogin: false,
    details: null    
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLogin = true;
            state.details = action.payload.user;
        },
        logout: (state) => {
            state.user = null;
            state.isLogin = false;
            Cookies.remove("music-user");
        },
        register: (state, action) => {
            state.isLogin = true;
            state.details = action.payload.user;
        },
    },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
