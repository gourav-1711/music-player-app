"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_KEY = process.env.YOUTUBE_API_KEY; // put your API key in .env.local

export default function Playlist() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlaylistUrl(e.target.search.value);
  };

  return (
    <>
      <div className="max-w-[1150px] mx-auto my-3 space-y-3">
        <h1 className="text-2xl italic font-semibold ">
          Search Your Youtube Playlist
        </h1>
        <form
          action=""
          className="flex justify-center items-center gap-2 w-full md:w-[60%] lg:w-[50%]"
          onSubmit={handleSubmit}
        >
          <Input
            name="search"
            type="text"
            placeholder="Search Your Playlist From Youtube"
          />
          <Button>Search</Button>
        </form>
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="rounded-2xl shadow-md p-2 hover:shadow-lg transition"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full rounded-xl"
              />
              <h2 className="mt-2 text-sm font-medium">{video.title}</h2>
              <p className="text-xs text-gray-500">{video.channel}</p>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
