"use client";

import "rc-slider/assets/index.css";
import type { DestinationSelectOption, SortMode } from "../lib/esim-discovery";
import EsimPackageDiscoveryDesktopSidebar from "./EsimPackageDiscoveryDesktopSidebar";
import EsimPackageDiscoveryMobileFilters from "./EsimPackageDiscoveryMobileFilters";

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
  onDestinationLabelsChange?: (labels: string[]) => void;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  showPricePresetFilters?: boolean;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  packagesCount: number;
};

export default function EsimPackageDiscoveryFilters({
  activeLocale,
  sidebarTitle,
  sidebarMode = "country",
  showInternationalFilters = false,
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
  showPricePresetFilters = true,
  sortMode,
  onSortModeChange,
  packagesCount,
}: Props) {
  if (!showInternationalFilters) return null;

  return (
    <>
      <EsimPackageDiscoveryMobileFilters
        activeLocale={activeLocale}
        sidebarTitle={sidebarTitle}
        sidebarMode={sidebarMode}
        countryDestinationOptions={countryDestinationOptions}
        genericDestinationOptions={genericDestinationOptions}
        comboDestinationOptions={comboDestinationOptions}
        selectedDestinationLabels={selectedDestinationLabels}
        onToggleDestinationLabel={onToggleDestinationLabel}
        onDestinationLabelsChange={onDestinationLabelsChange}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onPriceRangeChange={onPriceRangeChange}
        showPriceFilters={showPriceFilters}
        sortMode={sortMode}
        onSortModeChange={onSortModeChange}
        packagesCount={packagesCount}
      />

      <div className="hidden lg:block">
        <EsimPackageDiscoveryDesktopSidebar
          activeLocale={activeLocale}
          sidebarTitle={sidebarTitle}
          sidebarMode={sidebarMode}
          showInternationalFilters={showInternationalFilters}
          countryDestinationOptions={countryDestinationOptions}
          genericDestinationOptions={genericDestinationOptions}
          comboDestinationOptions={comboDestinationOptions}
          selectedDestinationLabels={selectedDestinationLabels}
          onToggleDestinationLabel={onToggleDestinationLabel}
          priceRange={priceRange}
          priceBounds={priceBounds}
          onPriceRangeChange={onPriceRangeChange}
          showPriceFilters={showPriceFilters}
          showPricePresetFilters={showPricePresetFilters}
        />
      </div>
    </>
  );
}
