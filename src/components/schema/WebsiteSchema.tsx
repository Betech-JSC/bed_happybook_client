import { settingApi } from "@/api/Setting";
import { siteUrl } from "@/constants";
import { getServerLang } from "@/lib/session";
import Script from "next/script";

export type WebsiteSchemaProps = {
  title?: string;
  description?: string;
};

export async function WebsiteSchema({
  title,
  description,
}: WebsiteSchemaProps) {
  const seo = await settingApi.getCachedMetaSeo();
  // const seo = res?.payload?.data;

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
                streetAddress: seo?.seo_address,
                addressCountry: "VN",
              },
              openingHours: [seo?.seo_opening_hours],
              review: {
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: 5,
                  bestRating: 5,
                },
                author: {
                  "@type": "Person",
                  name: "Happy Book",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 5,
                reviewCount: 10,
              },
              sameAs: [
                siteUrl,
                seo?.seo_link_twitter,
                seo?.seo_link_fb,
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
              name: seo?.seo_title,
              url: siteUrl,
              logo: `${siteUrl}/logo-footer.svg`,

              contactPoint: {
                "@type": "ContactPoint",
                telephone: seo?.seo_hotline,
                contactType: "Hotline",
                availableLanguage: "Vietnamese",
                areaServed: "VN",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: seo?.seo_address,
                // postalCode: "700000",
                addressCountry: "VN",
              },
              sameAs: [
                siteUrl,
                seo?.seo_link_twitter,
                seo?.seo_link_fb,
                // "https://www.facebook.com/yourorganization",
                // "https://twitter.com/yourorganization",
                // "https://www.linkedin.com/company/yourorganization",
              ],
              image: `${siteUrl}/logo-footer.svg`,
            },
            {
              "@type": "TravelAgency",
              "@id": `${siteUrl}/#travelagency`,
              name: seo?.seo_title,
              url: siteUrl,
              logo: `${siteUrl}/logo-footer.svg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: seo?.seo_address,
                // streetAddress: "Tầng 1, Phong Phú Tower, 93/10 Quang Trung",
                // addressLocality: "KP.1, P.Hiệp Phú, TP.Thủ Đức",
                // addressRegion: "TP.HCM",
                // postalCode: "700000",
                addressCountry: "VN",
              },
              telephone: seo?.seo_phone,
              openingHours: [seo?.seo_opening_hours],
              review: {
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: 5,
                  bestRating: 5,
                },
                author: {
                  "@type": "Person",
                  name: "Happy Book",
                },
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 5,
                reviewCount: 10,
              },
              // paymentAccepted: "Credit Card, Cash",
              sameAs: [
                siteUrl,
                seo?.seo_link_twitter,
                seo?.seo_link_fb,
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
