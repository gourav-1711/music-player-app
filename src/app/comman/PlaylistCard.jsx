"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  play,
  setShowPlayer,
  resetPlayer,
} from "../store/features/musicPlayerSlice";
import { StatefulButton } from "@/components/ui/stateful-button";
import { addFavorite } from "../store/features/favoriteSlice";
import { toast } from "sonner";

export const PlaylistCard = ({ item, mode }) => {
  // const url =
  //   "https://lh3.googleusercontent.com/aida-public/AB6AXuCZKYqF1FbSh5RdzjTk0-KML2C1UWSVPtax2pmL8D65yON6r76SikfFIr_7QbwNVdVIbEiyJIqrnBGwJl0uXW5LdhG9DJh8bKp8NUH9mMYo-KBSLaA_ZKN8oIYr1GPkyiemxdBnIDfr2XSBaqRjA1izrNac_yuP4Ogvyv7VXoGSn-NdDvQw_7SXGK1AZcmAv9x3arfRf5VAYigd7ylmNTdIhLjx9VIrdP5j5QO8R2zBtxoniA7PY44KkKn9AlbJMkztXg_7Qd3WDYI";

  const shortTitle =
    item.snippet.title.length > 25
      ? item.snippet.title.slice(0, 25) + "..."
      : item.snippet.title;

  const dispatch = useDispatch();

  const handleCardClick = (item) => {
    dispatch(resetPlayer());
    if (mode === "search") {
      dispatch(
        play({
          id: item.id.videoId,
          title: shortTitle,
          artist: item.snippet.channelTitle,
        })
      );
    } else {
      dispatch(
        play({
          id: item.snippet.resourceId.videoId,
          title: shortTitle,
          artist: item.snippet.channelTitle,
        })
      );
    }
  };

  return (
    <>
      <Card className="w-full  text-white !p-0 bg-transparent ">
        <CardContent className="!p-0 space-y-2 hover:bg-gray-800/60 rounded-xl hover:cursor-pointer">
          <div className="aspect-video bg-black rounded-xl overflow-hidden ">
            <img
              onClick={() => handleCardClick(item)}
              src={
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.default?.url
              }
              alt={item.snippet.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <h4
            onClick={() => handleCardClick(item)}
            className="text-md font-semibold leading-tight truncate pt-2 pb-3 px-1"
          >
            {shortTitle}
          </h4>
          <StatefulButtonDemo item={item} />

          {/* <p className="text-muted-foreground text-sm">{item.snippet.description.slice(0, 50)}</p> */}
        </CardContent>
      </Card>
    </>
  );
};

export function StatefulButtonDemo({ item }) {
  
  // dummy API call
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(addFavorite(item));
    toast.success("Added to favorite");
    console.log(item);
  };
  return (
    <div className="flex h-10 w-full items-center  px-2 ">
      <StatefulButton
        onClick={handleClick}
        className={` w-full `}
        text="Add to Favorite"
      >
        Add to Favorite
      </StatefulButton>
    </div>
  );
}
