import type { EsimFilterOption } from "../lib/esim";
import type { DestinationSelectOption, SortMode } from "../lib/esim-discovery";
import EsimPackageDiscoveryDesktopSidebar from "./EsimPackageDiscoveryDesktopSidebar";
import EsimPackageDiscoveryMobileFilters from "./EsimPackageDiscoveryMobileFilters";

const toDisplayOption = (option: EsimFilterOption): DestinationSelectOption => ({
  ...option,
  flag: "🌐",
  displayLabel: option.label ?? String(option.value),
});

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
  operatorOptions?: EsimFilterOption[];
  selectedOperatorLabels?: string[];
  onToggleOperatorLabel?: (label: string) => void;
  priceRange: [number, number];
  priceBounds: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  showPricePresetFilters?: boolean;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
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
  operatorOptions,
  selectedOperatorLabels,
  onToggleOperatorLabel,
  priceRange,
  priceBounds,
  onPriceRangeChange,
  showPriceFilters = true,
  showPricePresetFilters = true,
  sortMode,
  onSortModeChange,
}: Props) {
  if (!showInternationalFilters) return null;

  const isOperatorMode = sidebarMode === "generic";

  return (
    <>
      <EsimPackageDiscoveryMobileFilters
        activeLocale={activeLocale}
        sidebarTitle={sidebarTitle}
        sidebarMode={sidebarMode}
        countryDestinationOptions={countryDestinationOptions}
        genericDestinationOptions={isOperatorMode && operatorOptions ? operatorOptions.map(toDisplayOption) : genericDestinationOptions}
        comboDestinationOptions={comboDestinationOptions}
        selectedDestinationLabels={isOperatorMode && selectedOperatorLabels ? selectedOperatorLabels : selectedDestinationLabels}
        onToggleDestinationLabel={isOperatorMode ? onToggleOperatorLabel : onToggleDestinationLabel}
        onDestinationLabelsChange={onDestinationLabelsChange}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onPriceRangeChange={onPriceRangeChange}
        showPriceFilters={showPriceFilters}
        sortMode={sortMode}
        onSortModeChange={onSortModeChange}
      />

      <div className="hidden lg:block">
        <EsimPackageDiscoveryDesktopSidebar
          activeLocale={activeLocale}
          sidebarTitle={sidebarTitle}
          sidebarMode={sidebarMode}
          showInternationalFilters={showInternationalFilters}
          countryDestinationOptions={countryDestinationOptions}
          genericDestinationOptions={isOperatorMode && operatorOptions ? operatorOptions.map(toDisplayOption) : genericDestinationOptions}
          comboDestinationOptions={comboDestinationOptions}
          selectedDestinationLabels={isOperatorMode && selectedOperatorLabels ? selectedOperatorLabels : selectedDestinationLabels}
          onToggleDestinationLabel={isOperatorMode ? onToggleOperatorLabel : onToggleDestinationLabel}
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
