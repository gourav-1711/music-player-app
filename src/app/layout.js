import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata = {
  title: "Music App",
  description: "Music App",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={`antialiased dark bg-gray-900`}>
        
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
