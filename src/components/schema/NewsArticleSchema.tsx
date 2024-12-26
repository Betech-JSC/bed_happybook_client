import { siteUrl } from "@/constants";
import { PostType } from "@/types/post";
import { newsDetailUrl } from "@/utils/Urls";
import Script from "next/script";

type NewsArticleSchemaProps = PostType;

export function NewsArticleSchema(props: NewsArticleSchemaProps) {
  return (
    <Script
      id="breadcrumb-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          <Script
            id="news-article-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "NewsArticle",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": newsDetailUrl(props.alias, true),
                },
                headline: props.title,
                description: props.description,
                image: {
                  "@type": "ImageObject",
                  url: props.image_url,
                  // width: 720,
                  // height: 480,
                },
                datePublished: props.created_at,
                dateModified: props.updated_at,
                author: {
                  "@type": "Person",
                  name: "Happy Book",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Happy Book",
                  logo: {
                    "@type": "ImageObject",
                    url: `${siteUrl}/logo-footer.svg`,
                    width: 240,
                  },
                },
              }),
            }}
          />
        ),
      }}
    />
  );
}
