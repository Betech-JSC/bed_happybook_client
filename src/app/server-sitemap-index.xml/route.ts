import { getServerSideSitemapIndex } from "next-sitemap";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://happybooktravel.com";

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
    "sim-du-lich",
    "fast-track",
    "business-lounge",
  ]) {
    sitemap.push(`${siteUrl}/sitemaps/sitemap_${type}.xml`);
  }

  return getServerSideSitemapIndex(sitemap);
}
