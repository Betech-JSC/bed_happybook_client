import type { Metadata } from "next";
import { Suspense } from "react";
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
import { MenuProvider } from "@/contexts/MenuContext";
import MobileMenuOverlay from "@/components/layout/MobileMenuOverlay";
import SupportFloatingIcons from "@/components/layout/support-floating-icons";
import Script from "next/script";
import GTMNoScript from "@/components/base/GTMNoScript";
import ProgressBar from "@/components/layout/ProgressBar";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { TranslationProvider } from "../contexts/TranslationContext";
import PromoModal from "@/components/base/PromoModal";
import { AosProvider } from "@/components/layout/AosProvider";

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
        <Script id="gtm-script" strategy="lazyOnload">
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17408673405"
          strategy="afterInteractive"
        />
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
        {/* === Pancake live chat === */}
        <Script
          src="https://chat-plugin.pancake.vn/main/auto?page_id=web_happybookwebsite"
          strategy="lazyOnload"
        />
        {/* === End Pancake === */}

        {/* === End Pancake === */}

        <Script id="ms-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u1oyy7ej0g");
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '859144157116787');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=859144157116787&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={OpenSans.className}>
        <GTMNoScript />
        <Suspense fallback={null}>
          <ProgressBar color="#ea580c" height="3px" />
        </Suspense>
        <LanguageProvider serverLang={session.language}>
          <TranslationProvider translations={translations}>
            <AosProvider>
              <UserProvider initialUser={session.userInfo}>
                <MenuProvider>
                  <Header></Header>
                  <HeaderMobile></HeaderMobile>
                  <MobileMenuOverlay />
                  {/* <PromoModal /> */}
                  {children}
                  <Toaster toastOptions={toastOptions} />
                  <div id="datepicker-portal"></div>
                  <SupportFloatingIcons />
                  <BackToTopButton></BackToTopButton>
                  <Footer></Footer>
                  <LoadingProvider>
                    <AppLoader />
                  </LoadingProvider>
                </MenuProvider>
              </UserProvider>
            </AosProvider>
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
