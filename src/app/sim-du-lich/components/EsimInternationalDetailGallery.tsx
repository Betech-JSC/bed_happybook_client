"use client";

import Image from "next/image";
import { Globe } from "lucide-react";
import { resolveEsimPackageAvatarUrl, type EsimPackageView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedPackage: EsimPackageView | null;
  categoryLabel: string;
  titleFallback: string;
};

export default function EsimInternationalDetailGallery({
  selectedPackage,
  categoryLabel,
  titleFallback,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const avatarUrl = resolveEsimPackageAvatarUrl(selectedPackage);
  const hasAvatar = Boolean(avatarUrl);

  return (
    <section className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-[28px] border border-white/20 shadow-[0_24px_60px_rgba(29,78,216,0.22)] ${
          hasAvatar ? "bg-white" : "aspect-[16/10] min-h-[320px]"
        }`}
        style={{
          background: hasAvatar ? "transparent" : "linear-gradient(135deg, #1D4ED8 0%, #2348C8 46%, #1E40AF 100%)",
        }}
      >
        {hasAvatar ? (
          <Image
            src={avatarUrl}
            alt={selectedPackage?.title || selectedPackage?.destination || categoryLabel}
            width={1600}
            height={1000}
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
            className="block h-auto w-full object-contain object-top opacity-100"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_45%)]" />
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.10)_100%)]" />
          </>
        )}

        {!hasAvatar ? (
          <>
            <div className="absolute left-4 right-4 top-4 z-10 flex flex-nowrap gap-2 overflow-hidden">
              <span className="inline-flex min-w-0 max-w-[58%] items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-midnight-ink shadow-sm">
                <Globe className="h-5 w-5 text-[#1D4ED8]" />
                <span className="block min-w-0 truncate whitespace-nowrap uppercase tracking-wide">
                  {selectedPackage?.destination || categoryLabel}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-2xl bg-[#1E3A8A] px-4 py-3 text-sm font-extrabold text-white shadow-sm">
                eSIM
              </span>
              <span className="inline-flex min-w-0 max-w-[34%] items-center rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-midnight-ink shadow-sm">
                <span className="block min-w-0 truncate whitespace-nowrap">
                  {selectedPackage?.network || t("Network")}
                </span>
              </span>
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
              <p className="text-4xl font-black tracking-tight drop-shadow-md md:text-5xl lg:text-6xl">
                {selectedPackage?.title || titleFallback}
              </p>
              <p className="mt-5 max-w-2xl text-lg font-semibold text-white/90 drop-shadow-sm md:text-2xl">
                {selectedPackage?.subtitle ||
                  selectedPackage?.coverage ||
                  selectedPackage?.destination ||
                  categoryLabel}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/18 to-transparent" />
          </>
        ) : null}
      </div>
    </section>
  );
}
