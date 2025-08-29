// app/server-sitemap-index.xml/route.ts
import { getServerSideSitemapIndex } from "next-sitemap";

export async function GET(request: Request) {
  const api = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://api.happybooktravel.com";
  const sitemap = [
    `${api}/sitemap_news.xml`,
    `${api}/sitemap_news_categories.xml`,
    `${api}/sitemap_news_sub_categories.xml`,
  ];

  for (const type of ["visa", "tour", "hotel"]) {
    sitemap.push(`${api}/sitemap_${type}.xml`);
    sitemap.push(`${api}/sitemap_${type}_categories.xml`);
  }

  return getServerSideSitemapIndex(sitemap);
}
