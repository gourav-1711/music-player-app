import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useState } from "react";

import { useAppContext } from "../context/AppContext";

export const PlaylistCard = ({  item }) => {
  // const url =
  //   "https://lh3.googleusercontent.com/aida-public/AB6AXuCZKYqF1FbSh5RdzjTk0-KML2C1UWSVPtax2pmL8D65yON6r76SikfFIr_7QbwNVdVIbEiyJIqrnBGwJl0uXW5LdhG9DJh8bKp8NUH9mMYo-KBSLaA_ZKN8oIYr1GPkyiemxdBnIDfr2XSBaqRjA1izrNac_yuP4Ogvyv7VXoGSn-NdDvQw_7SXGK1AZcmAv9x3arfRf5VAYigd7ylmNTdIhLjx9VIrdP5j5QO8R2zBtxoniA7PY44KkKn9AlbJMkztXg_7Qd3WDYI";

  const shortTitle =
    item.snippet.title.length > 15
      ? item.snippet.title.slice(0, 15) + "..."
      : item.snippet.title;

    const { play  } = useAppContext();

    

  const handleCardClick = (item) => {
     play(item.snippet.resourceId.videoId , shortTitle , item.snippet.channelTitle);
    
    
  };

  return (
    <>
      <Card className="w-full  text-white !p-0 bg-transparent ">
        <CardContent onClick={() => handleCardClick(item)} className="!p-0 space-y-2">
          <div className="aspect-video bg-black rounded-xl overflow-hidden ">
            <img
              src={
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.default?.url
              }
              alt={item.snippet.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <h4 className="text-lg font-bold leading-tight truncate pt-2 pb-3 px-1">
            {shortTitle}
          </h4>

          {/* <p className="text-muted-foreground text-sm">{item.snippet.description}</p> */}
        </CardContent>
      </Card>

       

    </>
  );
};
