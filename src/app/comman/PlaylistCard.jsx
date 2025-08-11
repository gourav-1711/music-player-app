"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  play,
  setShowPlayer,
  resetPlayer,
} from "../store/features/musicPlayerSlice";
import { addFavorite, removeFavorite } from "../store/features/favoriteSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
          description: item.snippet.description,
          mode: mode,
        })
      );
    } else {
      dispatch(
        play({
          id: item.snippet.resourceId?.videoId || item.id,
          title: shortTitle,
          artist: item.snippet.channelTitle,
          description: item.snippet.description,
          mode: mode,
        })
      );
    }
  };

  return (
    <>
      <Card className="w-full  text-white !p-0 bg-transparent ">
        <CardContent className="!p-0 space-y-2 hover:bg-gray-800/60 rounded-xl hover:cursor-pointer">
          <div className="aspect-video bg-black rounded-xl overflow-hidden hover:ring-purple-500 ">
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
          <StatefulButtonDemo item={item} mode={mode} />

          {/* <p className="text-muted-foreground text-sm">{item.snippet.description.slice(0, 50)}</p> */}
        </CardContent>
      </Card>
    </>
  );
};

export function StatefulButtonDemo({ item, mode }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const musicObj = {};

  if (mode === "search") {
    musicObj.id = item.id.videoId;
    musicObj.title = item.snippet.title;
    musicObj.artist = item.snippet.channelTitle;
    musicObj.description = item.snippet.description;
    musicObj.src =
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.standard?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url;
  } else {
    musicObj.id = item.snippet.resourceId?.videoId || item.id;
    musicObj.title = item.snippet.title;
    musicObj.artist = item.snippet.channelTitle;
    musicObj.description = item.snippet.description;
    musicObj.src =
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.standard?.url ||
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url;
  }

  const favorite = useSelector((state) => state.favorite.favorite);

  useEffect(() => {
    if (favorite.some((fav) => fav.id === musicObj.id)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [favorite]);
  // dummy API call
  const handleClick = () => {
    if (added) {
      dispatch(removeFavorite(musicObj));
      toast.success("Removed from favorite");
    } else {
      dispatch(addFavorite(musicObj));
      toast.success("Added to favorite");
    }
  };
  return (
    <div className="flex h-10 w-full items-center    ">
      <Button
        onClick={handleClick}
        className={` w-full bg-gray-800 hover:bg-gray-700 hover:text-white text-white hover:ring-purple-500 hover:ring-1 ${
          added ? "bg-purple-500" : "bg-gray-800"
        }`}
        text="Add to Favorite"
      >
        {added ? "Remove from Favorite" : "Add to Favorite"}
      </Button>
    </div>
  );
}
