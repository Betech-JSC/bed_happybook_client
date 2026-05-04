"use client";

import { useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatEsimMoney } from "../lib/esim";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import type { EsimPackageView } from "../lib/esim";
import EsimHeroSection from "./EsimHeroSection";
import EsimInternationalDetailGallery from "./EsimInternationalDetailGallery";
import EsimPackageControls from "./EsimPackageControls";
import SimDuLichBreadcrumbs from "./SimDuLichBreadcrumbs";
import EsimPackageExplorer from "./EsimPackageExplorer";
import EsimProductSidebar from "./EsimProductSidebar";
import PackageSelectorModal from "./PackageSelectorModal";
import { useEsimCatalog } from "../hooks/useEsimCatalog";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

export default function EsimProductPage({
  footerContent,
  cmsPageContent,
  faqItems,
  initialCategory,
  initialPackageSlug,
  initialSelectedPackage,
}: {
  footerContent?: ReactNode;
  cmsPageContent?: EsimCmsPageContent | null;
  faqItems?: EsimCmsFaqItem[];
  initialCategory?: string;
  initialPackageSlug?: string;
  initialSelectedPackage?: EsimPackageView | null;
}) {
  const { language } = useLanguage();
  const activeLocale = language === "en" ? "en" : "vi";
  const t = useSimDuLichStaticText(activeLocale);

  const catalog = useEsimCatalog({
    cmsPageContent,
    faqItems,
    activeLocale,
    initialCategory,
    initialPackageSlug,
    initialSelectedPackage,
  });
  const packageFooterContent = catalog.selectedPackage?.footerContent?.trim() || "";
  const isInternationalPage = initialCategory === "quoc-te";
  const showInternationalListExtras = isInternationalPage && !initialPackageSlug;
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const scrollSidebarIntoView = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    window.requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const breadcrumbItems = (() => {
    const baseItems = [{ href: "/", label: t("Trang chủ", "Homepage") }];

    if (initialCategory === "quoc-te") {
      const categoryItem = {
        href: "/sim-du-lich",
        label: t("Sim du lịch", "Sim du lịch"),
      };
      const subCategoryItem = {
        href: initialPackageSlug ? "/sim-du-lich/quoc-te" : undefined,
        label: t("Sim du lịch quốc tế", "Sim du lịch quốc tế"),
      };

      return initialPackageSlug && catalog.selectedPackage?.title
        ? [...baseItems, categoryItem, subCategoryItem, { label: catalog.selectedPackage.title }]
        : [...baseItems, categoryItem, subCategoryItem];
    }

    if (initialCategory === "viet-nam") {
      const categoryItem = {
        href: "/sim-du-lich",
        label: t("Sim du lịch", "Sim du lịch"),
      };
      const subCategoryItem = {
        href: initialPackageSlug ? "/sim-viet-nam" : undefined,
        label: t("Sim du lịch Việt Nam", "Sim du lịch Việt Nam"),
      };

      return initialPackageSlug && catalog.selectedPackage?.title
        ? [...baseItems, categoryItem, subCategoryItem, { label: catalog.selectedPackage.title }]
        : [...baseItems, categoryItem, subCategoryItem];
    }

    return [];
  })();

  const isInternationalDetail = initialCategory === "quoc-te" && Boolean(initialPackageSlug);

  const renderInternationalShell = () => (
    isInternationalDetail ? (
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          {breadcrumbItems.length ? (
            <div className="pt-3">
              <SimDuLichBreadcrumbs items={breadcrumbItems} />
            </div>
          ) : null}

          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0 space-y-4">
              <EsimInternationalDetailGallery selectedPackage={catalog.selectedPackage} />

              <EsimPackageControls
                selectedPackage={catalog.selectedPackage}
                selectedVariant={catalog.selectedVariant}
                serviceTypeLabel={catalog.serviceTypeLabel}
                quantity={catalog.quantity}
                onOpenModal={() => catalog.setShowModal(true)}
                onSelectSkuByValidity={(validity) => {
                  catalog.handleSelectSkuByValidity(validity);
                  scrollSidebarIntoView();
                }}
                onSelectSkuByData={(data) => {
                  catalog.handleSelectSkuByData(data);
                  scrollSidebarIntoView();
                }}
                onDecreaseQuantity={() => catalog.setQuantity((current) => Math.max(1, current - 1))}
                onIncreaseQuantity={() => catalog.setQuantity((current) => current + 1)}
              />

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-midnight-ink">
                  {catalog.selectedPackage?.destination || t("Thông tin gói")}
                </h2>
                <p className="mt-2 text-sm leading-7 text-steel-secondary">
                  {catalog.selectedPackage?.subtitle || catalog.selectedPackage?.coverage || ""}
                </p>
              </div>
            </div>

            <div ref={sidebarRef} className="w-full lg:w-4/12 lg:sticky lg:top-[148px] lg:self-start">
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
                sticky={false}
                showDetailHeader
              />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          {breadcrumbItems.length ? (
            <div className="pt-3">
              <SimDuLichBreadcrumbs items={breadcrumbItems} />
            </div>
          ) : null}

          <EsimPackageExplorer
            selectedPackage={catalog.selectedPackage}
            selectedVariant={catalog.selectedVariant}
            serviceTypeLabel={catalog.serviceTypeLabel}
            quantity={catalog.quantity}
            query={catalog.query}
            onQueryChange={catalog.setQuery}
            loading={catalog.loading}
            error={catalog.error}
            packages={catalog.visiblePackages}
            activeLocale={activeLocale}
            showInternationalFilters={initialCategory === "quoc-te"}
            destinationOptions={catalog.filters.destinations}
            selectedDestinationLabels={catalog.selectedDestinationLabels}
            onToggleDestinationLabel={catalog.handleToggleDestinationLabel}
            onSelectDestinationLabel={catalog.handleSelectDestinationLabel}
            onSelectPackageFilterSku={catalog.handleSelectPackageFilterSku}
            packageQuery={catalog.packageQuery}
            onPackageQueryChange={catalog.setPackageQuery}
            priceRange={catalog.priceRange}
            priceBounds={catalog.priceBounds}
            onPriceRangeChange={catalog.setPriceRange}
            onOpenModal={() => catalog.setShowModal(true)}
            onSelectPackage={catalog.handleSelectPackage}
            onSelectSkuByValidity={catalog.handleSelectSkuByValidity}
            onSelectSkuByData={catalog.handleSelectSkuByData}
            onDecreaseQuantity={() => catalog.setQuantity((current) => Math.max(1, current - 1))}
            onIncreaseQuantity={() => catalog.setQuantity((current) => current + 1)}
            showPackageControls={false}
          />

          <div ref={sidebarRef} className="mt-8 pb-8 lg:sticky lg:top-[148px] lg:self-start">
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
              sticky={false}
              showDetailSections={false}
              showActionBlock={false}
              showInfoBlock={false}
            />
          </div>
        </div>
      </div>
    )
  );

  const renderDomesticShell = () => (
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
          loading={catalog.loading}
          error={catalog.error}
          packages={catalog.visiblePackages}
          activeLocale={activeLocale}
          showInternationalFilters={initialCategory === "quoc-te"}
          destinationOptions={catalog.filters.destinations}
          selectedDestinationLabels={catalog.selectedDestinationLabels}
          onToggleDestinationLabel={catalog.handleToggleDestinationLabel}
          onSelectDestinationLabel={catalog.handleSelectDestinationLabel}
          onSelectPackageFilterSku={catalog.handleSelectPackageFilterSku}
          packageQuery={catalog.packageQuery}
          onPackageQueryChange={catalog.setPackageQuery}
          priceRange={catalog.priceRange}
          priceBounds={catalog.priceBounds}
          onPriceRangeChange={catalog.setPriceRange}
          onOpenModal={() => catalog.setShowModal(true)}
          onSelectPackage={catalog.handleSelectPackage}
          onSelectSkuByValidity={catalog.handleSelectSkuByValidity}
          onSelectSkuByData={catalog.handleSelectSkuByData}
          onDecreaseQuantity={() => catalog.setQuantity((current) => Math.max(1, current - 1))}
          onIncreaseQuantity={() => catalog.setQuantity((current) => current + 1)}
        />
      </div>

      <div className="lg:sticky lg:top-[148px] lg:self-start">
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
    </div>
  );

  return (
    <main className={isInternationalPage ? "w-full pb-32" : "max-w-7xl mx-auto px-6 py-8 pb-32 pt-32 lg:pt-40"}>
      {isInternationalPage ? (
        renderInternationalShell()
      ) : (
        renderDomesticShell()
      )}

      {!showInternationalListExtras && packageFooterContent ? (
        <section
          className={
            isInternationalPage
              ? "mx-3 lg:mx-[50px] xl:mx-[80px] max__screen mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              : "mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          }
        >
          <h3 className="mb-3 text-sm font-bold text-midnight-ink">{t("Nội dung")}</h3>
          <div
            className="space-y-3 text-sm leading-relaxed text-steel-secondary"
            dangerouslySetInnerHTML={{ __html: packageFooterContent }}
          />
        </section>
      ) : null}

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
