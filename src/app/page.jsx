"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner from "./comman/Banner";
import CardSlider from "./comman/CardSlider";



export default function HomePage() {
  const [bannerData, setBannerData] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);

  const [trendingData, setTrendingData] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  const [globalData, setGlobalData] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const [popularData, setPopularData] = useState([]);
  const [popularLoading, setPopularLoading] = useState(false);

  useEffect(() => {
    setBannerLoading(true);
    axios
      .get("/api/music/banner")
      .then((res) => {
        setBannerData(res.data.items);
        setBannerLoading(false);
      })
      .catch((err) => {
        setBannerData([]);
        setBannerLoading(false);
      });
  }, []);

  useEffect(() => {
    const trending = () => {
      setTrendingLoading(true);
      axios
        .get("/api/music/trending")
        .then((res) => {
          setTrendingData(res.data);
          setTrendingLoading(false);
        })
        .catch((err) => {
          setTrendingData([]);
          setTrendingLoading(false);
        });
    };
    trending();
  }, []);

  useEffect(() => {
    const global = () => {
      setGlobalLoading(true);
      axios
        .get("/api/music/global")
        .then((res) => {
          setGlobalData(res.data);
          setGlobalLoading(false);
        })
        .catch((err) => {
          setGlobalData([]);
          setGlobalLoading(false);
        });
    };
    global();
  }, []);

  useEffect(() => {
    const popular = () => {
      setPopularLoading(true);
      axios
        .get("/api/music/most-popular")
        .then((res) => {
          setPopularData(res.data);
          setPopularLoading(false);
        })
        .catch((err) => {
          setPopularData([]);
          setPopularLoading(false);
        });
    };
    popular();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-24">
      <Banner data={bannerData} loading={bannerLoading} />

      <CardSlider
        dataObject={trendingData}
        loading={trendingLoading}
        title={"Trending"}
      />

      <CardSlider
        dataObject={globalData}
        loading={globalLoading}
        title={"Global Release"}
      />

      <CardSlider
        dataObject={popularData}
        loading={popularLoading}
        title={"Most Popular"}
      />
    </div>
  );
}
