"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "@/hooks/useTranslation";
import {
  findCheapestVariant,
  formatEsimMoney,
  getEsimVariantMoney,
  type EsimPackageView,
} from "@/app/sim-du-lich/lib/esim";
import { getSimDuLichDetailHref } from "@/app/sim-du-lich/lib/routes";

type FeaturedTab = {
  key: "viet-nam" | "quoc-te";
  labelKey: string;
  href: string;
  accentClassName: string;
  items: EsimPackageView[];
};

type Props = {
  tabs: FeaturedTab[];
  language: string;
  showTabButtons?: boolean;
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

const resolveFlagEmoji = (label: string) => {
  const normalizedLabel = normalizeText(label);

  const countryMap = [
    { name: "vietnam", code: "VN" },
    { name: "china", code: "CN" },
    { name: "korea", code: "KR" },
    { name: "japan", code: "JP" },
    { name: "thai lan", code: "TH" },
    { name: "thailand", code: "TH" },
    { name: "singapore", code: "SG" },
    { name: "malaysia", code: "MY" },
    { name: "indonesia", code: "ID" },
    { name: "laos", code: "LA" },
    { name: "australia", code: "AU" },
    { name: "new zealand", code: "NZ" },
    { name: "hong kong", code: "HK" },
    { name: "macao", code: "MO" },
    { name: "usa", code: "US" },
    { name: "united states", code: "US" },
    { name: "canada", code: "CA" },
    { name: "europe", code: "EU" },
  ];

  const matched = countryMap.find((item) => normalizedLabel.includes(item.name));
  if (!matched) return "🌐";

  return matched.code === "EU" ? "🌍" : getFlagEmoji(matched.code);
};

export default function SimFeaturedTabs({
  tabs,
  language,
  showTabButtons = true,
}: Props) {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState<FeaturedTab["key"]>(tabs[0]?.key ?? "viet-nam");
  const pricingLanguage = language || lang;

  const activeTabData = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) || tabs[0],
    [activeTab, tabs]
  );

  if (!activeTabData) return null;

  return (
    <Fragment>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[26px] lg:text-[38px] font-extrabold tracking-tight text-midnight-ink">
            {t("sim_noi_bat")}
          </h2>
          <p className="mt-2 text-sm lg:text-base text-steel-secondary max-w-2xl">
            {t("chon_nhanh_cac_goi_e_sim_noi_bat_cho_hanh_trinh_viet_nam_va_quoc_te")}
          </p>
        </div>

        <Link
          href={activeTabData.href}
          className="hidden lg:inline-flex items-center gap-3 rounded-2xl bg-[#EFF8FF] px-4 py-3 font-medium text-[#175CD3] transition-colors hover:bg-blue-100"
        >
          <span>{t("xem_tat_ca")}</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {showTabButtons ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl border px-5 py-3 text-sm lg:text-base font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-[#1570EF] text-white shadow-sm"
                    : "border-[#D0D5DD] bg-white text-steel-secondary hover:border-[#9FB3D9] hover:bg-slate-50"
                }`}
              >
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>
      ) : null}

      <Link
        href={activeTabData.href}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#EFF8FF] px-4 py-3 text-sm font-medium text-[#175CD3] transition-colors hover:bg-blue-100 lg:hidden"
      >
        <span>{t("xem_tat_ca")}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-7">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="overflow-visible"
        >
          <CarouselContent>
            {activeTabData.items.map((pkg) => {
              const cheapest = findCheapestVariant(pkg, pricingLanguage);
              const cheapestMoney = getEsimVariantMoney(cheapest, pricingLanguage);
              const flag = resolveFlagEmoji(pkg.coverage || pkg.destination || pkg.regionLabel);
              const categoryAlias = activeTabData.key;

              return (
                <CarouselItem
                  key={pkg.slug}
                  className="pl-4 basis-[88%] sm:basis-[62%] md:basis-[48%] lg:basis-1/4"
                >
                  <Link
                    href={getSimDuLichDetailHref(categoryAlias, pkg.slug)}
                    className="group block h-full"
                  >
                    <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                      <div
                        className={`relative min-h-[220px] overflow-hidden p-5 text-white ${activeTabData.accentClassName}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                            {t(activeTabData.labelKey)}
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
                            {pkg.title || pkg.destination}
                          </h3>
                          <p className="line-clamp-2 text-sm leading-6 text-white/85">
                            {pkg.subtitle || pkg.network || pkg.coverage}
                          </p>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent" />
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
                          <div className="text-sm text-steel-secondary">
                            {t("tu")}
                          </div>
                          <div className="text-right text-xl font-extrabold text-hb-coral">
                            {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
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
      </div>
    </Fragment>
  );
}
