"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { navigateToPage, PAGES } from "../store/features/navigationSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { logout } from "../store/features/auth";
import { toast } from "sonner";
import { updater } from "@/lib/updater";

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
  const currentPage = useSelector((state) => state.navigation.currentPage);

  const handleNavigateToPage = (page) => {
    dispatch(navigateToPage(page));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(navigateToPage(PAGES.HOME));
    toast("Logout successful");
  };

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
        <a href="" onClick={() => handleNavigateToPage(PAGES.HOME)}>
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
          className="rounded-2xl border border-white/20 
             bg-gradient-to-r from-white/20 via-white/10 to-white/20 
             backdrop-blur-md shadow-inner 
             text-white placeholder:text-white/60 
             px-4 py-2 w-64 outline-none 
             focus:border-white/40 focus:shadow-lg transition"
        />

        {isLogin ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://i.pravatar.cc/150?img=32"
                  alt="User"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Hello, User</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <a
                href="#profile"
                onClick={() => handleNavigateToPage(PAGES.PROFILE)}
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </a>
              <a
                href="#settings"
                onClick={() => handleNavigateToPage(PAGES.PROFILE)}
              >
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </a>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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
                <a
                  href="#register"
                  onClick={() => handleNavigateToPage(PAGES.LOGIN_REGISTER)}
                >
                  <DropdownMenuItem>Register</DropdownMenuItem>
                </a>
                <a
                  href="#login"
                  onClick={() => handleNavigateToPage(PAGES.LOGIN_REGISTER)}
                >
                  <DropdownMenuItem>Login</DropdownMenuItem>
                </a>
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

  const { currentPage } = useSelector((state) => state.navigation);
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
    if (open) {
      setOpen(false);
    }
  }, [currentPage]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className={`bg-blue-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border  text-white p-6 ${
          showPlayer ? "h-[calc(100vh-1rem)]" : "h-[calc(100vh-4rem)]"
        }`}
      >
        <div className="mt-10 border-t border-[#1c1633] pt-6 flex items-center gap-4">
          {isLogin ? (
            <a
              href="#profile"
              onClick={() => dispatch(navigateToPage(PAGES.PROFILE))}
            >
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://i.pravatar.cc/150?img=32" />
              </Avatar>
            </a>
          ) : (
            <>
              <a
                href="#login"
                onClick={() => dispatch(navigateToPage(PAGES.LOGIN_REGISTER))}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-purple-400 transition-all duration-300 text-lg"
                >
                  Login
                </Button>
              </a>
              <span className="text-white text-md font-medium">or &nbsp;</span>
              <a
                href="#register"
                onClick={() => dispatch(navigateToPage(PAGES.LOGIN_REGISTER))}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-purple-400 transition-all duration-300 text-lg"
                >
                  Register
                </Button>
              </a>
            </>
          )}
          {isLogin && <span className="text-sm">Hello, User</span>}
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
          <a
            href="#favorite"
            onClick={() => dispatch(navigateToPage(PAGES.FAVORITE))}
            className="hover:text-purple-400"
          >
            Favorite
          </a>
          {isLogin && (
            <Button onClick={() => dispatch(logout())}>LogOut</Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            className="rounded-lg bg-[#291f47] text-white px-4 py-2 placeholder:text-[#aaa] outline-none w-64"
          />
        </div>
        .
      </SheetContent>
    </Sheet>
  );
}
