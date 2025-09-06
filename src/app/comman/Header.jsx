"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updater } from "@/lib/updater";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change 50px to your threshold
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dispatch = useDispatch();
  const placeholders = [
    "Trending Songs",
    "Best Released",
    "Most Popular",
    "Lofi And Chill Beats",
    "Best Mood Change Songs",
  ];

  const isLogin = useSelector((state) => state.auth.isLogin);

  const favoriteSongs = useSelector((state) => state.favorite.favorite);
  const history = useSelector((state) => state.history.history);

  //

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    const data = {};
    if (favoriteSongs?.length > 0) {
      data.favoriteSongs = favoriteSongs;
    }
    if (history?.length > 0) {
      data.history = history;
    }
    updater(data);
    return;
  }, [favoriteSongs, history, isLogin]);

  return (
    <header
      className={`sticky top-0 flex items-center justify-between px-6  
  rounded-2xl border border-white/20 z-[50]
  bg-gradient-to-r from-gray-800/20 via-gray-500/10 to-gray-800/20 
  backdrop-blur-md shadow-lg duration-300 max-w-[100%] mx-auto ${
    scrolled ? "bg-gray-800/50 py-3 w-[95%] my-2" : "py-4 w-[100%]"
  }`}
    >
      {/* Left: Logo */}
      <div className="text-white text-xl font-bold tracking-wide">
        <Link href={"/"}>Music Player</Link>
      </div>

      {/* Center: Desktop Nav */}
      <nav className="hidden md:flex items-center justify-evenly gap-8 text-white text-sm font-medium">
        <Link href="/explore" className="hover:text-purple-400 transition">
          Explore
        </Link>
        <Link href="/playlist" className="hover:text-purple-400 transition">
          Playlists
        </Link>
        <Link href={"/history"} className="hover:text-purple-400 transition">
          History
        </Link>

        <Link href="/favorite" className="hover:text-purple-400 transition">
          Favorite
        </Link>
      </nav>

      {/* Right: Search + Avatar (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          className="rounded-2xl border border-white/20 
             bg-gradient-to-r from-white/20 via-white/10 to-white/20 
             backdrop-blur-md shadow-inner 
             text-white placeholder:text-white/60 
             px-4 py-2 w-64 outline-none 
             focus:border-white/40 focus:shadow-lg transition"
        />

        {isLogin ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-purple-600 p-3 text-2xl sm:text-3xl font-bold">
                  {"U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Hello, User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile?tab=profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href="/profile?tab=settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <Link href="/profile?tab=logout">
                <DropdownMenuItem>LogOut</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="text-white">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
                <Menu className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Not Registered</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/login-register?tab=register">
                  <DropdownMenuItem>Register</DropdownMenuItem>
                </Link>
                <Link href="/login-register?tab=login">
                  <DropdownMenuItem>Login</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </header>
  );
};

export function MobileMenu() {
  const { showPlayer } = useSelector((state) => state.musicPlayer);

  const isLogin = useSelector((state) => state.auth.isLogin);

  const router = useRouter();

  const path = usePathname();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  //

  // header work
  const placeholders = [
    "Trending Songs",
    "Best Released",
    "Most Popular",
    "Lofi And Chill Beats",
    "Best Mood Change Songs",
  ];

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className={`bg-blue-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border  text-white p-6 z-[100000] h-[90vh] `}
      >
        <SheetHeader className={"invisible opacity-0 w-0 h-0 overflow-hidden"}>
          <SheetTitle>Mobile Menu</SheetTitle>
        </SheetHeader>
        <div className=" border-t border-[#1c1633] pt-2 flex items-center gap-4">
          {isLogin ? (
            <Link href="/profile?tab=profile">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-purple-600 p-3 text-2xl sm:text-3xl font-bold">
                  {"U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link href="/login-register?tab=login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-purple-400 transition-all duration-300 text-lg"
                >
                  Login
                </Button>
              </Link>
              <span className="text-white text-md font-medium">or &nbsp;</span>
              <Link href="/login-register?tab=register">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-purple-400 transition-all duration-300 text-lg"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
          {isLogin && <span className="text-sm">Hello, User</span>}
        </div>
        <div className="flex flex-col gap-4 mt-1 text-lg font-medium">
          <Link href="/explore" className="hover:text-purple-400">
            Explore
          </Link>
          <Link href="/playlist" className="hover:text-purple-400">
            Playlists
          </Link>
          <Link href="/history" className="hover:text-purple-400">
            History
          </Link>
          {/* fav */}
          <Link href="/favorite" className="hover:text-purple-400">
            Favorite
          </Link>
          {isLogin && (
            <Link href="/profile?tab=logout">
              <Button>LogOut</Button>
            </Link>
          )}
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
