"use client";

import EsimPackageControls from "./EsimPackageControls";
import EsimPackageDiscovery from "./EsimPackageDiscovery";
import type { EsimPackageView, EsimVariantView } from "../lib/esim";

type RegionOption = { value: string; label: string };

type Props = {
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
  serviceTypeLabel: string;
  quantity: number;
  query: string;
  onQueryChange: (value: string) => void;
  regionOptions: RegionOption[];
  selectedRegionId: string;
  onSelectRegion: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
  onOpenModal: () => void;
  onSelectPackage: (pkg: EsimPackageView) => void;
  onSelectSkuByValidity: (validity: number) => void;
  onSelectSkuByData: (data: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
};

export default function EsimPackageExplorer({
  selectedPackage,
  selectedVariant,
  serviceTypeLabel,
  quantity,
  query,
  onQueryChange,
  regionOptions,
  selectedRegionId,
  onSelectRegion,
  loading,
  error,
  packages,
  activeLocale,
  onOpenModal,
  onSelectPackage,
  onSelectSkuByValidity,
  onSelectSkuByData,
  onDecreaseQuantity,
  onIncreaseQuantity,
}: Props) {
  return (
    <div className="space-y-8">
      <EsimPackageControls
        selectedPackage={selectedPackage}
        selectedVariant={selectedVariant}
        serviceTypeLabel={serviceTypeLabel}
        quantity={quantity}
        onOpenModal={onOpenModal}
        onSelectSkuByValidity={onSelectSkuByValidity}
        onSelectSkuByData={onSelectSkuByData}
        onDecreaseQuantity={onDecreaseQuantity}
        onIncreaseQuantity={onIncreaseQuantity}
      />

      <EsimPackageDiscovery
        query={query}
        onQueryChange={onQueryChange}
        regionOptions={regionOptions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={onSelectRegion}
        loading={loading}
        error={error}
        packages={packages}
        activeLocale={activeLocale}
        selectedPackageSlug={selectedPackage?.slug || ""}
        onSelectPackage={onSelectPackage}
      />
    </div>
  );
}
