"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatEsimMoney } from "../lib/esim";
import type { EsimCmsPageContent } from "../lib/cms-content";
import EsimHeroSection from "./EsimHeroSection";
import EsimPackageExplorer from "./EsimPackageExplorer";
import EsimProductSidebar from "./EsimProductSidebar";
import PackageSelectorModal from "./PackageSelectorModal";
import { useEsimCatalog } from "../hooks/useEsimCatalog";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

export default function EsimProductPage({
  footerContent,
  cmsPageContent,
}: {
  footerContent?: ReactNode;
  cmsPageContent?: EsimCmsPageContent | null;
}) {
  const { language } = useLanguage();
  const activeLocale = language === "en" ? "en" : "vi";
  const t = useSimDuLichStaticText(activeLocale);

  const catalog = useEsimCatalog({ cmsPageContent, activeLocale });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 pb-32 pt-32 lg:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          <EsimHeroSection
            selectedPackage={catalog.selectedPackage}
            selectedVariant={catalog.selectedVariant}
          />

          <EsimPackageExplorer
            selectedPackage={catalog.selectedPackage}
            selectedVariant={catalog.selectedVariant}
            serviceTypeLabel={catalog.serviceTypeLabel}
            quantity={catalog.quantity}
            query={catalog.query}
            onQueryChange={catalog.setQuery}
            regionOptions={catalog.regionOptions}
            selectedRegionId={catalog.selectedRegionId}
            onSelectRegion={catalog.setSelectedRegionId}
            loading={catalog.loading}
            error={catalog.error}
            packages={catalog.packages}
            activeLocale={activeLocale}
            onOpenModal={() => catalog.setShowModal(true)}
            onSelectPackage={catalog.handleSelectPackage}
            onSelectSkuByValidity={catalog.handleSelectSkuByValidity}
            onSelectSkuByData={catalog.handleSelectSkuByData}
            onDecreaseQuantity={() => catalog.setQuantity((current) => Math.max(1, current - 1))}
            onIncreaseQuantity={() => catalog.setQuantity((current) => current + 1)}
          />
        </div>

        <EsimProductSidebar
          selectedPackage={catalog.selectedPackage}
          selectedVariant={catalog.selectedVariant}
          selectedVariantMoney={catalog.selectedVariantMoney}
          activeRegionLabel={catalog.activeRegionLabel}
          serviceTypeLabel={catalog.serviceTypeLabel}
          quantity={catalog.quantity}
          total={catalog.total}
          onBookNow={catalog.handleBookNow}
          detailSections={catalog.detailSections}
          openDetailSection={catalog.openDetailSection}
          setOpenDetailSection={catalog.setOpenDetailSection}
        />
      </div>

      <div className="lg:hidden fixed bottom-16 sm:bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
        <div>
          <div className="text-xs text-steel-secondary">{t("Tổng thanh toán")}</div>
          <div className="text-xl font-bold text-hb-coral">
            {formatEsimMoney(
              catalog.total,
              activeLocale === "en" ? "USD" : catalog.selectedVariantMoney.currency
            )}
          </div>
        </div>
        <button
          onClick={catalog.handleBookNow}
          disabled={!catalog.selectedPackage || !catalog.selectedVariant}
          className="bg-hb-coral hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-all"
        >
          {t("Đặt ngay")}
        </button>
      </div>

      {catalog.showModal && catalog.selectedPackage && (
        <PackageSelectorModal
          pkg={catalog.selectedPackage}
          currentSku={catalog.selectedSku}
          locale={activeLocale}
          onSelect={catalog.handleSelectVariant}
          onClose={() => catalog.setShowModal(false)}
        />
      )}

      {footerContent}
    </main>
  );
}
