import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeaderMobile from "@/components/header-mobile";

const OpenSans = Open_Sans({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: "Happy Book",
  description: "Happy Book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Happy Book" />
        <meta property="og:description" content="Happy Book" />
        <meta
          property="og:url"
          content="https://bed-happybook-client.onrender.com"
        />
        <meta
          property="og:image"
          content="https://bed-happybook-client.onrender.com/logo-footer.svg"
        />
        <meta property="og:type" content="website" />
        {/* Link */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={OpenSans.className}>
        <Header></Header>
        <HeaderMobile></HeaderMobile>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
