"use client";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import store from "./store/store";
import { Provider } from "react-redux";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    console.clear();
    setTimeout(() => {
      console.clear();
    }, 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Music App</title>
        <meta name="description" content="Music App" />
      </head>
      <body className={`antialiased dark bg-gray-900`}>
        <Provider store={store}>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
