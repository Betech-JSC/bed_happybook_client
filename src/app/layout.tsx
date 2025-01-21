import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeaderMobile from "@/components/layout/header-mobile";
import BackToTopButton from "@/components/layout/back-top-btn";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "@/lib/toastConfig";
import AppLoader from "@/components/layout/AppLoader";

const OpenSans = Open_Sans({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://client.happybooktravel.com"),
  title: "Happy Book",
  description: "Happy Book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
      </head>
      <body className={OpenSans.className}>
        <Header></Header>
        <HeaderMobile></HeaderMobile>
        {children}
        <Toaster toastOptions={toastOptions} />
        <div id="datepicker-portal"></div>
        <BackToTopButton></BackToTopButton>
        <Footer></Footer>
        {/* <AppLoader /> */}
      </body>
    </html>
  );
}
