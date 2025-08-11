import { configureStore } from "@reduxjs/toolkit";
import musicPlayerReducer from "./features/musicPlayerSlice";
import navigationReducer from "./features/navigationSlice";
import searchReducer from "./features/SearchSlice";
import favoriteReducer from "./features/favoriteSlice";
import historyReducer from "./features/historySlice";

export default configureStore({
  reducer: {
    musicPlayer: musicPlayerReducer,
    navigation: navigationReducer,
    search: searchReducer,
    favorite: favoriteReducer,
    history: historyReducer,
  },
});
