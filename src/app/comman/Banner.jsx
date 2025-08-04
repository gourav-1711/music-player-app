import axios from "axios";
import React, { useEffect } from "react";

export default function Banner({ data }) {
 
  const url =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZE7OtM4Qek7Xs9j2PdU2mslZgSmLXUfnRrLZ0SG1gFzu45F2u6L30UT0FwesZbBJD4cmqq8DKQc9bhkAVl9L34uhE-uR2ztMfC6hOFEer0IFi3S--gMRjVKOqs99UlFYdH6GjwbxTacngAMScs2pOiJfHMjpZ-MsQK5o1xrIgBasTsuAEKxnCOf2WdVlvqakhnlRa8vu9r2NGleEsS4E6wZsX8cSd6yizB9tu5htMCzhV03t6pVdA738uTZuSn5awML6Y9DGJU9A";
  return (
    <div className="bg-[#0f0c1d] w-[95%] lg:w-[100%] max-w-[1000px] mx-auto p-0 rounded-2xl relative h-[40vh] overflow-hidden my-5">
      <img
        src={url}
        alt=""
        className="w-full h-[40vh] object-cover object-center"
      />
      <h3 className=" absolute bottom-4 left-4 text-3xl font-bold text-shadow-2xs ">
        {"banner title 1"}
      </h3>
    </div>
  );
}
