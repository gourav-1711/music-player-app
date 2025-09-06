"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { PlaylistCard } from "./PlaylistCard";
import { LoaderIcon } from "lucide-react";

export default function CardSlider({ dataObject, title, loading }) {
  return (
    <>
      <div className="mx-width w-full select-none !py-0 ">
        <div className="title">
          <h5 className="text-white text-2xl font-bold mb-3.5">{title}</h5>
        </div>
        {loading ? (
          <div className="w-full h-[250px] flex justify-center items-center ">
            <LoaderIcon className="animate-spin size-10" />
          </div>
        ) : dataObject.length > 0 ? (
          <Swiper
            speed={600}
            slidesPerView={5}
            slidesPerViewGroup={5}
            spaceBetween={10}
            loop={true}
            loopFillGroupWithBlank={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
                slidesPerViewGroup: 1,
              },
              320: {
                slidesPerView: 2,
                slidesPerViewGroup: 2,
              },
              480: {
                slidesPerView: 2,
                slidesPerViewGroup: 2,
              },
              768: {
                slidesPerView: 3,
                slidesPerViewGroup: 3,
              },
              1024: {
                slidesPerView: 4,
                slidesPerViewGroup: 4,
              },
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper custom-swiper"
          >
            {dataObject.map((item, index) => {
              return (
                <SwiperSlide key={item.etag}>
                  <PlaylistCard item={item} mode={title} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <h4 className="text-gray-300 text-md text-center font-bold mb-3.5">
            Please Wait
          </h4>
        )}
      </div>
    </>
  );
}
