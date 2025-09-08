"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Heart,
  Clock,
  ListMusic,
  User,
  Music,
  Github,
  Twitter,
} from "lucide-react";
import { useSelector } from "react-redux";

const Footer = () => {
  const pathname = usePathname();
  const isAuthenticated = useSelector((state) => state.auth.isLogin);

  // Common navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    {
      name: "Explore",
      path: "/explore",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      name: "Favorites",
      path: "/favorite",
      icon: <Heart className="w-5 h-5" />,
    },
    { name: "History", path: "/history", icon: <Clock className="w-5 h-5" /> },
    {
      name: "Playlists",
      path: "/playlist",
      icon: <ListMusic className="w-5 h-5" />,
    },
  ];

  // Add Profile link only if user is authenticated
  if (isAuthenticated) {
    navItems.push({
      name: "Profile",
      path: "/profile",
      icon: <User className="w-5 h-5" />,
    });
  } else {
    navItems.push({
      name: "Login",
      path: "/login-register",
      icon: <User className="w-5 h-5" />,
    });
  }

  const isActive = (path) =>
    pathname === path || (pathname.startsWith(path) && path !== "/");

  // Mobile Footer
  const MobileFooter = () => (
    <nav className="container mx-auto px-1 sm:px-4">
      <ul className="flex justify-around items-center h-16 flex-wrap">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1 flex justify-center">
            <Link
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full px-2 py-2 transition-colors duration-200 ${
                isActive(item.path)
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-400 rounded-full transform -translate-x-1/2" />
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Desktop Footer
  const DesktopFooter = () => (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Music Mania</span>
          </div>
          <p className="text-slate-400 text-sm">
            Your ultimate music streaming experience. Discover, play, and enjoy
            your favorite tracks.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/gourav-1711"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex">
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 flex gap-4 flex-wrap">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-sm transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-blue-400"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-sm">
        <p> {new Date().getFullYear()} Music Mania. All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Footer */}
      <footer className="block md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40">
        <MobileFooter />
      </footer>

      {/* Desktop Footer */}
      <footer className=" bg-slate-900 border-t border-slate-800">
        <DesktopFooter />
      </footer>
    </>
  );
};

export default Footer;
