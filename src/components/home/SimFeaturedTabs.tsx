"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

type FlagResult = {
  type: "svg" | "emoji";
  value: string;
};

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

const ESCAPE_REGEX = /[|\\{}()[\]^$+*?.]/g;

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (str: string) => str.replace(ESCAPE_REGEX, "\\$&");

const DESTINATION_FLAG_MAP: Array<{ patterns: string[]; iso2: string }> = [
  { patterns: ["usa", "united states", "hoa ky", "hoaỳ kỳ"], iso2: "US" },
  { patterns: ["uk", "united kingdom", "vương quốc anh", "great britain", "britain"], iso2: "GB" },
  { patterns: ["uae", "united arab emirates", "ấn rập", "dubai"], iso2: "AE" },
  { patterns: ["korea", "south korea", "hàn quốc", "republic of korea"], iso2: "KR" },
  { patterns: ["hong kong", "hồng kông"], iso2: "HK" },
  { patterns: ["taiwan", "đài loan"], iso2: "TW" },
  { patterns: ["macau", "macao", "ma cao"], iso2: "MO" },
  { patterns: ["vietnam", "việt nam", "viet nam"], iso2: "VN" },
  { patterns: ["japan", "nhật bản", "nhat ban"], iso2: "JP" },
  { patterns: ["china", "trung quốc", "trung quoc"], iso2: "CN" },
  { patterns: ["thailand", "thai lan", "thái lan"], iso2: "TH" },
  { patterns: ["singapore"], iso2: "SG" },
  { patterns: ["malaysia"], iso2: "MY" },
  { patterns: ["indonesia"], iso2: "ID" },
  { patterns: ["laos", "lào", "lao"], iso2: "LA" },
  { patterns: ["australia", "úc"], iso2: "AU" },
  { patterns: ["new zealand", "new zealan"], iso2: "NZ" },
  { patterns: ["india", "ấn độ", "inđộ"], iso2: "IN" },
  { patterns: ["philippines", "filipin"], iso2: "PH" },
  { patterns: ["cambodia", "campuchia", "km"], iso2: "KH" },
  { patterns: ["brunei"], iso2: "BN" },
  { patterns: ["bangladesh"], iso2: "BD" },
  { patterns: ["russia", "nga", "russian"], iso2: "RU" },
  { patterns: ["turkey", "thổ nhĩ kỳ", "to nhi ky"], iso2: "TR" },
  { patterns: ["france", "pháp"], iso2: "FR" },
  { patterns: ["germany", "đức", "deutschland"], iso2: "DE" },
  { patterns: ["italy", "ý", "italia"], iso2: "IT" },
  { patterns: ["spain", "tây ban nha", "espana"], iso2: "ES" },
  { patterns: ["netherlands", "hà lan", "holland"], iso2: "NL" },
  { patterns: ["switzerland", "thụy sĩ", "schweiz"], iso2: "CH" },
  { patterns: ["portugal", "bồ đào nha"], iso2: "PT" },
  { patterns: ["poland", "ba lan"], iso2: "PL" },
  { patterns: ["austria", "áo"], iso2: "AT" },
  { patterns: ["belgium", "bỉ"], iso2: "BE" },
  { patterns: ["greece", "hy lạp"], iso2: "GR" },
  { patterns: ["czech", "cộng hòa séc"], iso2: "CZ" },
  { patterns: ["hungary", "hungari"], iso2: "HU" },
  { patterns: ["romania", "rumani"], iso2: "RO" },
  { patterns: ["sweden", "thụy điển"], iso2: "SE" },
  { patterns: ["norway", "na uy"], iso2: "NO" },
  { patterns: ["denmark", "đan mạch"], iso2: "DK" },
  { patterns: ["finland", "phần lan"], iso2: "FI" },
  { patterns: ["ireland", "ai len"], iso2: "IE" },
  { patterns: ["brazil", "brazil"], iso2: "BR" },
  { patterns: ["argentina", "argentin"], iso2: "AR" },
  { patterns: ["chile", "chile"], iso2: "CL" },
  { patterns: ["mexico", "mexico"], iso2: "MX" },
  { patterns: ["canada", "canada"], iso2: "CA" },
  { patterns: ["saudi", "saudi"], iso2: "SA" },
  { patterns: ["israel", "israel"], iso2: "IL" },
  { patterns: ["egypt", "egypt"], iso2: "EG" },
  { patterns: ["south africa", "nam phi"], iso2: "ZA" },
  { patterns: ["pakistan", "pakistan"], iso2: "PK" },
  { patterns: ["nepal", "nepal"], iso2: "NP" },
  { patterns: ["sri lanka", "sri lanka"], iso2: "LK" },
  { patterns: ["malta", "malta"], iso2: "MT" },
  { patterns: ["cyprus", "cyprus"], iso2: "CY" },
  { patterns: ["iceland", "iceland"], iso2: "IS" },
  { patterns: ["luxembourg", "luxembourg"], iso2: "LU" },
  { patterns: ["latvia", "latvia"], iso2: "LV" },
  { patterns: ["lithuania", "lithuania"], iso2: "LT" },
  { patterns: ["estonia", "estonia"], iso2: "EE" },
  { patterns: ["slovenia", "slovenia"], iso2: "SI" },
  { patterns: ["slovakia", "slovakia"], iso2: "SK" },
  { patterns: ["croatia", "croatia"], iso2: "HR" },
  { patterns: ["bulgaria", "bulgaria"], iso2: "BG" },
  { patterns: ["serbia", "serbia"], iso2: "RS" },
  { patterns: ["qatar", "qatar"], iso2: "QA" },
  { patterns: ["kuwait", "kuwait"], iso2: "KW" },
  { patterns: ["bahrain", "bahrain"], iso2: "BH" },
  { patterns: ["thailand dtac"], iso2: "TH" },
  { patterns: ["usa data", "usa &", "hoa ky &", "hỏa kỳ &"], iso2: "US" },
  { patterns: ["usa & canada"], iso2: "US" },
  { patterns: ["north america", "bắc mỹ"], iso2: "US" },
  { patterns: ["south america", "nam mỹ"], iso2: "BR" },
];

