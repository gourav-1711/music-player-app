"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigateToPage, PAGES } from "./store/features/navigationSlice";
import HomePage from "./(pages)/HomePage";
import Explore from "./(pages)/Explore";
import Playlist from "./(pages)/Playlist";
import History from "./(pages)/History";
import Dashboard from "./(pages)/Dashboard";
import Favorite from "./(pages)/Favorite";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state) => state.navigation);

  const handleNavigateToPage = (page) => {
    dispatch(navigateToPage(page));
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 50,
      y: 50,
      scale: 0.95,
    },
    in: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: -50,
      y: -50,
      scale: 0.95,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  // Component mapping for cleaner code
  const pageComponents = {
    [PAGES.HOME]: HomePage,
    [PAGES.EXPLORE]: Explore,
    [PAGES.PLAYLIST]: Playlist,
    [PAGES.HISTORY]: History,
    [PAGES.DASHBOARD]: Dashboard,
    [PAGES.FAVORITE]: Favorite,
  };

  const CurrentPageComponent = pageComponents[currentPage];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full pb-24"
        >
          {CurrentPageComponent && <CurrentPageComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
