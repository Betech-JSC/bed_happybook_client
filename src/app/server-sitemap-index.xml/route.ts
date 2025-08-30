// app/server-sitemap-index.xml/route.ts
import { getServerSideSitemapIndex } from "next-sitemap";

export async function GET(request: Request) {
  const api =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://api.happybooktravel.com";
  const sitemap = [];

  for (const type of [
    "pages",
    "news",
    "news_categories",
    "news_sub_categories",
    "visa",
    "tour",
    "hotel",
    "flight",
    "combo",
    "ticket",
    "yacht",
    "fast-track",
  ]) {
    sitemap.push(`${api}/sitemaps/sitemap_${type}.xml`);
  }

  return getServerSideSitemapIndex(sitemap);
}
