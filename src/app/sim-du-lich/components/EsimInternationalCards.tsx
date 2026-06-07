"use client";

import Link from "next/link";
import Image from "next/image";
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
  resolveEsimPackageAvatarUrl,
  type EsimPackageView,
} from "../lib/esim";
import { getSimDuLichDetailHref } from "../lib/routes";

type FlagResult = {
  type: "svg" | "emoji";
  value: string;
};

type Props = {
  packages: EsimPackageView[];
  selectedPackageSlug?: string;
  activeLocale: "vi" | "en";
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
    return { type: "emoji", value: "🌍" };
  }
  if (/\basia\b|\b châu á\b|\basian\b/i.test(normalized)) {
    return { type: "emoji", value: "🌏" };
  }
  if (/\bamerica\b|\b châu mỹ\b/i.test(normalized)) {
    return { type: "emoji", value: "🌎" };
  }
  if (/\bafrica\b|\b châu phi\b/i.test(normalized)) {
    return { type: "emoji", value: "🌍" };
  }

  return { type: "emoji", value: "🌐" };
};

const resolveCountryFlag = (pkg: EsimPackageView): FlagResult => {
  return resolveFlag(`${pkg.destination} ${pkg.regionLabel} ${pkg.coverage}`);
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
            containScroll: "trimSnaps",
          }}
          className="overflow-hidden"
      >
        <CarouselContent>
          {packages.map((pkg) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isActive = selectedPackageSlug === pkg.slug;
            const flag = resolveCountryFlag(pkg);
            const avatarUrl = resolveEsimPackageAvatarUrl(pkg);

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
                        background: avatarUrl
                          ? "transparent"
                          : "linear-gradient(135deg, #155EEF 0%, #1D4ED8 38%, #0EA5E9 100%)",
                      }}
                    >
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={pkg.title || pkg.destination}
                          fill
                          sizes="(max-width: 640px) 88vw, (max-width: 768px) 62vw, (max-width: 1024px) 48vw, 25vw"
                          className="object-contain object-center opacity-100"
                        />
                      ) : null}
                      {avatarUrl ? null : (
                        <div className="flex items-start justify-between gap-3">
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                            eSIM
                          </span>
                          <span className="text-3xl leading-none"><FlagDisplay flag={flag} size={28} /></span>
                        </div>
                      )}

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

                      {avatarUrl ? null : (
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                      )}
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
        <CarouselPrevious className="-left-2 lg:-left-3 bg-white shadow-md hover:bg-slate-50 border border-slate-200" />
        <CarouselNext className="-right-2 lg:-right-3 bg-white shadow-md hover:bg-slate-50 border border-slate-200" />
      </Carousel>
    </section>
  );
}
