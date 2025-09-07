import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata = {
  title: "Music App",
  description: "Music App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`antialiased dark bg-gray-800 overflow-x-hidden`}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
