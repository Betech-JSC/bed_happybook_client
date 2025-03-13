import { siteUrl } from "@/constants";
import Script from "next/script";

export type WebsiteSchemaProps = {
  title?: string;
  description?: string;
};

export function WebsiteSchema({ title, description }: WebsiteSchemaProps) {
  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${siteUrl}#website`,
              name: title,
              url: siteUrl,
              description: description,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}?s={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "LocalBusiness",
              "@id": `${siteUrl}#localbusiness`,
              name: title,
              description,
              url: siteUrl,
              logo: `${siteUrl}/logo-footer.svg`,
              telephone: "+84-983-488-937",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tầng 1, Phong Phú Tower, 93/10 Quang Trung",
                addressLocality: "KP.1, P.Hiệp Phú, TP.Thủ Đức",
                addressRegion: "TP.HCM",
                postalCode: "700000",
                addressCountry: "VN",
              },
              openingHours: ["Mo-Fr 07:30-17:30"],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                bestRating: "5",
                // ratingCount: "10",
              },
              sameAs: [
                siteUrl,
                // "https://www.facebook.com/yourbusiness",
                // "https://twitter.com/yourbusiness",
                // "https://www.instagram.com/yourbusiness",
              ],
              image: `${siteUrl}/logo-footer.svg`,
              parentOrganization: {
                "@id": `${siteUrl}#organization`,
              },
            },
            {
              "@type": "Organization",
              "@id": `${siteUrl}#organization`,
              name: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
              url: siteUrl,
              logo: `${siteUrl}/logo-footer.svg`,

              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-983-488-937",
                contactType: "Hotline",
                availableLanguage: "Vietnamese",
                areaServed: "VN",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tầng 1, Phong Phú Tower, 93/10 Quang Trung",
                addressLocality: "KP.1, P.Hiệp Phú, TP.Thủ Đức",
                addressRegion: "TP.HCM",
                postalCode: "700000",
                addressCountry: "VN",
              },
              sameAs: [
                siteUrl,
                // "https://www.facebook.com/yourorganization",
                // "https://twitter.com/yourorganization",
                // "https://www.linkedin.com/company/yourorganization",
              ],
              image: `${siteUrl}/logo-footer.svg`,
            },
            {
              "@type": "TravelAgency",
              "@id": `${siteUrl}/#travelagency`,
              name: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
              url: siteUrl,
              logo: `${siteUrl}/logo-footer.svg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tầng 1, Phong Phú Tower, 93/10 Quang Trung",
                addressLocality: "KP.1, P.Hiệp Phú, TP.Thủ Đức",
                addressRegion: "TP.HCM",
                postalCode: "700000",
                addressCountry: "VN",
              },
              telephone: "+84-983-488-937",
              openingHours: ["Mo-Fr 07:30-17:30"],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                bestRating: "5",
                // ratingCount: "10",
              },
              // paymentAccepted: "Credit Card, Cash",
              sameAs: [
                siteUrl,
                // "https://www.facebook.com/adventuretravels",
                // "https://www.twitter.com/adventuretravels",
              ],
            },
          ],
        }),
      }}
    />
  );
}
