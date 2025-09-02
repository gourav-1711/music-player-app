"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useDispatch, useSelector } from "react-redux";
import { play, resetPlayer } from "@/app/store/features/musicPlayerSlice";
import { removeFavorite } from "@/app/store/features/favoriteSlice";
import { Button } from "./ui/button";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const favorite = useSelector((state) => state.favorite.favorite);

  const cards = favorite.map((item) => item);

  const dispatch = useDispatch();

  const handleCardClick = (item) => {
    dispatch(resetPlayer());

    dispatch(
      play({
        id: item.id,
        title: item.title,
        artist: item.artist,
      })
    );
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] px-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2  items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] max-h-[90vh] min-h-0 flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div
                layoutId={`image-${active.title}-${id}`}
                className="flex-none"
              >
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-54 md:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover shrink-0"
                />
              </motion.div>

              <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden">
                <div className="flex justify-between items-start gap-3 p-4 sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200/60 dark:border-neutral-800">
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200 truncate break-words"
                    >
                      {active.title}
                    </motion.h3>
                  </div>

                  <motion.button
                    layoutId={`button-${active.title}-${id}`}
                    onClick={() => handleCardClick(active)}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white shrink-0 whitespace-nowrap"
                  >
                    {"Play"}
                  </motion.button>
                  <Button
                    className=" rounded-full w-fit  bg-red-500/80  hover:bg-red-600 m-0 text-white"
                    onClick={() => {
                      dispatch(removeFavorite(active));
                      setActive(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 break-words px-2"
                >
                  {active.description}
                </motion.p>
                <div className="pt-4 relative px-4 flex-1 min-h-0">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-sm pb-10 flex flex-col items-start gap-4 dark:text-neutral-400"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className=" mx-auto w-full gap-4">
        {cards.length > 0 &&
          cards.map((card, index) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={`card-${card.title}-${id}`}
              onClick={() => setActive(card)}
              className="p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer "
            >
              <div className="flex gap-4 flex-row ">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <img
                    width={100}
                    height={100}
                    src={card.src}
                    alt={card.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </motion.div>
                <div className="">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-left"
                  >
                    {card.title.slice(0, 20)}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400 text-left"
                  >
                    {card.description.slice(0, 50)}
                  </motion.p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${card.title}-${id}`}
                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-0"
              >
                {"Play"}
              </motion.button>
            </motion.div>
          ))}

        {cards.length === 0 && (
          <p className="text-center text-neutral-600 dark:text-neutral-400 py-4">
            No favorite songs found
          </p>
        )}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
