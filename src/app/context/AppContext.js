// contexts/AppContext.js
"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [videoId, setVideoId] = useState("");
  const [artist , setArtist] = useState("");
  const [title , setTitle] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const play = (id , title , artist) => {
    setVideoId(id);
    setShowPlayer(true);
    setArtist(artist);
    setTitle(title);
  };

  const value = {
    videoId,
    title,
    artist,
    showPlayer,
    play,
    setShowPlayer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
