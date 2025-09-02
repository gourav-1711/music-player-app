"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { Header } from "./comman/Header";
import MusicPlayer from "./(pages)/MusicPlayer";
import { Toaster } from "sonner";
import { useEffect } from "react";

export default function ClientLayoutWrapper({ children }) {
  // useEffect(() => {
  //   console.clear();
  //   setTimeout(() => {
  //     console.clear();
  //   }, 1000);
  // }, []);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen flex flex-col bg-gray-900">
          <Header />
          <main className="flex-1">{children}</main>
          <MusicPlayer />
          <Toaster  richColors  closeButton={true} theme="dark"/>
        </div>
      </PersistGate>
    </Provider>
  );
}
