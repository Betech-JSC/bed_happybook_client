"use client";

import dynamic from "next/dynamic";
import type { EsimFilterOption, EsimPackageView, EsimVariantView } from "../lib/esim";
import type { SortMode } from "../lib/esim-discovery";

const LazyPackageControls = dynamic(() => import("./EsimPackageControls"), {
  loading: () => <div className="h-[220px] rounded-3xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse" />,
});

const LazyPackageDiscovery = dynamic(() => import("./EsimPackageDiscovery"), {
  loading: () => <div className="min-h-[720px] rounded-3xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse" />,
});

type Props = {
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
  serviceTypeLabel: string;
  quantity: number;
  query: string;
  onQueryChange: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
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
  packageQuery?: string;
  onPackageQueryChange?: (value: string) => void;
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
  onOpenModal: () => void;
  onSelectPackage: (pkg: EsimPackageView) => void;
  onSelectSkuByValidity: (validity: number) => void;
  onSelectSkuByData: (data: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  showPackageControls?: boolean;
};

export default function EsimPackageExplorer({
  selectedPackage,
  selectedVariant,
  serviceTypeLabel,
  quantity,
  query,
  onQueryChange,
  loading,
  error,
  packages,
  activeLocale,
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
  packageQuery,
  onPackageQueryChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  showPriceFilters = false,
  showPricePresetFilters = false,
  sortMode,
  onSortModeChange,
  totalPackages,
  hasMorePackages,
  onLoadMorePackages,
  onOpenModal,
  onSelectPackage,
  onSelectSkuByValidity,
  onSelectSkuByData,
  onDecreaseQuantity,
  onIncreaseQuantity,
  showPackageControls = true,
}: Props) {
  return (
    <div className="space-y-8">
      {showPackageControls ? (
        <LazyPackageControls
          selectedPackage={selectedPackage}
          selectedVariant={selectedVariant}
          serviceTypeLabel={serviceTypeLabel}
          quantity={quantity}
          locale={activeLocale}
          onOpenModal={onOpenModal}
          onSelectSkuByValidity={onSelectSkuByValidity}
          onSelectSkuByData={onSelectSkuByData}
          onDecreaseQuantity={onDecreaseQuantity}
          onIncreaseQuantity={onIncreaseQuantity}
        />
      ) : null}

      <LazyPackageDiscovery
        query={query}
        onQueryChange={onQueryChange}
        loading={loading}
        error={error}
        packages={packages}
        activeLocale={activeLocale}
        selectedPackageSlug={selectedPackage?.slug || ""}
        onSelectPackage={onSelectPackage}
        showInternationalFilters={showInternationalFilters}
        pageTitle={pageTitle}
        sidebarTitle={sidebarTitle}
        sidebarMode={sidebarMode}
        destinationOptions={destinationOptions}
        selectedDestinationLabels={selectedDestinationLabels}
        onToggleDestinationLabel={onToggleDestinationLabel}
        onDestinationLabelsChange={onDestinationLabelsChange}
        onSelectDestinationLabel={onSelectDestinationLabel}
        operatorOptions={operatorOptions}
        selectedOperatorLabels={selectedOperatorLabels}
        onToggleOperatorLabel={onToggleOperatorLabel}
        onSelectPackageFilterSku={onSelectPackageFilterSku}
        packageQuery={packageQuery}
        onPackageQueryChange={onPackageQueryChange}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onPriceRangeChange={onPriceRangeChange}
        showPriceFilters={showPriceFilters}
        showPricePresetFilters={showPricePresetFilters}
        sortMode={sortMode}
        onSortModeChange={onSortModeChange}
        totalPackages={totalPackages}
        hasMorePackages={hasMorePackages}
        onLoadMorePackages={onLoadMorePackages}
      />
    </div>
  );
}
