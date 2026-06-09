"use client";

import { useMemo, useState } from "react";
import type { EsimFilterOption, EsimPackageView } from "../lib/esim";
import {
  buildComboDestinationOptions,
  buildCountryDestinationOptions,
  buildGenericDestinationOptions,
  type SortMode,
} from "../lib/esim-discovery";
import EsimPackageDiscoveryFilters from "./EsimPackageDiscoveryFilters";
import EsimPackageDiscoveryList from "./EsimPackageDiscoveryList";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  packageQuery?: string;
  onPackageQueryChange?: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
  selectedPackageSlug: string;
  onSelectPackage: (pkg: EsimPackageView) => void;
  showInternationalFilters?: boolean;
  pageTitle?: string;
  sidebarTitle?: string;
  sidebarMode?: "country" | "generic";
  destinationOptions?: EsimFilterOption[];
  selectedDestinationLabels?: string[];
  onToggleDestinationLabel?: (label: string) => void;
  onDestinationLabelsChange?: (labels: string[]) => void;
  onSelectDestinationLabel?: (label: string | null) => void;
  operatorOptions?: EsimFilterOption[];
  selectedOperatorLabels?: string[];
  onToggleOperatorLabel?: (label: string) => void;
  onSelectPackageFilterSku?: (sku: string | null) => void;
  priceRange?: [number, number];
  priceBounds?: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  showPricePresetFilters?: boolean;
  sortMode?: SortMode;
  onSortModeChange?: (mode: SortMode) => void;
  totalPackages?: number;
  hasMorePackages?: boolean;
  onLoadMorePackages?: () => void;
};

export default function EsimPackageDiscovery({
  query,
  onQueryChange,
  packageQuery = "",
  loading,
  error,
  packages,
  activeLocale,
  selectedPackageSlug,
  onSelectPackage,
  showInternationalFilters = false,
  pageTitle,
  sidebarTitle,
  sidebarMode = "country",
  destinationOptions = [],
  selectedDestinationLabels = [],
  onToggleDestinationLabel,
  onDestinationLabelsChange,
  onSelectDestinationLabel,
  operatorOptions,
  selectedOperatorLabels,
  onToggleOperatorLabel,
  onSelectPackageFilterSku,
  onPackageQueryChange,
  priceRange = [0, 0],
  priceBounds = { min: 0, max: 0 },
  onPriceRangeChange,
  showPriceFilters = true,
  showPricePresetFilters = true,
  sortMode: controlledSortMode,
  onSortModeChange,
  totalPackages,
  hasMorePackages = false,
  onLoadMorePackages,
}: Props) {
  const [localSortMode, setLocalSortMode] = useState<SortMode>("price-asc");
  const sortMode = controlledSortMode ?? localSortMode;
  const handleSortModeChange = onSortModeChange ?? setLocalSortMode;

  const countryDestinationOptions = useMemo(
    () => buildCountryDestinationOptions(destinationOptions),
    [destinationOptions]
  );
  const genericDestinationOptions = useMemo(
    () => buildGenericDestinationOptions(destinationOptions),
    [destinationOptions]
  );
  const comboDestinationOptions = useMemo(
    () => buildComboDestinationOptions(destinationOptions),
    [destinationOptions]
  );

  const sharedListProps = {
    query,
    onQueryChange,
    loading,
    error,
    packages,
    activeLocale,
    selectedPackageSlug,
    onSelectPackage,
    showInternationalFilters,
    pageTitle,
    sortMode,
    onSortModeChange: handleSortModeChange,
    totalPackages,
    hasMorePackages,
    onLoadMorePackages,
  } as const;

  if (!showInternationalFilters) {
    return (
      <div className="pt-8">
        <EsimPackageDiscoveryList {...sharedListProps} showInternationalFilters={false} />
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-32 h-fit">
          <EsimPackageDiscoveryFilters
            activeLocale={activeLocale}
            sidebarTitle={sidebarTitle}
            sidebarMode={sidebarMode}
            showInternationalFilters={showInternationalFilters}
            countryDestinationOptions={countryDestinationOptions}
            genericDestinationOptions={genericDestinationOptions}
            comboDestinationOptions={comboDestinationOptions}
            selectedDestinationLabels={selectedDestinationLabels}
            onToggleDestinationLabel={onToggleDestinationLabel}
            onDestinationLabelsChange={onDestinationLabelsChange}
            operatorOptions={operatorOptions}
            selectedOperatorLabels={selectedOperatorLabels}
            onToggleOperatorLabel={onToggleOperatorLabel}
            priceRange={priceRange}
            priceBounds={priceBounds}
            onPriceRangeChange={onPriceRangeChange}
            showPriceFilters={showPriceFilters}
            showPricePresetFilters={showPricePresetFilters}
            sortMode={sortMode}
            onSortModeChange={handleSortModeChange}
          />
        </div>

        <EsimPackageDiscoveryList {...sharedListProps} showInternationalFilters />
      </div>
    </div>
  );
}
