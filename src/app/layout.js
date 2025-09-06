import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata = {
  title: "Music App",
  description: "Music App",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={`antialiased dark overflow-x-hidden`}>
        
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
