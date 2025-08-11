"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { PlaylistCard } from "../comman/PlaylistCard";
export default function Explore() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("/api/explore");

  const search = useSelector((state) => state.search.search);

  useEffect(() => {
    setLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong");
        setLoading(false);
        setData([]);
      });
  }, [apiUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "" && search !== null && search !== undefined) {
        setApiUrl(`/api/search?search=${search}`);
      } else {
        setApiUrl("/api/explore");
      }
    }, 1000); // Add debounce to prevent too many requests

    return () => clearTimeout(timer);
  }, [search]);


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-4 py-4  items-center">
        <div className="flex flex-col ">
          <h1 className="text-2xl font-bold text-white">
            Explore Your Favorite Music{" "}
          </h1>
          <span className="text-gray-400 text-sm">
            Discover new music and artists
          </span>
        </div>
        <div className="">
          <ArrowRight size={24} className="text-white" />
        </div>
      </div>
      <div className="">
        {loading ? (
          <div className="">
            <Skeleton className="h-screen" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.length > 0 && data.map((item , index) => (
              <PlaylistCard  item={item} key={index} mode={search.length > 0 ? "search" : ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
