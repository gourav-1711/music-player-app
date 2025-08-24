"use client";
import { useSelector, useDispatch } from "react-redux";
import { setShowPlayer } from "./store/features/musicPlayerSlice";
import { Header } from "./comman/Header";
import MusicPlayer from "./(pages)/MusicPlayer";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { useEffect } from "react";
import store from "./store/store";

export default function ClientLayoutWrapper({ children }) {
  // const dispatch = useDispatch();
  // const { videoId, showPlayer, title, artist , mode , description } = useSelector(
  //   (state) => state.musicPlayer
  // );

  // const handleSetShowPlayer = (value) => {
  //   dispatch(setShowPlayer(value));
  // };

  useEffect(() => {
    console.clear();
    setTimeout(() => {
      console.clear();
    }, 1000);
  }, []);
  
  return (
    <>
    <Provider store={store}>
      <Header />
      <Toaster richColors theme="dark" closeButton />
      {children}
      {
        <MusicPlayer
          // videoId={videoId}
          // title={title}
          // artist={artist}
          // open={showPlayer}
          // setOpen={handleSetShowPlayer}
          // mode={mode}
          // description={description}
        />
      }
    </Provider>
    </>
  );
}
