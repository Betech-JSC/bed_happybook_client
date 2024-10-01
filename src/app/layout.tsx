import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeaderMobile from "@/components/header-mobile";
import BackToTopButton from "@/components/back-top-btn";

const OpenSans = Open_Sans({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://client.happybooktravel.com"),
  title: "Happy Book",
  description: "Happy Book",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: "/logo-footer.png",
  },
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
        <meta
          property="og:url"
          content="https://bed-happybook-client.onrender.com"
        />
        <meta
          property="og:image"
          content="https://bed-happybook-client.onrender.com/logo-footer.svg"
        />
        <meta property="og:type" content="website" />
      </head>
      <body className={OpenSans.className}>
        <Header></Header>
        <HeaderMobile></HeaderMobile>
        {children}
        <BackToTopButton></BackToTopButton>
        <Footer></Footer>
      </body>
    </html>
  );
}
