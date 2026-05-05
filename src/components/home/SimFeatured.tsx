import { getServerLang } from "@/lib/session";
import { loadAllEsimPackages, loadEsimOptions } from "@/app/sim-du-lich/lib/esim-loader";
import { findCheapestVariant, getEsimVariantMoney, resolveEsimRegionPreset } from "@/app/sim-du-lich/lib/esim";
import SimFeaturedTabs from "./SimFeaturedTabs";

const sortFeaturedPackages = (items: any[]) =>
  [...items].sort((a, b) => {
    const featuredA = Number(Boolean(a.isFeatured));
    const featuredB = Number(Boolean(b.isFeatured));
    if (featuredA !== featuredB) return featuredB - featuredA;

    const cheapestA = findCheapestVariant(a, "vi");
    const cheapestB = findCheapestVariant(b, "vi");
    const priceA = cheapestA ? getEsimVariantMoney(cheapestA, "vi").price : Number.POSITIVE_INFINITY;
    const priceB = cheapestB ? getEsimVariantMoney(cheapestB, "vi").price : Number.POSITIVE_INFINITY;
    if (priceA !== priceB) return priceA - priceB;

    return String(a.slug || "").localeCompare(String(b.slug || ""));
  });

const limitFeaturedPackages = (items: any[], size = 8) => sortFeaturedPackages(items).slice(0, size);

export default async function SimFeatured() {
  const language = await getServerLang();
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

  const tabs = [
    {
      key: "viet-nam" as const,
      labelKey: "sim_du_lich_viet_nam",
      href: "/sim-viet-nam",
      accentClassName: "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500",
      items: limitFeaturedPackages(domesticPackages),
    },
    {
      key: "quoc-te" as const,
      labelKey: "sim_du_lich_quoc_te",
      href: "/sim-du-lich/quoc-te",
      accentClassName: "bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500",
      items: limitFeaturedPackages(internationalPackages),
    },
  ].filter((tab) => tab.items.length > 0);

  if (!tabs.length) return null;

  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <section
        className="relative overflow-hidden rounded-3xl border border-[#DCE7FF] px-4 py-6 lg:px-8 lg:py-10"
        style={{
          background:
            "linear-gradient(180deg, #FCFCFD 0%, rgba(230, 238, 255, 0.92) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(23,85,220,0.08),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(242,113,69,0.10),_transparent_30%)]" />
        <div className="relative z-10">
          <SimFeaturedTabs tabs={tabs} language={language} />
        </div>
      </section>
    </div>
  );
}
