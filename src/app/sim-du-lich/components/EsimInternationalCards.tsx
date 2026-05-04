"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, Globe } from "lucide-react";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import {
  findCheapestVariant,
  formatEsimMoney,
  getEsimVariantMoney,
  type EsimPackageView,
} from "../lib/esim";
import { getSimDuLichDetailHref } from "../lib/routes";

type Props = {
  packages: EsimPackageView[];
  selectedPackageSlug?: string;
  activeLocale: "vi" | "en";
};

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const resolveCountryEmoji = (pkg: EsimPackageView) => {
  const text = normalizeText(`${pkg.destination} ${pkg.regionLabel} ${pkg.coverage}`);
  const countryMap = [
    { name: "vietnam", code: "VN" },
    { name: "japan", code: "JP" },
    { name: "korea", code: "KR" },
    { name: "china", code: "CN" },
    { name: "thailand", code: "TH" },
    { name: "thai lan", code: "TH" },
    { name: "singapore", code: "SG" },
    { name: "malaysia", code: "MY" },
    { name: "hong kong", code: "HK" },
    { name: "usa", code: "US" },
    { name: "united states", code: "US" },
    { name: "canada", code: "CA" },
    { name: "australia", code: "AU" },
    { name: "europe", code: "EU" },
  ];

  const matched = countryMap.find((item) => text.includes(item.name));
  if (!matched) return "🌐";
  return matched.code === "EU" ? "🌍" : getFlagEmoji(matched.code);
};

export default function EsimInternationalCards({
  packages,
  selectedPackageSlug,
  activeLocale,
}: Props) {
  const t = useSimDuLichStaticText(activeLocale);

  if (!packages.length) return null;

  return (
    <section className="mt-8 lg:mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hb-coral">
            eSIM
          </p>
          <h2 className="mt-2 text-[24px] lg:text-[32px] font-bold text-midnight-ink">
            {t("Khám phá eSIM quốc tế")}
          </h2>
          <p className="mt-2 text-sm lg:text-base text-steel-secondary">
            {t(
              "Chọn nhanh gói eSIM quốc tế nổi bật theo điểm đến, nhà mạng và thời lượng sử dụng."
            )}
          </p>
        </div>

        <Link
          href="/sim-du-lich/quoc-te"
          className="hidden lg:inline-flex items-center gap-2 rounded-2xl bg-[#EFF8FF] px-4 py-3 font-medium text-[#175CD3] transition-colors hover:bg-blue-100"
        >
          <span>{t("Xem tất cả")}</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <Link
        href="/sim-du-lich/quoc-te"
        className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-[#EFF8FF] px-4 py-3 text-sm font-medium text-[#175CD3] transition-colors hover:bg-blue-100 lg:hidden"
      >
        <span>{t("Xem tất cả")}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="overflow-visible"
      >
        <CarouselContent>
          {packages.map((pkg) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isActive = selectedPackageSlug === pkg.slug;
            const flag = resolveCountryEmoji(pkg);

            return (
              <CarouselItem
                key={pkg.slug}
                className="pl-4 basis-[88%] sm:basis-[62%] md:basis-[48%] lg:basis-1/4"
              >
                <Link
                  href={getSimDuLichDetailHref("quoc-te", pkg.slug)}
                  className="group block h-full"
                >
                  <div
                    className={`h-full overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
                      isActive ? "border-hb-coral ring-2 ring-orange-100" : "border-slate-200"
                    }`}
                  >
                    <div
                      className="relative min-h-[240px] overflow-hidden p-5 text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #155EEF 0%, #1D4ED8 38%, #0EA5E9 100%)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                          eSIM
                        </span>
                        <span className="text-3xl leading-none">{flag}</span>
                      </div>

                      <div className="mt-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                            <Globe className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-white/90">
                            {pkg.regionLabel || pkg.coverage}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight">
                          {pkg.destination || pkg.title}
                        </h3>

                        <p className="line-clamp-2 text-sm leading-6 text-white/85">
                          {pkg.subtitle || pkg.network || pkg.coverage}
                        </p>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap gap-2">
                        {cheapest?.validity ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {cheapest.validity} {t("ngay")}
                          </span>
                        ) : null}
                        {cheapest?.data ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {cheapest.data}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-end justify-between gap-3">
                        <div className="text-sm text-steel-secondary">{t("Tu")}</div>
                        <div className="text-right">
                          <div className="text-xs uppercase tracking-[0.18em] text-steel-secondary">
                            {t("Gia chi từ")}
                          </div>
                          <div className="text-xl font-extrabold text-hb-coral">
                            {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex -left-6 bg-white shadow-md hover:bg-slate-50" />
        <CarouselNext className="hidden lg:inline-flex -right-6 bg-white shadow-md hover:bg-slate-50" />
      </Carousel>
    </section>
  );
}
