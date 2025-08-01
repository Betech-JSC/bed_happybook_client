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
import { LanguageProvider } from "../contexts/LanguageContext";
import { getSession } from "@/lib/session";
import { UserProvider } from "../contexts/UserContext";
import { LoadingProvider } from "../contexts/LoadingContext";
import SupportFloatingIcons from "@/components/layout/support-floating-icons";
import Script from "next/script";
import GTMNoScript from "@/components/base/GTMNoScript";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { TranslationProvider } from "../contexts/TranslationContext";

const OpenSans = Open_Sans({ subsets: ["vietnamese"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Happy Book",
    description: "Happy Book",
    robots: "index, follow",
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
  const translations = await getServerTranslations(session.language);
  return (
    <html lang={session.language}>
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* FB */}
        <meta
          name="facebook-domain-verification"
          content="x7vlq92evnjo5wwhxtpy922e3hu2ac"
        />
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T7CVWLJM');
          `}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Ads (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17408673405" strategy="afterInteractive" />
        <Script id="google-ads-script" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17408673405');
          `}
        </Script>

        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-17408673405"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17408673405');
          `,
          }}
        />
      </head>
      <body className={OpenSans.className}>
        <GTMNoScript />
        <LanguageProvider serverLang={session.language}>
          <TranslationProvider translations={translations}>
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
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
