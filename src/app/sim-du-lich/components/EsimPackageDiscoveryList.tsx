"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Clock3, Globe, MapPin, Search, Wifi } from "lucide-react";
import type { EsimPackageView } from "../lib/esim";
import {
  formatEsimMoney,
  findCheapestVariant,
  getEsimVariantMoney,
  resolveEsimPackageAvatarUrl,
  isEsimVariantSelectable,
} from "../lib/esim";
import { sortEsimPackages, type SortMode } from "../lib/esim-discovery";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
  selectedPackageSlug: string;
  onSelectPackage: (pkg: EsimPackageView) => void;
  showInternationalFilters?: boolean;
  pageTitle?: string;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  totalPackages?: number;
  hasMorePackages?: boolean;
  onLoadMorePackages?: () => void;
};

export default function EsimPackageDiscoveryList({
  query,
  onQueryChange,
  loading,
  error,
  packages,
  activeLocale,
  selectedPackageSlug,
  onSelectPackage,
  showInternationalFilters = false,
  pageTitle,
  sortMode,
  onSortModeChange,
  totalPackages,
  hasMorePackages = false,
  onLoadMorePackages,
}: Props) {
  const t = useSimDuLichStaticText(activeLocale);
  const sortedPackages = useMemo(
    () => sortEsimPackages(packages, activeLocale, sortMode, showInternationalFilters),
    [activeLocale, packages, showInternationalFilters, sortMode]
  );

  const renderPackageList = () => {
    if (loading && sortedPackages.length === 0) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[280px] animate-pulse rounded-2xl border-2 border-[#EAECF0] bg-slate-50 lg:h-[220px]"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      );
    }

    if (sortedPackages.length === 0) {
      return (
        <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {t("Không tìm thấy gói eSIM phù hợp.")}
        </div>
      );
    }

    if (showInternationalFilters) {
      return (
        <div className="space-y-0">
          {sortedPackages.map((pkg, index) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isSelectable = cheapest ? isEsimVariantSelectable(cheapest, activeLocale) : false;
            const isActive = pkg.slug === selectedPackageSlug;
            const title = pkg.destination || pkg.title || pkg.regionLabel || "eSIM";
            const subtitle = pkg.subtitle || pkg.coverage || pkg.network || pkg.regionLabel || title;
            const validityLabel = cheapest?.validity
              ? `${cheapest.validity} ngày`
              : pkg.coverage || pkg.subtitle || pkg.network || title;
            const avatarUrl = resolveEsimPackageAvatarUrl(pkg);

            return (
              <button
                key={pkg.slug}
                type="button"
                onClick={() => {
                  if (!isSelectable) return;
                  onSelectPackage(pkg);
                }}
                disabled={!isSelectable}
                className={`w-full text-left ${!isSelectable ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div
                  className={`mt-4 flex flex-col rounded-3xl bg-white p-5 transition-opacity duration-700 lg:flex-row lg:space-x-6 ${
                    isActive ? "ring-2 ring-orange-100" : ""
                  } ${!isSelectable ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <div className="relative w-full overflow-hidden rounded-xl lg:w-[280px] lg:shrink-0">
                    <div
                      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl ${
                        avatarUrl ? "border border-slate-200 bg-white shadow-sm" : ""
                      }`}
                      style={{
                        background: avatarUrl
                          ? "transparent"
                          : "linear-gradient(135deg, #2147D8 0%, #3157D8 50%, #2D49C7 100%)",
                      }}
                    >
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-contain bg-white opacity-100"
                          priority={index < 2}
                        />
                      ) : null}
                      {avatarUrl ? null : (
                        <div className="absolute left-3 right-3 top-3 flex flex-nowrap items-center gap-2 overflow-hidden">
                          <span className="inline-flex min-w-0 max-w-[46%] flex-[1_1_46%] items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-midnight-ink shadow-sm lg:px-3 lg:text-xs">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-[#1D4ED8]" />
                            <span className="min-w-0 truncate whitespace-nowrap">
                              {title || pkg.regionLabel || "eSIM"}
                            </span>
                          </span>
                          <span className="inline-flex shrink-0 items-center rounded-full bg-[#1E3A8A] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm lg:text-xs">
                            eSIM
                          </span>
                          <span className="inline-flex min-w-0 flex-1 items-center rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-midnight-ink shadow-sm lg:px-3 lg:text-xs">
                            <span className="min-w-0 truncate whitespace-nowrap">{pkg.network || "Network"}</span>
                          </span>
                        </div>
                      )}
                      {avatarUrl ? null : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white lg:px-8">
                          <h3 className="max-w-[14ch] text-[24px] font-black leading-[0.94] tracking-tight drop-shadow-md lg:text-[34px]">
                            {title}
                          </h3>
                          <p className="mt-2 max-w-[20ch] text-xs font-semibold leading-snug text-white/90 drop-shadow-sm lg:mt-3 lg:text-base">
                            {subtitle}
                          </p>
                        </div>
                      )}
                      {avatarUrl ? null : (
                        <div className="absolute bottom-0 left-0 rounded-tr-3xl bg-[#4E6EB3] px-3 py-1 text-white">
                          <span className="block max-w-[14rem] truncate whitespace-nowrap text-sm" data-translate="true">
                            {pkg.regionLabel || pkg.coverage || pkg.destination}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex w-full flex-col lg:mt-0 lg:flex-row lg:justify-between lg:items-stretch lg:flex-1">
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hb-coral">eSIM</p>
                        <h3 className="text-18 font-semibold leading-tight transition-colors duration-300 hover:text-primary">
                          <span data-translate="true">{title}</span>
                        </h3>
                        <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                          <span data-translate="true">0 đánh giá</span>
                        </div>
                      </div>

                      <div className="flex flex-row flex-nowrap lg:flex-col items-center lg:items-start gap-x-4 lg:gap-x-0 lg:gap-y-2.5 text-midnight-ink text-xs sm:text-sm overflow-hidden lg:overflow-visible">
                        <div className="flex items-center gap-1.5 leading-6 shrink-0">
                          <Clock3 className="h-4 w-4 shrink-0 text-slate-500" />
                          <span data-translate="true">{validityLabel}</span>
                        </div>

                        <div className="flex items-center gap-1.5 leading-6 min-w-0 shrink-0 lg:shrink">
                          <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                          <span className="truncate lg:whitespace-normal" data-translate="true">{pkg.regionLabel || pkg.destination}</span>
                        </div>

                        <div className="flex items-center gap-1.5 leading-6 min-w-0 shrink-0 lg:shrink">
                          <Wifi className="h-4 w-4 shrink-0 text-slate-500" />
                          <span className="truncate lg:whitespace-normal" data-translate="true">{pkg.network || pkg.coverage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col justify-end items-end lg:mt-0 lg:pl-6 lg:border-l lg:border-slate-100 lg:min-w-[180px]">
                      <div className="text-xs text-steel-secondary mb-1">{t("Giá từ")}</div>
                      {isSelectable ? (
                        <div className="flex flex-col items-end">
                          {cheapestMoney.originalPrice > cheapestMoney.price && (
                            <span className="text-sm font-normal text-slate-400 line-through">
                              {formatEsimMoney(cheapestMoney.originalPrice, cheapestMoney.currency)}
                            </span>
                          )}
                          <div className="text-2xl font-extrabold text-hb-coral">
                            {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-slate-400" data-translate="true">
                          {t("Chưa có giá khả dụng")}
                        </div>
                      )}
                      {isSelectable && (
                        <div className="mt-4 hidden lg:block bg-hb-coral hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm">
                          {t("Chọn gói")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sortedPackages.map((pkg, index) => {
          const cheapest = findCheapestVariant(pkg, activeLocale);
          const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
          const isSelectable = cheapest ? isEsimVariantSelectable(cheapest, activeLocale) : false;
          const isActive = pkg.slug === selectedPackageSlug;
          const avatarUrl = resolveEsimPackageAvatarUrl(pkg);

          return (
            <button
              key={pkg.slug}
              onClick={() => {
                if (!isSelectable) return;
                onSelectPackage(pkg);
              }}
              disabled={!isSelectable}
              className={`rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? "border-hb-navy bg-blue-50/50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
              } ${!isSelectable ? "cursor-not-allowed opacity-50 hover:shadow-none" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-3 w-3 flex-shrink-0 rounded-full mt-1.5 ${
                    isActive ? "bg-hb-coral" : "bg-slate-200"
                  }`}
                />
                {avatarUrl ? (
                  <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <Image
                      src={avatarUrl}
                      alt={pkg.title || pkg.destination}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover object-top"
                      priority={index < 4}
                    />
                  </div>
                ) : null}
                <div>
                  <div className={`font-bold ${isActive ? "text-hb-navy" : "text-midnight-ink"}`}>
                    {pkg.destination}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm text-steel-secondary">
                    {pkg.subtitle} - {pkg.network}
                  </div>
                  <div className="mt-2 text-sm font-bold text-hb-coral">
                    {isSelectable ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {cheapestMoney.originalPrice > cheapestMoney.price && (
                          <span className="text-xs font-normal text-slate-400 line-through">
                            {formatEsimMoney(cheapestMoney.originalPrice, cheapestMoney.currency)}
                          </span>
                        )}
                        <span>
                          {t("Từ")} {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                        </span>
                      </div>
                    ) : (
                      t("Chưa có giá khả dụng")
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (!showInternationalFilters) {
    return (
      <div>
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("Tìm theo quốc gia, khu vực...")}
            className="h-12 w-full rounded-xl border border-slate-200 pl-12 pr-4 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-hb-coral"
          />
        </div>

        {renderPackageList()}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-midnight-ink lg:text-4xl">{pageTitle || t("Sim du lịch quốc tế")}</h1>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-lg text-midnight-ink">{t("Sắp xếp")}</span>
          <div className="w-60 rounded-xl border border-slate-200 bg-white">
            <select
              value={sortMode}
              onChange={(event) => onSortModeChange(event.target.value as SortMode)}
              className="w-full rounded-xl bg-white px-4 py-3 text-midnight-ink outline-none"
            >
              <option value="newest">{t("Mới nhất")}</option>
              <option value="price-asc">{t("Giá từ thấp đến cao")}</option>
              <option value="price-desc">{t("Giá từ cao xuống thấp")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-midnight-ink lg:hidden">
        <span>
          {totalPackages ?? packages.length} {t("kết quả", "results")}
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-slate-700">
          <span>{sortMode === "price-desc" ? t("Giá cao xuống thấp") : sortMode === "price-asc" ? t("Giá thấp đến cao") : t("Mới nhất")}</span>
        </span>
      </div>

      {renderPackageList()}

      {hasMorePackages ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMorePackages}
            disabled={loading}
            className="rounded-full border border-hb-coral px-6 py-3 text-sm font-bold text-hb-coral transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t("Đang tải", "Loading") : t("Xem thêm", "Load more")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
