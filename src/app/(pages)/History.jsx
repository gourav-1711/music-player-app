"use client";
import ExpandableCardDemo from "@/components/expandable-card-demo-grid";
import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { clearHistory } from "@/app/store/features/historySlice";

export default function History() {
  const dispatch = useDispatch();
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8  ">
      <div className="flex justify-between my-6">
        <h1 className="text-2xl font-bold text-white italic ">History</h1>
        <Button onClick={() => dispatch(clearHistory())}>
          Clear History
        </Button>
      </div>
      <div>
        <ExpandableCardDemo />
      </div>
    </div>
  );
}
