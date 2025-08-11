"use client";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { ImagesSlider } from "../../components/ui/images-slider";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { navigateToPage } from "../store/features/navigationSlice";
import { PAGES } from "../store/features/navigationSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function Banner({ data, loading = true }) {
  const dispatch = useDispatch();

  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]);

  useEffect( () => {
    if (data && data.length > 0) {
      console.log(data);
      const thumbnails = data.map((item) => {
        
        return (
          item.snippet.thumbnails.maxres?.url ||
          item.snippet.thumbnails.standard?.url ||
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default.url
        );
      })
      setImages(thumbnails);
    } else {
      console.log("no data");
      const images = [
        "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ];
      setImages(images);
    }
  }, [data]);

  // console.log(data);

  return (
    <>
      {loading ? (
        <Skeleton className="h-[25rem] max-w-[1000px] mx-auto my-4 rounded-3xl overflow-hidden" />
      ) : (
        <ImagesSlider
          className="h-[25rem] max-w-[1000px] mx-auto my-4 rounded-3xl overflow-hidden"
          images={images}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
          >
            <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              Discover new music and artists
            </motion.p>
            <button
              onClick={() => dispatch(navigateToPage(PAGES.EXPLORE))}
              className="px-4 py-2 backdrop-blur-sm border bg-[#7a06b0]/10 border-[#7a06b0]/20 text-white mx-auto text-center rounded-full relative mt-4"
            >
              <span>Explore Songs →</span>
              <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#7a06b0] to-transparent" />
            </button>
          </motion.div>
        </ImagesSlider>
      )}
    </>
  );
}
