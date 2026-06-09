"use client";

import { useState } from "react";
import Slider from "rc-slider";
import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import { formatEsimMoney } from "../lib/esim";
import {
  getPriceSliderStep,
  type DestinationSelectOption,
  type SortMode,
} from "../lib/esim-discovery";

type Props = {
  activeLocale: "vi" | "en";
  sidebarTitle?: string;
  sidebarMode?: "country" | "generic";
  countryDestinationOptions: DestinationSelectOption[];
  genericDestinationOptions: DestinationSelectOption[];
  comboDestinationOptions: DestinationSelectOption[];
  selectedDestinationLabels: string[];
  onToggleDestinationLabel?: (label: string) => void;
  onDestinationLabelsChange?: (labels: string[]) => void;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
};

type MobileSheet = "location" | "filters" | null;

export default function EsimPackageDiscoveryMobileFilters({
  activeLocale,
  sidebarTitle,
  sidebarMode = "country",
  countryDestinationOptions,
  genericDestinationOptions,
  comboDestinationOptions,
  selectedDestinationLabels,
  onToggleDestinationLabel,
  onDestinationLabelsChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  showPriceFilters = true,
  sortMode,
  onSortModeChange,
}: Props) {
  const t = useSimDuLichStaticText(activeLocale);
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  const [mobileSearch, setMobileSearch] = useState("");
  const [mobileShowAll, setMobileShowAll] = useState(false);
  const [draftDestinationLabels, setDraftDestinationLabels] = useState<string[]>(selectedDestinationLabels);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(priceRange);
  const [draftSortMode, setDraftSortMode] = useState<SortMode>(sortMode);

  const priceCurrency = activeLocale === "en" ? "USD" : "VND";
  const hasPriceBounds = priceBounds.max > priceBounds.min;
  const priceStep = getPriceSliderStep(priceBounds);
  const locationLabel = sidebarMode === "generic" ? sidebarTitle || t("Nhà mạng") : t("Location", "Location");
  const locationActiveCount = selectedDestinationLabels.length;
  const priceActive =
    hasPriceBounds && (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max);

  const syncDestinationLabels = (labels: string[]) => {
    if (onDestinationLabelsChange) {
      onDestinationLabelsChange(labels);
      return;
    }

    selectedDestinationLabels
      .filter((label) => !labels.includes(label))
      .forEach((label) => onToggleDestinationLabel?.(label));

    labels
      .filter((label) => !selectedDestinationLabels.includes(label))
      .forEach((label) => onToggleDestinationLabel?.(label));
  };

  const openMobileSheet = (sheet: Exclude<MobileSheet, null>) => {
    setDraftDestinationLabels(selectedDestinationLabels);
    setDraftPriceRange(priceRange);
    setDraftSortMode(sortMode);
    setMobileSearch("");
    setMobileShowAll(false);
    setMobileSheet(sheet);
  };

  const closeMobileSheet = () => setMobileSheet(null);

  const toggleDraftDestination = (label: string) => {
    setDraftDestinationLabels((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  };

  const clearMobileDraft = () => {
    setDraftDestinationLabels([]);
    setDraftSortMode("price-asc");

    if (hasPriceBounds) {
      setDraftPriceRange([priceBounds.min, priceBounds.max]);
    }
  };

  const applyMobileDraft = () => {
    syncDestinationLabels(draftDestinationLabels);
    onSortModeChange(draftSortMode);

    if (hasPriceBounds) {
      onPriceRangeChange?.(draftPriceRange);
    }

    closeMobileSheet();
  };

  const filterSheetOptions = (items: DestinationSelectOption[]) => {
    const keyword = mobileSearch.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((option) =>
      [option.displayLabel, option.label, option.value].join(" ").toLowerCase().includes(keyword)
    );
  };

  const renderMobileOptionChips = (items: DestinationSelectOption[], limit = 6) => {
    const filtered = filterSheetOptions(items);
    const visibleItems = mobileShowAll ? filtered : filtered.slice(0, limit);

    if (!filtered.length) {
      return <p className="text-sm text-slate-500">{t("Không tìm thấy lựa chọn phù hợp.")}</p>;
    }

    return (
      <>
        <div className="flex flex-wrap gap-2.5">
          {visibleItems.map((option) => {
            const optionKey = String(option.value || option.displayLabel);
            const checked = draftDestinationLabels.includes(optionKey);

            return (
              <button
                key={`${option.value}-${option.displayLabel}`}
                type="button"
                onClick={() => toggleDraftDestination(optionKey)}
                className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                  checked
                    ? "border-hb-coral bg-orange-50 text-hb-coral"
                    : "border-slate-200 bg-white text-midnight-ink hover:border-hb-coral"
                }`}
              >
                {option.displayLabel}
              </button>
            );
          })}
        </div>

        {filtered.length > limit ? (
          <button
            type="button"
            onClick={() => setMobileShowAll((current) => !current)}
            className="mt-3 text-sm font-semibold text-hb-navy underline underline-offset-2"
          >
            {mobileShowAll ? t("Thu gọn") : t("Xem thêm")}
          </button>
        ) : null}
      </>
    );
  };

  if (mobileSheet === null) {
    return (
      <div className="mb-5 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openMobileSheet("location")}
            className="inline-flex h-10 min-w-[42%] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-midnight-ink shadow-sm"
          >
            <MapPin className="h-4 w-4 text-slate-500" />
            <span>{locationLabel}</span>
            {locationActiveCount ? (
              <span className="rounded-full bg-hb-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                {locationActiveCount}
              </span>
            ) : null}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => openMobileSheet("filters")}
            className="inline-flex h-10 min-w-[42%] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-midnight-ink shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>{t("Filters", "Filters")}</span>
            {priceActive ? <span className="h-2 w-2 rounded-full bg-hb-coral" /> : null}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    );
  }

  const sheetTitle = mobileSheet === "location" ? locationLabel : t("Filters", "Filters");

  return (
    <div className="fixed inset-0 z-[1101] lg:hidden">
      <button
        type="button"
        aria-label={t("Đóng bộ lọc", "Close filters")}
        className="absolute inset-0 bg-black/45"
        onClick={closeMobileSheet}
      />

      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[22px] bg-white shadow-2xl">
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-200" />
        <div className="flex h-14 items-center justify-center border-b border-slate-100 px-4">
          <button
            type="button"
            onClick={closeMobileSheet}
            className="absolute left-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700"
            aria-label={t("Đóng", "Close")}
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-base font-bold text-midnight-ink">{sheetTitle}</h3>
        </div>

        <div className="max-h-[calc(88vh-130px)] overflow-y-auto px-5 py-5 pb-28">
          {mobileSheet === "location" ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(event) => setMobileSearch(event.target.value)}
                  placeholder={t(
                    "Tìm theo thành phố, khu vực hoặc quốc gia",
                    "Search by city, region or country"
                  )}
                  className="h-10 w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-hb-coral focus:bg-white"
                />
              </div>

              {sidebarMode === "generic" ? (
                <section>
                  <h4 className="mb-3 text-lg font-bold text-midnight-ink">{sidebarTitle || t("Nhà mạng")}</h4>
                  {renderMobileOptionChips(genericDestinationOptions)}
                </section>
              ) : (
                <>
                  {comboDestinationOptions.length ? (
                    <section>
                      <h4 className="mb-3 text-lg font-bold text-midnight-ink">{t("Cụm quốc gia")}</h4>
                      {renderMobileOptionChips(comboDestinationOptions)}
                    </section>
                  ) : null}

                  <section>
                    <h4 className="mb-3 text-lg font-bold text-midnight-ink">{sidebarTitle || t("Quốc gia")}</h4>
                    {renderMobileOptionChips(countryDestinationOptions)}
                  </section>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-7">
              <section>
                <h4 className="mb-3 text-xl font-bold text-midnight-ink">{t("Sắp xếp")}</h4>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { value: "newest", label: t("Mới nhất") },
                    { value: "price-asc", label: t("Giá từ thấp đến cao") },
                    { value: "price-desc", label: t("Giá từ cao xuống thấp") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDraftSortMode(option.value as SortMode)}
                      className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                        draftSortMode === option.value
                          ? "border-hb-coral bg-orange-50 text-hb-coral"
                          : "border-slate-200 bg-white text-midnight-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              {showPriceFilters ? (
                <section>
                  <h4 className="mb-3 text-xl font-bold text-midnight-ink">{t("Mức giá", "Price range")}</h4>
                  {hasPriceBounds ? (
                    <>
                      <p className="mb-4 text-sm font-medium text-midnight-ink">
                        {formatEsimMoney(draftPriceRange[0], priceCurrency)} -{" "}
                        {formatEsimMoney(draftPriceRange[1], priceCurrency)}
                      </p>
                      <div className="px-2 py-5">
                        <Slider
                          range
                          min={priceBounds.min}
                          max={priceBounds.max}
                          step={priceStep || undefined}
                          allowCross={false}
                          value={draftPriceRange}
                          onChange={(value) => setDraftPriceRange(value as [number, number])}
                          trackStyle={[{ backgroundColor: "#ff5a1f", height: 4 }]}
                          handleStyle={[
                            { borderColor: "#ff5a1f", boxShadow: "none", height: 22, width: 22, marginTop: -9 },
                            { borderColor: "#ff5a1f", boxShadow: "none", height: 22, width: 22, marginTop: -9 },
                          ]}
                          railStyle={{ backgroundColor: "#e5e7eb", height: 4 }}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                          {formatEsimMoney(draftPriceRange[0], priceCurrency)}
                        </div>
                        <span className="text-slate-400">-</span>
                        <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                          {formatEsimMoney(draftPriceRange[1], priceCurrency)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      {t("Chưa có dữ liệu mức giá.")}
                    </div>
                  )}
                </section>
              ) : null}
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={clearMobileDraft}
            className="px-2 text-sm font-semibold text-midnight-ink underline underline-offset-2"
          >
            {t("Clear", "Clear")}
          </button>
          <button
            type="button"
            onClick={applyMobileDraft}
            className="rounded-lg bg-hb-coral px-5 py-3 text-sm font-extrabold text-white shadow-sm"
          >
            {t("Show results", "Show results")}
          </button>
        </div>
      </div>
    </div>
  );
}
