import { siteUrl } from "@/constants";
import { PostType } from "@/types/post";
import { Metadata } from "next";
import Script from "next/script";
import { BreadscrumbItemSchemaType } from "./BreadscrumbListSchema";
import {
  BlogTypes,
  blogUrl,
  pageUrl,
  ProductTypes,
  productUrl,
} from "@/utils/Urls";
import { settingApi } from "@/api/Setting";
import { getServerLang } from "@/lib/session";

type BlogPostingSchemaType = {
  blog: PostType & { slug?: string };
  type: BlogTypes;
  breadscrumbItems: BreadscrumbItemSchemaType[];
};

type ArticleSchemaType = {
  article: any;
  type: BlogTypes;
  breadscrumbItems: BreadscrumbItemSchemaType[];
};

type ProductSchemaType = {
  product: any;
  breadscrumbItems: BreadscrumbItemSchemaType[];
  type: ProductTypes;
};

type ArticleStaticSchemaType = {
  metadata?: Metadata;
  breadscrumbItems: BreadscrumbItemSchemaType[];
  type?: undefined;
};

type BlogPostingSchemaProps = {
  children: React.ReactNode;
} & (
  | ArticleStaticSchemaType
  | BlogPostingSchemaType
  | ArticleSchemaType
  | ProductSchemaType
);

export default async function SeoSchema({
  breadscrumbItems,
  children,
  ...props
}: BlogPostingSchemaProps) {
  const language = await getServerLang();
  const res = await settingApi.getMetaSeo();
  const seo = res?.payload?.data;

  const metadata = (props as ArticleStaticSchemaType)?.metadata;
  const product = (props as ProductSchemaType)?.product;
  const blog = (props as BlogPostingSchemaType)?.blog;
  const article = (props as ArticleSchemaType)?.article;
  const type = (
    props as ArticleSchemaType | BlogPostingSchemaType | ProductSchemaType
  )?.type;

  const siteName = seo?.seo_title;

  const breacdscrumbJson = {
    "@type": "BreadcrumbList",
    "@id": "",
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
      inLanguage: language,
    },
    sameAs: [siteUrl],
  };

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo-footer.svg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: seo?.seo_address,
          addressCountry: "VN",
        },
        telephone: seo?.seo_phone,
        openingHours: [seo?.seo_opening_hours],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
          ratingCount: "10",
          reviewCount: "10",
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
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: language,
      },
      {
        "@type": "TravelAgency",
        "@id": `${siteUrl}/#travelagency`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo-footer.svg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: seo?.seo_address,
          addressCountry: "VN",
        },
        telephone: seo?.seo_phone,
        openingHours: [seo?.seo_opening_hours],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
          ratingCount: "10",
          reviewCount: "10",
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
  };

  if (metadata || article) {
    const url =
      metadata?.alternates?.canonical ||
      pageUrl(article?.alias || article?.slug || "", type, true);

    breacdscrumbJson["@id"] = `${url}#breadcrumb`;
    const articleJson: Array<any> = [
      breacdscrumbJson,
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: metadata?.title || article?.title || article?.meta_title,
        datePublished: article?.created_at || new Date().toISOString(),
        dateModified: article?.updated_at || new Date().toISOString(),
        isPartOf: { "@id": `${siteUrl}#website` },
        inLanguage: language,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },
      persionJson,
      {
        "@type": "Article",
        headline: metadata?.title || article?.meta_title,
        keywords: metadata?.keywords || article?.keywords,
        datePublished: article?.created_at || new Date().toISOString(),
        dateModified: article?.updated_at || new Date().toISOString(),
        author: {
          "@id": `${siteUrl}#person`,
          name: "Happy Book",
        },
        publisher: { "@id": `${siteUrl}#person` },
        description: metadata?.description || article?.meta_description,
        name: metadata?.title || article?.meta_title,
        "@id": `${url}#richSnippet`,
        isPartOf: {
          "@id": `${url}#webpage`,
        },
        inLanguage: language,
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
      },
    ];

    ldJson["@graph"].push(...articleJson);
  } else if (blog) {
    const url = blogUrl(type as BlogTypes, blog?.slug || blog?.alias, true);

    breacdscrumbJson["@id"] = `${url}#breadcrumb`;
    const blogJson: Array<any> = [
      {
        "@type": "ImageObject",
        "@id": blog?.image_url,
        url: blog?.image_url,
        width: "1200",
        height: "800",
        caption: blog?.title,
        inLanguage: language,
      },
      breacdscrumbJson,
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: blog?.meta_title,
        datePublished: blog?.created_at,
        dateModified: blog?.updated_at,
        isPartOf: { "@id": `${siteUrl}#website` },
        primaryImageOfPage: {
          "@id": blog?.image_url,
        },
        inLanguage: language,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
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
        "@id": `${url}#richSnippet`,
        isPartOf: {
          "@id": `${url}#webpage`,
        },
        image: {
          "@id": `${blog.image_url}${blog.image_location}`,
        },
        inLanguage: language,
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
      },
    ];

    ldJson["@graph"].push(...blogJson);
  } else if (product) {
    const url = productUrl(
      type as ProductTypes,
      product?.slug || product?.alias,
      true
    );

    breacdscrumbJson["@id"] = `${url}#breadcrumb`;
    const productJson: Array<any> = [
      {
        "@type": "ImageObject",
        "@id": product?.image_url,
        url: product?.image_url,
        width: "1200",
        height: "800",
        caption: product?.title,
        inLanguage: language,
      },
      breacdscrumbJson,
      {
        "@type": "ItemPage",
        "@id": `${url}#webpage`,
        url: url,
        name: product?.meta_title || product?.name,
        datePublished: product?.created_at,
        dateModified: product?.updated_at,
        isPartOf: { "@id": `${siteUrl}#website` },
        primaryImageOfPage: {
          "@id": product?.image_url,
        },
        inLanguage: language,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },
      persionJson,
      {
        "@type": "Product",
        name: product?.meta_title || product?.name,
        description:
          product?.meta_description || product?.meta_title || product?.name,
        category: "Tour",
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
        image: product?.gallery?.map((v: any) => ({
          "@type": "ImageObject",
          url: `${v.image_url}${v.image}`,
          // height: "891",
          // width: "1200",
        })),
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "VND",
          priceValidUntil: product?.updated_at?.substr(0, 10),
          availability: "https://schema.org/InStock",
          itemCondition: "NewCondition",
          url: url,
          seller: persionJson,
        },
        "@id": `${url}#richSnippet`,
      },
    ];

    ldJson["@graph"].push(...productJson);
  }
  return (
    <>
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson),
        }}
      />
      {children}
    </>
  );
}
