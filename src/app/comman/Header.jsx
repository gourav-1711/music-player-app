import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
export const Header = () => {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  // const handleChange = (e) => {
  //   console.log(e.target.value);
  // };
  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("submitted");
  // };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0f0c1d] border-b border-[#1c1633]">
      {/* Left: Logo */}
      <div className="text-white text-xl font-bold tracking-wide">
        <Link href={"/"}>Music Player</Link>
      </div>

      {/* Center: Desktop Nav */}
      <nav className="hidden md:flex items-center justify-evenly gap-8 text-white text-sm font-medium">
        <Link href="/explore" className="hover:text-purple-400 transition">
          Explore
        </Link>
        <a href="#" className="hover:text-purple-400 transition">
          Playlists
        </a>
        <a href="#" className="hover:text-purple-400 transition">
          History
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
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#0f0c1d] text-white p-6">
        <div className="mt-10 border-t border-[#1c1633] pt-6 flex items-center gap-4">
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?img=32" />
          </Avatar>
          <span className="text-sm">Hello, User</span>
        </div>
        <div className="flex flex-col gap-6 mt-2 text-lg font-medium">
          <Link href="/explore" className="hover:text-purple-400">
            Explore
          </Link>
          <a href="#" className="hover:text-purple-400">
            Playlists
          </a>
          <a href="#" className="hover:text-purple-400">
            History
          </a>
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
