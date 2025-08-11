"use client";
import { useSelector, useDispatch } from "react-redux";
import { setShowPlayer } from "./store/features/musicPlayerSlice";
import { Header } from "./comman/Header";
import MusicPlayer from "./(pages)/MusicPlayer";
import { Toaster } from "sonner";

export default function ClientLayoutWrapper({ children }) {
  const dispatch = useDispatch();
  const { videoId, showPlayer, title, artist , mode , description } = useSelector(
    (state) => state.musicPlayer
  );

  const handleSetShowPlayer = (value) => {
    dispatch(setShowPlayer(value));
  };
  
  return (
    <>
      <Header />
      <Toaster richColors theme="dark" closeButton />
      {children}
      {
        <MusicPlayer
          videoId={videoId}
          title={title}
          artist={artist}
          open={showPlayer}
          setOpen={handleSetShowPlayer}
          mode={mode}
          description={description}
        />
      }
    </>
  );
}
