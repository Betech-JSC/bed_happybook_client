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

export default function SeoSchema({
  breadscrumbItems,
  children,
  ...props
}: BlogPostingSchemaProps) {
  const metadata = (props as ArticleStaticSchemaType)?.metadata;
  const product = (props as ProductSchemaType)?.product;
  const blog = (props as BlogPostingSchemaType)?.blog;
  const article = (props as ArticleSchemaType)?.article;
  const type = (
    props as ArticleSchemaType | BlogPostingSchemaType | ProductSchemaType
  )?.type;

  const siteName = "Happy Book 🎉 Đại Lý Đặt Vé Máy Bay Giá Rẻ #1 Toàn Quốc";

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
        name: siteName,
        logo: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/logo-footer.svg`,
          contentUrl: `${siteUrl}/logo-footer.svg`,
          caption: siteName,
          inLanguage: "vi",
          width: "240",
        },
        image: {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          url: `${siteUrl}/logo-footer.svg`,
          contentUrl: `${siteUrl}/logo-footer.svg`,
          caption: siteName,
          inLanguage: "vi",
          width: "240",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "vi",
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
        inLanguage: "vi",
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
        inLanguage: "vi",
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
        inLanguage: "vi",
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
        inLanguage: "vi",
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
        inLanguage: "vi",
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
        inLanguage: "vi",
      },
      breacdscrumbJson,
      {
        "@type": "ItemPage",
        "@id": `${url}#webpage`,
        url: url,
        name: product?.meta_title,
        datePublished: product?.created_at,
        dateModified: product?.updated_at,
        isPartOf: { "@id": `${siteUrl}#website` },
        primaryImageOfPage: {
          "@id": product?.image_url,
        },
        inLanguage: "vi",
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },
      persionJson,
      {
        "@type": "Product",
        name: product?.meta_title,
        description: product?.meta_description,
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
