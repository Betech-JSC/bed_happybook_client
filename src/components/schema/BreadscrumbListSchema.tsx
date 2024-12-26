import { siteUrl } from "@/constants";
import Script from "next/script";

export type BreadscrumbListSchemaProps = {
  items: { item: string; name: string }[];
};

export function BreadscrumbListSchema({ items }: BreadscrumbListSchemaProps) {
  return (
    <Script
      id="breadcrumb-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: siteUrl,
              item: "Trang chủ",
            },
            ...items.map(({ name, item }, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name,
              item,
            })),
          ],
        }),
      }}
    />
  );
}
