"use client";

import { Globe, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatEsimMoney, findCheapestVariant, getEsimVariantMoney, type EsimPackageView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type RegionOption = { value: string; label: string };

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  regionOptions: RegionOption[];
  selectedRegionId: string;
  onSelectRegion: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
  selectedPackageSlug: string;
  onSelectPackage: (pkg: EsimPackageView) => void;
};

export default function EsimPackageDiscovery({
  query,
  onQueryChange,
  regionOptions,
  selectedRegionId,
  onSelectRegion,
  loading,
  error,
  packages,
  activeLocale,
  selectedPackageSlug,
  onSelectPackage,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  return (
    <div className="pt-8">
      <h3 className="text-xl font-bold text-midnight-ink flex items-center gap-2 mb-4">
        <Globe size={24} className="text-hb-navy" /> {t("Chọn điểm đến khác")}
      </h3>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("Tìm theo quốc gia, khu vực...")}
          className="w-full h-12 border border-slate-200 rounded-xl pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-hb-coral focus:border-transparent transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {regionOptions.map((region) => (
          <button
            key={region.value || region.label}
            onClick={() => onSelectRegion(region.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedRegionId === region.value
                ? "bg-hb-navy text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-hb-navy hover:text-hb-navy"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {loading && packages.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-xl border border-slate-100 bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : packages.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {t("Không tìm thấy gói eSIM phù hợp.")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {packages.map((pkg) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isActive = pkg.slug === selectedPackageSlug;

            return (
              <button
                key={pkg.slug}
                onClick={() => onSelectPackage(pkg)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isActive
                    ? "border-hb-navy bg-blue-50/50 shadow-sm"
                    : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                      isActive ? "bg-hb-coral" : "bg-slate-200"
                    }`}
                  />
                  <div>
                    <div className={`font-bold ${isActive ? "text-hb-navy" : "text-midnight-ink"}`}>
                      {pkg.destination}
                    </div>
                    <div className="text-sm text-steel-secondary mt-1 line-clamp-1">
                      {pkg.subtitle} — {pkg.network}
                    </div>
                    <div className="text-sm font-bold text-hb-coral mt-2">
                      {t("Từ")} {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
