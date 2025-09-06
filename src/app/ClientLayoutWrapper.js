"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { Header } from "./comman/Header";
import MusicPlayer from "./(pages)/MusicPlayer";
import { Toaster } from "sonner";

export default function ClientLayoutWrapper({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900">
          <MusicPlayer />
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster richColors closeButton={true} theme="dark" />
        </div>
      </PersistGate>
    </Provider>
  );
}
