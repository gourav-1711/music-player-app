"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigateToPage, PAGES } from "../store/features/navigationSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Header = () => {
  const dispatch = useDispatch();
  const placeholders = [
    "Trending Songs",
    "Best Released",
    "Most Popular",
    "Lofi And Chill Beats",
    "Best Mood Change Songs",
  ];

  const handleNavigateToPage = (page) => {
    dispatch(navigateToPage(page));
  };


  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0f0c1d] border-b border-[#1c1633]">
      {/* Left: Logo */}
      <div className="text-white text-xl font-bold tracking-wide">
        <a href="#" onClick={() => handleNavigateToPage(PAGES.HOME)}>
          Music Player
        </a>
      </div>

      {/* Center: Desktop Nav */}
      <nav className="hidden md:flex items-center justify-evenly gap-8 text-white text-sm font-medium">
        <a
          href="#explore"
          onClick={() => {
            handleNavigateToPage(PAGES.EXPLORE);
          }}
          className="hover:text-purple-400 transition"
        >
          Explore
        </a>
        <a
          href="#playlist"
          onClick={() => handleNavigateToPage(PAGES.PLAYLIST)}
          className="hover:text-purple-400 transition"
        >
          Playlists
        </a>
        <a
          href="#history"
          onClick={() => handleNavigateToPage(PAGES.HISTORY)}
          className="hover:text-purple-400 transition"
        >
          History
        </a>
        <a
          href="#favorite"
          onClick={() => handleNavigateToPage(PAGES.FAVORITE)}
          className="hover:text-purple-400 transition"
        >
          Favorite
        </a>
      </nav>

      {/* Right: Search + Avatar (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          className="rounded-lg bg-[#291f47] text-white px-4 py-2 placeholder:text-[#aaa] outline-none w-64"
        />
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="User" />
        </Avatar>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </header>
  );
};

export function MobileMenu() {
  const placeholders = [
    "Trending Songs",
    "Best Released",
    "Most Popular",
    "Lofi And Chill Beats",
    "Best Mood Change Songs",
  ];

  const { currentPage } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [currentPage]);
  const {showPlayer} = useSelector((state) => state.musicPlayer);


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className={`bg-blue-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border  text-white p-6 ${showPlayer ? "h-[calc(100vh-1rem)]" : "h-[calc(100vh-4rem)]"}`}
      >
        <div className="mt-10 border-t border-[#1c1633] pt-6 flex items-center gap-4">
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?img=32" />
          </Avatar>
          <span className="text-sm">Hello, User</span>
        </div>
        <div className="flex flex-col gap-6 mt-2 text-lg font-medium">
          <a
            href="#explore"
            onClick={() => dispatch(navigateToPage(PAGES.EXPLORE))}
            className="hover:text-purple-400"
          >
            Explore
          </a>
          <a
            href="#playlist"
            onClick={() => dispatch(navigateToPage(PAGES.PLAYLIST))}
            className="hover:text-purple-400"
          >
            Playlists
          </a>
          <a
            href="#history"
            onClick={() => dispatch(navigateToPage(PAGES.HISTORY))}
            className="hover:text-purple-400"
          >
            History
          </a>
          {/* fav */}
          <a href="#favorite" onClick={() => dispatch(navigateToPage(PAGES.FAVORITE))} className="hover:text-purple-400">Favorite</a>
        </div>
        <div className="flex items-center gap-4">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            className="rounded-lg bg-[#291f47] text-white px-4 py-2 placeholder:text-[#aaa] outline-none w-64"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
