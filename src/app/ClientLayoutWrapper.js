// src/app/ClientLayoutWrapper.jsx
"use client";
import { useAppContext } from "./context/AppContext";
import { Header } from "./comman/Header";
import MusicPlayer from "./(pages)/MusicPlayer";

export default function ClientLayoutWrapper({ children }) {
const { videoId, showPlayer, setShowPlayer , title , artist } = useAppContext();

  return (
    <>
      <Header />
      {children}
      { 
        <MusicPlayer
          videoId={videoId}
          title={title}
          artist={artist}
          open={showPlayer}
         setOpen={setShowPlayer}
        />
      }
    </>
  );
}
