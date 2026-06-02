"use client";

import { useMemo, useState } from "react";
import Slider from "rc-slider";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import { formatEsimMoney } from "../lib/esim";
import {
  buildPricePresets,
  getPriceSliderStep,
  type DestinationSelectOption,
  type PricePreset,
} from "../lib/esim-discovery";

type Props = {
  activeLocale: "vi" | "en";
  sidebarTitle?: string;
  sidebarMode?: "country" | "generic";
  showInternationalFilters?: boolean;
  countryDestinationOptions: DestinationSelectOption[];
  genericDestinationOptions: DestinationSelectOption[];
  comboDestinationOptions: DestinationSelectOption[];
  selectedDestinationLabels: string[];
  onToggleDestinationLabel?: (label: string) => void;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  showPricePresetFilters?: boolean;
};

export default function EsimPackageDiscoveryDesktopSidebar({
  activeLocale,
  sidebarTitle,
  sidebarMode = "country",
  showInternationalFilters = false,
  countryDestinationOptions,
  genericDestinationOptions,
  comboDestinationOptions,
  selectedDestinationLabels,
  onToggleDestinationLabel,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  showPriceFilters = true,
  showPricePresetFilters = true,
}: Props) {
  const t = useSimDuLichStaticText(activeLocale);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const priceCurrency = activeLocale === "en" ? "USD" : "VND";
  const hasPriceBounds = priceBounds.max > priceBounds.min;
  const priceStep = getPriceSliderStep(priceBounds);

  const pricePresets = useMemo<PricePreset[]>(
    () => buildPricePresets(priceBounds, priceCurrency, t),
    [priceBounds, priceCurrency, t]
  );

  const sidebarOptions = sidebarMode === "generic" ? genericDestinationOptions : countryDestinationOptions;
  const visibleSidebarOptions = showAllDestinations ? sidebarOptions : sidebarOptions.slice(0, 5);
  const visibleCountryDestinations = showAllDestinations
    ? countryDestinationOptions
    : countryDestinationOptions.slice(0, 5);
  const visibleComboDestinations = showAllDestinations
    ? comboDestinationOptions
    : comboDestinationOptions.slice(0, 5);
  const hasTruncatedDestinationOptions =
    sidebarMode === "generic"
      ? sidebarOptions.length > 5
      : countryDestinationOptions.length > 5 || comboDestinationOptions.length > 5;

  const isPricePresetActive = (range: [number, number]) =>
    priceRange[0] === range[0] && priceRange[1] === range[1];

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:overscroll-contain">
      <div className="space-y-6 lg:pr-2">
        {sidebarMode === "generic" ? (
          <div>
            <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{sidebarTitle || t("Nhà mạng")}</h4>
            <div className="space-y-3">
              {visibleSidebarOptions.map((option) => {
                const checked = selectedDestinationLabels.includes(option.displayLabel);

                return (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleDestinationLabel?.(option.displayLabel)}
                      className="h-5 w-5 rounded border-slate-300 text-hb-coral focus:ring-hb-coral"
                    />
                    <span className="text-[15px] text-midnight-ink">{option.displayLabel}</span>
                  </label>
                );
              })}
            </div>

            {hasTruncatedDestinationOptions ? (
              <button
                type="button"
                onClick={() => setShowAllDestinations((current) => !current)}
                className="mt-4 text-sm font-medium text-hb-navy transition-colors hover:text-hb-coral"
              >
                {showAllDestinations ? t("Thu gọn") : t("Xem thêm")}
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {showInternationalFilters && comboDestinationOptions.length > 0 ? (
              <div>
                <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{t("Cụm quốc gia")}</h4>
                <div className="space-y-3">
                  {visibleComboDestinations.map((option) => {
                    const checked = selectedDestinationLabels.includes(option.displayLabel);

                    return (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleDestinationLabel?.(option.displayLabel)}
                          className="h-5 w-5 rounded border-slate-300 text-hb-coral focus:ring-hb-coral"
                        />
                        <span className="text-[15px] text-midnight-ink">{option.displayLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div>
              <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{sidebarTitle || t("Quốc gia")}</h4>
              <div className="space-y-3">
                {visibleCountryDestinations.map((option) => {
                  const checked = selectedDestinationLabels.includes(option.displayLabel);

                  return (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleDestinationLabel?.(option.displayLabel)}
                        className="h-5 w-5 rounded border-slate-300 text-hb-coral focus:ring-hb-coral"
                      />
                      <span className="text-[15px] text-midnight-ink">{option.displayLabel}</span>
                    </label>
                  );
                })}
              </div>

              {hasTruncatedDestinationOptions ? (
                <button
                  type="button"
                  onClick={() => setShowAllDestinations((current) => !current)}
                  className="mt-4 text-sm font-medium text-hb-navy transition-colors hover:text-hb-coral"
                >
                  {showAllDestinations ? t("Thu gọn") : t("Xem thêm")}
                </button>
              ) : null}
            </div>
          </>
        )}

        {showPriceFilters ? (
          <div className="border-t border-slate-100 pt-6">
            {showPricePresetFilters ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="text-2xl font-bold text-midnight-ink">{t("Mức giá")}</h4>
                  {hasPriceBounds ? (
                    <button
                      type="button"
                      onClick={() => onPriceRangeChange?.([priceBounds.min, priceBounds.max])}
                      className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-hb-navy transition-colors hover:border-hb-coral hover:text-hb-coral"
                    >
                      {t("Đặt lại")}
                    </button>
                  ) : null}
                </div>

                {hasPriceBounds && pricePresets.length ? (
                  <div className="mb-4">
                    <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      {t("Chọn nhanh", "Quick ranges")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pricePresets.map((preset) => {
                        const active = isPricePresetActive(preset.range);

                        return (
                          <button
                            key={preset.key}
                            type="button"
                            onClick={() => onPriceRangeChange?.(preset.range)}
                            className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                              active
                                ? "border-hb-coral bg-orange-50 text-hb-coral"
                                : "border-slate-200 bg-white text-midnight-ink hover:border-hb-coral hover:text-hb-coral"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {hasPriceBounds ? (
              <>
                <div className="px-2 py-4">
                  <Slider
                    range
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceStep || undefined}
                    allowCross={false}
                    value={priceRange}
                    onChange={(value) => onPriceRangeChange?.(value as [number, number])}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                    {formatEsimMoney(priceRange[0], priceCurrency)}
                  </div>
                  <span className="text-slate-400">-</span>
                  <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                    {formatEsimMoney(priceRange[1], priceCurrency)}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {t("Chưa có dữ liệu mức giá.")}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
