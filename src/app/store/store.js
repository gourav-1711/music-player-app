import { configureStore } from "@reduxjs/toolkit";
import musicPlayerReducer from "./features/musicPlayerSlice";
import navigationReducer from "./features/navigationSlice";
import searchReducer from "./features/SearchSlice";

export default configureStore({
  reducer: {
    musicPlayer: musicPlayerReducer,
    navigation: navigationReducer,
    search: searchReducer,
  },
});
