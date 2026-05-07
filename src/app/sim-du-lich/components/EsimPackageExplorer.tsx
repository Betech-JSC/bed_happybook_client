"use client";

import EsimPackageControls from "./EsimPackageControls";
import EsimPackageDiscovery from "./EsimPackageDiscovery";
import type { EsimFilterOption, EsimPackageView, EsimVariantView } from "../lib/esim";

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
  onSelectDestinationLabel?: (label: string | null) => void;
  onSelectPackageFilterSku?: (sku: string | null) => void;
  packageQuery?: string;
  onPackageQueryChange?: (value: string) => void;
  priceRange?: [number, number];
  priceBounds?: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
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
  onSelectDestinationLabel,
  onSelectPackageFilterSku,
  packageQuery,
  onPackageQueryChange,
  priceRange,
  priceBounds,
  onPriceRangeChange,
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
        <EsimPackageControls
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

      <EsimPackageDiscovery
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
        onSelectDestinationLabel={onSelectDestinationLabel}
        onSelectPackageFilterSku={onSelectPackageFilterSku}
        packageQuery={packageQuery}
        onPackageQueryChange={onPackageQueryChange}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onPriceRangeChange={onPriceRangeChange}
      />
    </div>
  );
}
