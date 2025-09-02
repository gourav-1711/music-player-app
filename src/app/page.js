"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigateToPage, PAGES } from "./store/features/navigationSlice";
import HomePage from "./(pages)/HomePage";
import Explore from "./(pages)/Explore";
import Playlist from "./(pages)/Playlist";
import History from "./(pages)/History";
import Dashboard from "./(pages)/Dashboard";
import Favorite from "./(pages)/Favorite";
import LoginRegister from "./(pages)/LoginRegister";
import Profile from "./(pages)/Profile";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const { currentPage } = useSelector((state) => state.navigation);
  const User = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
 

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

  const pageComponents = {
    [PAGES.HOME]: HomePage,
    [PAGES.EXPLORE]: Explore,
    [PAGES.PLAYLIST]: Playlist,
    [PAGES.HISTORY]: History,
    [PAGES.DASHBOARD]: Dashboard,
    [PAGES.FAVORITE]: Favorite,
    [PAGES.LOGIN_REGISTER]: LoginRegister,
    [PAGES.PROFILE]: Profile,
  };

  const CurrentPageComponent = pageComponents[currentPage];

  useEffect(() => {
    if(User && currentPage === PAGES.LOGIN_REGISTER){
      dispatch(navigateToPage(PAGES.HOME));
    }
  }, [currentPage, User]);



  return (
    <div className="relative overflow-hidden ">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full "
        >
          {CurrentPageComponent && <CurrentPageComponent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