const FLAGCDN_BASE = "https://flagcdn.com/w80";

const resolveFlag = (label: string): FlagResult => {
  const normalized = normalizeText(label);

  for (const entry of DESTINATION_FLAG_MAP) {
    for (const pattern of entry.patterns) {
      const normalizedPattern = normalizeText(pattern);
      if (
        normalized === normalizedPattern ||
        normalized.includes(normalizedPattern) ||
        new RegExp(`\\b${escapeRegex(normalizedPattern)}\\b`).test(normalized)
      ) {
        return { type: "svg", value: `${FLAGCDN_BASE}/${entry.iso2.toLowerCase()}.png` };
      }
    }
  }

  if (/\beurope\b|\beu\b|\b châu âu\b|eu 33 countries|eu 40 countries|euro\b/i.test(normalized)) {
    return { type: "svg", value: `${FLAGCDN_BASE}/eu.png` };
  }
  if (/\basia\b|\b châu á\b|\basian\b/i.test(normalized)) {
    return { type: "svg", value: `${FLAGCDN_BASE}/asia.png` };
  }
  if (/\bamerica\b|\b châu mỹ\b/i.test(normalized)) {
    return { type: "svg", value: `${FLAGCDN_BASE}/america.png` };
  }
  if (/\bafrica\b|\b châu phi\b/i.test(normalized)) {
    return { type: "svg", value: `${FLAGCDN_BASE}/africa.png` };
  }

  return { type: "emoji", value: "🌐" };
};

const FlagDisplay = ({ flag, size = 28 }: { flag: FlagResult; size?: number }) => {
  if (flag.type === "svg") {
    return (
      <img
        src={flag.value}
        alt=""
        width={size}
        height={Math.round(size * 0.75)}
        className="rounded-sm object-cover"
        style={{ width: size, height: "auto", imageRendering: "crisp-edges" }}
      />
    );
  }
  return <span style={{ fontSize: size }}>{flag.value}</span>;
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
            containScroll: "trimSnaps",
          }}
          className="overflow-hidden"
        >
          <CarouselContent>
            {activeTabData.items.map((pkg) => {
              const cheapest = findCheapestVariant(pkg, pricingLanguage);
              const cheapestMoney = getEsimVariantMoney(cheapest, pricingLanguage);
              const flag = resolveFlag(pkg.coverage || pkg.destination || pkg.regionLabel);
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
                          <span className="text-3xl leading-none"><FlagDisplay flag={flag} size={28} /></span>
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
          <CarouselPrevious className="-left-2 lg:-left-3 bg-white shadow-md hover:bg-slate-50 border border-slate-200" />
          <CarouselNext className="-right-2 lg:-right-3 bg-white shadow-md hover:bg-slate-50 border border-slate-200" />
        </Carousel>
      </div>
    </Fragment>
  );
}
