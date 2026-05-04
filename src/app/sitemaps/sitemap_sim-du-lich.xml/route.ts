import { getServerSideSitemap } from "next-sitemap";
import { siteUrl } from "@/constants";
import { loadAllEsimPackages, loadEsimOptions } from "@/app/sim-du-lich/lib/esim-loader";
import { resolveEsimRegionPreset } from "@/app/sim-du-lich/lib/esim";

export const dynamic = "force-dynamic";

const buildSitemapField = (loc: string, priority: number) => ({
  loc,
  lastmod: new Date().toISOString(),
  changefreq: "daily" as const,
  priority,
});

const buildStaticFields = () => [
  buildSitemapField(`${siteUrl}/sim-du-lich`, 0.9),
  buildSitemapField(`${siteUrl}/sim-viet-nam`, 0.9),
  buildSitemapField(`${siteUrl}/sim-du-lich/quoc-te`, 0.8),
];

export async function GET() {
  try {
    const language = "vi";
    const options = await loadEsimOptions(language);
    const internationalRegionId = resolveEsimRegionPreset(options.regions, "quoc-te");
    const domesticRegionId = resolveEsimRegionPreset(options.regions, "viet-nam");

    const [internationalPackages, domesticPackages] = await Promise.all([
      internationalRegionId
        ? loadAllEsimPackages({ region_id: internationalRegionId, locale: language })
        : Promise.resolve([]),
      domesticRegionId
        ? loadAllEsimPackages({ region_id: domesticRegionId, locale: language })
        : Promise.resolve([]),
    ]);

    const packageFields = [
      ...internationalPackages
        .filter((pkg) => pkg.slug)
        .map((pkg) => buildSitemapField(`${siteUrl}/sim-du-lich/quoc-te/${pkg.slug}`, 0.7)),
      ...domesticPackages
        .filter((pkg) => pkg.slug)
        .map((pkg) => buildSitemapField(`${siteUrl}/sim-viet-nam/${pkg.slug}`, 0.7)),
    ];

    const uniqueFields = Array.from(
      new Map([...buildStaticFields(), ...packageFields].map((field) => [field.loc, field])).values()
    );

    return getServerSideSitemap(uniqueFields);
  } catch {
    return getServerSideSitemap(buildStaticFields());
  }
}
