import { siteUrl } from "@/constants";
import { PostType } from "@/types/post";
import { Metadata } from "next";
import Script from "next/script";
import { BreadscrumbItemSchemaType } from "./BreadscrumbListSchema";
import { BlogTypes, blogUrl } from "@/utils/Urls";

type BlogPostingSchemaProps = {
  blog: PostType & { slug?: string };
  type: BlogTypes;
  breadscrumbItems: BreadscrumbItemSchemaType[];
};

export function BlogPostingSchema({
  breadscrumbItems,
  blog,
  type,
}: BlogPostingSchemaProps) {
  const breacdscrumbJson = {
    "@type": "BreadcrumbList",
    "@id": `${blogUrl(
      type,
      (blog?.alias || blog?.slug) as string,
      true
    )}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: { "@id": siteUrl, name: "Trang chủ" },
      },
      ...breadscrumbItems.map(({ name, url }, index) => ({
        "@type": "ListItem",
        position: index + 2,
        item: { "@id": url, name },
      })),
    ],
  };

  const persionJson = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Happy Book",
    url: `${siteUrl}/#person`,
    image: {
      "@type": "ImageObject",
      "@id": `${siteUrl}/logo-footer.svg`,
      url: `${siteUrl}/logo-footer.svg`,
      caption: "Happy Book",
      inLanguage: "vi",
    },
    sameAs: [siteUrl],
  };

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Person", "Organization"],
        "@id": `${siteUrl}/#person`,
        name: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/logo-footer.svg`,
          contentUrl: `${siteUrl}/logo-footer.svg`,
          caption: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
          inLanguage: "vi",
          width: "240",
        },
        image: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/logo-footer.svg`,
          contentUrl: `${siteUrl}/logo-footer.svg`,
          caption: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
          inLanguage: "vi",
          width: "240",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc",
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "vi",
      },
      {
        "@type": "ImageObject",
        "@id": blog?.image_url,
        url: blog?.image_url,
        width: "1200",
        height: "800",
        caption: blog?.title,
        inLanguage: "vi",
      },
      breacdscrumbJson,
      {
        "@type": "WebPage",
        "@id": `${blogUrl(
          type,
          (blog?.alias || blog?.slug) as string,
          true
        )}#webpage`,
        url: blogUrl(type, (blog?.alias || blog?.slug) as string, true),
        name: blog?.meta_title,
        datePublished: blog?.created_at,
        dateModified: blog?.updated_at,
        isPartOf: { "@id": `${siteUrl}#website` },
        primaryImageOfPage: {
          "@id": blog?.image_url,
        },
        inLanguage: "vi",
        breadcrumb: {
          "@id": `${blogUrl(
            type,
            (blog?.alias || blog?.slug) as string,
            true
          )}#breadcrumb`,
        },
      },
      persionJson,
      {
        "@type": "BlogPosting",
        headline: blog?.meta_title,
        keywords: blog?.keywords,
        datePublished: blog?.created_at,
        dateModified: blog?.updated_at,
        articleSection: "Blog",
        author: {
          "@id": `${siteUrl}#person`,
          name: "Happy Book",
        },
        publisher: { "@id": `${siteUrl}#person` },
        description: blog?.meta_description,
        name: blog?.meta_title,
        "@id": `${blogUrl(
          type,
          (blog?.alias || blog?.slug) as string,
          true
        )}#richSnippet`,
        isPartOf: {
          "@id": `${blogUrl(
            type,
            (blog?.alias || blog?.slug) as string,
            true
          )}#webpage`,
        },
        image: {
          "@id": blog?.image_url,
        },
        inLanguage: "vi",
        mainEntityOfPage: {
          "@id": `${blogUrl(
            type,
            (blog?.alias || blog?.slug) as string,
            true
          )}#webpage`,
        },
      },
    ],
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ldJson),
      }}
    />
  );
}
