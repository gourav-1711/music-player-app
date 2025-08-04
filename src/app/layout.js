"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./comman/Header";
import { AppProvider, useAppContext } from "./context/AppContext";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });



export default function RootLayout({ children }) {
  // const { currentTrack, showPlayer, setShowPlayer } = useAppContext();
  return (
    <html lang="en">
      <body
        className={` antialiased dark bg-gray-900`}
      >
        <AppProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
