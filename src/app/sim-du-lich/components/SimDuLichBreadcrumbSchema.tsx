import Script from "next/script";
import { siteUrl } from "@/constants";

export type SimDuLichBreadcrumbSchemaItem = {
  url: string;
  name: string;
};

type Props = {
  items: SimDuLichBreadcrumbSchemaItem[];
};

export default function SimDuLichBreadcrumbSchema({ items }: Props) {
  if (!items.length) return null;

  return (
    <Script
      id="sim-du-lich-breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": siteUrl,
                name: "Trang chủ",
              },
            },
            ...items.map(({ name, url }, index) => ({
              "@type": "ListItem",
              position: index + 2,
              item: {
                "@id": url,
                name,
              },
            })),
          ],
        }),
      }}
    />
  );
}
