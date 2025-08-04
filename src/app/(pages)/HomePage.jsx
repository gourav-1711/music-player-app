"use client";
import React, { useEffect, useState } from "react";
import CardSlider from "../comman/CardSlider";
import axios from "axios";
import Banner from "../comman/Banner";

export default function HomePage() {
  const [trendingData, setTrendingData] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  const [globalData, setGlobalData] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const [popularData, setPopularData] = useState([]);
  const [popularLoading, setPopularLoading] = useState(false);



  useEffect(() => {
    const trending = () => {
      setTrendingLoading(true);
      axios
        .get("/api/trending")
        .then((res) => {
          setTrendingData(res.data);
          setTrendingLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setTrendingData([]);
          setTrendingLoading(false);
        });
    };
    trending();
  }, []);

  useEffect(() => {
    const global = () => {
      setTrendingLoading(true);
      axios
        .get("/api/global")
        .then((res) => {
          setGlobalData(res.data);
          setGlobalLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setGlobalData([]);
          setGlobalLoading(false);
        });
    };
    global();
  }, []);

  useEffect(() => {
    const global = () => {
      setTrendingLoading(true);
      axios
        .get("/api/most-popular")
        .then((res) => {
          setPopularData(res.data);
          console.log(res.data);
          
          setPopularLoading(false);
        })
        .catch((err) => {
          console.log( "most popular" ,  err);
          setPopularData([]);
          setPopularLoading(false);
        });
    };
    global();
  }, []);



  return (
    <>
      <Banner />
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

    </>
  );
}
