import ExpandableCardDemo from "@/components/expandable-card-demo-standard";
import React from "react";
import { useDispatch } from "react-redux";
import { clearFavorite } from "@/app/store/features/favoriteSlice";
import { Button } from "@/components/ui/button";

export default function Favorite() {
  const dispatch = useDispatch();
  return (
    <div className="max-w-6xl mx-auto p-6 w-[calc(100%-1rem)]">
      <div className="flex justify-between my-6">
        <h1 className="text-2xl font-bold text-white italic ">Favorite</h1>
        <Button onClick={() => dispatch(clearFavorite())}>Clear Favorite</Button>
      </div>
      <div>
        <ExpandableCardDemo />
      </div>
    </div>
  );
}
