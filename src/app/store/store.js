import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import musicPlayerReducer from "./features/musicPlayerSlice";

import searchReducer from "./features/SearchSlice";
import favoriteReducer from "./features/favoriteSlice";
import historyReducer from "./features/historySlice";
import authReducer from "./features/auth";
import playlistReducer from "./features/playlist";
// Configuration for persisting the Redux store
const persistConfig = {
  key: "root",
  storage,
  // Add any reducers you want to persist here
  whitelist: ["favorite", "history", "playlist" , "musicPlayer"],
  // blacklist: ['navigation'] // Add any reducers you don't want to persist here
};

// Combine all reducers
const rootReducer = combineReducers({
  musicPlayer: musicPlayerReducer,
  search: searchReducer,
  favorite: favoriteReducer,
  history: historyReducer,
  auth: authReducer,
  playlist: playlistReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
