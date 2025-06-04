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
import { LanguageProvider } from "./contexts/LanguageContext";
import { getSession } from "@/lib/session";
import { UserProvider } from "./contexts/UserContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import SupportFloatingIcons from "@/components/layout/support-floating-icons";

const OpenSans = Open_Sans({ subsets: ["vietnamese"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Happy Book",
    description: "Happy Book",
    robots: "noindex, nofollow",
    metadataBase: new URL("https://happybooktravel.com"),
    openGraph: {
      type: "website",
    },
  };
}
// export const metadata: Metadata = {
//   metadataBase: new URL("http://client.happybooktravel.com"),
//   title: "Happy Book",
//   description: "Happy Book",
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang={session.language}>
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head> */}
      <body className={OpenSans.className}>
        <LanguageProvider serverLang={session.language}>
          <UserProvider initialUser={session.userInfo}>
            <Header></Header>
            <HeaderMobile></HeaderMobile>
            {children}
            <Toaster toastOptions={toastOptions} />
            <div id="datepicker-portal"></div>
            <SupportFloatingIcons />
            <BackToTopButton></BackToTopButton>
            <Footer></Footer>
            <LoadingProvider>
              <AppLoader />
            </LoadingProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
