import { Metadata } from "next";
import Script from "next/script";

export type WebsiteSchemaProps = {
  title?: string;
  description?: string;
  url?: string;
  dateModified?: string;
};

export function WebsiteSchema({
  title,
  description,
  url,
  dateModified = "",
}: WebsiteSchemaProps) {
  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: title,
          alternateName: description,
          url,
          dateModified,
        }),
      }}
    />
  );
}
