"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatEsimMoney } from "../lib/esim";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import type { EsimPackageView } from "../lib/esim";
import SimDuLichBreadcrumbs from "./SimDuLichBreadcrumbs";
import EsimPackageExplorer from "./EsimPackageExplorer";
import { useEsimCatalog } from "../hooks/useEsimCatalog";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

const EsimInternationalDetailGallery = dynamic(() => import("./EsimInternationalDetailGallery"), {
  loading: () => <div className="aspect-[16/9] w-full rounded-3xl bg-slate-200 animate-pulse" />,
});

const EsimPackageControls = dynamic(() => import("./EsimPackageControls"), {
  loading: () => <div className="h-[240px] rounded-3xl bg-white shadow-sm border border-slate-100 animate-pulse" />,
});

const EsimProductSidebar = dynamic(() => import("./EsimProductSidebar"), {
  loading: () => <div className="min-h-[520px] rounded-3xl bg-white shadow-sm border border-slate-100 animate-pulse" />,
});

const PackageSelectorModal = dynamic(() => import("./PackageSelectorModal"), {
  ssr: false,
});

type SimDuLichCategory = "quoc-te" | "viet-nam";

const pageContainerClassName = "px-3 lg:px-[50px] xl:px-[80px] max__screen";
const detailContainerClassName = "px-3 lg:px-[80px] max__screen";
const pageShellClassName = "bg-gray-100";

const resolveCategoryLabel = (category: SimDuLichCategory, t: (text: string, fallback?: string) => string) =>
  category === "viet-nam"
    ? t("Sim du lịch Việt Nam", "Sim du lịch Việt Nam")
    : t("Sim du lịch quốc tế", "Sim du lịch quốc tế");

const resolveCategoryTitleFallback = (
  category: SimDuLichCategory,
  t: (text: string, fallback?: string) => string
) =>
  category === "viet-nam"
    ? t("eSIM du lịch Việt Nam", "eSIM du lịch Việt Nam")
    : t("eSIM du lịch quốc tế", "eSIM du lịch quốc tế");

const resolveCategoryHref = (category: SimDuLichCategory) =>
  category === "viet-nam" ? "/sim-viet-nam" : "/sim-du-lich/quoc-te";

const resolveSidebarTitle = (category: SimDuLichCategory, t: (text: string, fallback?: string) => string) =>
  category === "viet-nam" ? t("Nhà mạng", "Nhà mạng") : t("Quốc gia", "Quốc gia");

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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

  const category =
    initialCategory === "viet-nam"
      ? "viet-nam"
      : initialCategory === "quoc-te"
        ? "quoc-te"
        : null;
  const isDetailPage = Boolean(initialPackageSlug);
  const categoryLabel = category ? resolveCategoryLabel(category, t) : "";
  const categoryTitleFallback = category ? resolveCategoryTitleFallback(category, t) : t("eSIM du lịch");
  const categorySidebarTitle = category ? resolveSidebarTitle(category, t) : t("Quốc gia");
  const sidebarFilterMode = category === "viet-nam" ? "operator" : "destination";
  const categoryHref = category ? resolveCategoryHref(category) : "";
  const initialPackages = useMemo(
    () => (initialSelectedPackage ? [initialSelectedPackage] : undefined),
    [initialSelectedPackage]
  );

  const catalog = useEsimCatalog({
    cmsPageContent,
    faqItems,
    activeLocale,
    initialCategory,
    initialPackageSlug,
    initialSelectedPackage,
    initialPackages,
    sidebarFilterMode,
  });

  const packageFooterContent = catalog.selectedPackage?.footerContent?.trim() || "";
  const packageDetailSummary =
    stripHtml(packageFooterContent) ||
    catalog.selectedPackage?.subtitle ||
    catalog.selectedPackage?.coverage ||
    "";
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [actionBlockNode, setActionBlockNode] = useState<HTMLDivElement | null>(null);
  const actionBlockRef = useCallback((node: HTMLDivElement | null) => {
    setActionBlockNode(node);
  }, []);
  const [showMobilePaymentBar, setShowMobilePaymentBar] = useState(false);

  const scrollSidebarIntoView = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    window.requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    if (!isDetailPage || typeof window === "undefined") {
      setShowMobilePaymentBar(false);
      return;
    }

    const target = actionBlockNode;
    if (!target) {
      setShowMobilePaymentBar(window.matchMedia("(max-width: 1023px)").matches);
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateVisibility = (isIntersecting: boolean) => {
      setShowMobilePaymentBar(mediaQuery.matches && !isIntersecting);
    };

    const handleMediaChange = () => {
      if (!mediaQuery.matches) {
        setShowMobilePaymentBar(false);
        return;
      }

      const entry = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleHeight = Math.min(entry.bottom, viewportHeight) - Math.max(entry.top, 0);
      const isVisible = visibleHeight > 0;
      updateVisibility(isVisible);
    };

    if (!mediaQuery.matches) {
      setShowMobilePaymentBar(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateVisibility(Boolean(entry?.isIntersecting));
      },
      {
        threshold: 0,
      }
    );

    observer.observe(target);
    handleMediaChange();

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [actionBlockNode, isDetailPage]);

  const breadcrumbItems = category
    ? isDetailPage
      ? [
          { href: "/", label: t("Trang chủ", "Homepage") },
          { href: "/sim-du-lich", label: t("Sim du lịch", "Sim du lịch") },
          { href: categoryHref, label: categoryLabel },
          {
            label:
              catalog.selectedPackage?.title ||
              catalog.selectedPackage?.destination ||
              initialPackageSlug ||
              categoryLabel,
          },
        ]
      : [
          { href: "/", label: t("Trang chủ", "Homepage") },
          { href: "/sim-du-lich", label: t("Sim du lịch", "Sim du lịch") },
          { label: categoryLabel },
        ]
    : [];

  const renderListingShell = () => (
    <div className={pageShellClassName}>
      <div className={`mt-[68px] lg:mt-0 lg:pt-[132px] ${pageContainerClassName}`}>
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
          showInternationalFilters
          pageTitle={categoryLabel || t("Sim du lịch")}
          sidebarTitle={categorySidebarTitle}
          sidebarMode={category === "quoc-te" ? "country" : "generic"}
          destinationOptions={catalog.sidebarOptions}
          selectedDestinationLabels={catalog.selectedDestinationLabels}
          onToggleDestinationLabel={catalog.handleToggleDestinationLabel}
          onDestinationLabelsChange={catalog.setSelectedDestinationLabels}
          operatorOptions={catalog.filters.operators}
          selectedOperatorLabels={catalog.selectedOperatorLabels}
          onToggleOperatorLabel={catalog.handleToggleOperatorLabel}
          onSelectDestinationLabel={catalog.handleSelectDestinationLabel}
          onSelectPackageFilterSku={catalog.handleSelectPackageFilterSku}
          packageQuery={catalog.packageQuery}
          onPackageQueryChange={catalog.setPackageQuery}
          sortMode={catalog.sortMode}
          onSortModeChange={catalog.setSortMode}
          totalPackages={catalog.totalPackages}
          hasMorePackages={catalog.hasMorePackages}
          onLoadMorePackages={catalog.handleLoadMorePackages}
          onOpenModal={() => catalog.setShowModal(true)}
          onSelectPackage={catalog.handleSelectPackage}
          onSelectSkuByValidity={catalog.handleSelectSkuByValidity}
          onSelectSkuByData={catalog.handleSelectSkuByData}
          onDecreaseQuantity={() => catalog.setQuantity((current) => Math.max(1, current - 1))}
          onIncreaseQuantity={() => catalog.setQuantity((current) => current + 1)}
          showPackageControls={false}
        />
      </div>
    </div>
  );

  const renderDetailShell = () => (
    <div className={pageShellClassName}>
      <div className={`mt-[68px] lg:mt-0 lg:pt-[132px] ${detailContainerClassName}`}>
        {breadcrumbItems.length ? (
          <div className="pt-3">
            <SimDuLichBreadcrumbs items={breadcrumbItems} />
          </div>
        ) : null}

        <div className="flex flex-col items-start mt-6 lg:flex-row lg:space-x-8">
          <div className="order-1 w-full space-y-4 lg:order-none lg:w-8/12">
            <EsimInternationalDetailGallery
              selectedPackage={catalog.selectedPackage}
              categoryLabel={categoryLabel}
              titleFallback={categoryTitleFallback}
            />

            <EsimPackageControls
              selectedPackage={catalog.selectedPackage}
              selectedVariant={catalog.selectedVariant}
              serviceTypeLabel={catalog.serviceTypeLabel}
              quantity={catalog.quantity}
              locale={activeLocale}
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

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-midnight-ink">
                {catalog.selectedPackage?.destination || t("Thông tin gói")}
              </h2>
              {packageFooterContent ? (
                <div
                  className="mt-2 space-y-3 text-sm leading-7 text-steel-secondary"
                  dangerouslySetInnerHTML={{ __html: packageFooterContent }}
                />
              ) : (
                <p className="mt-2 text-sm leading-7 text-steel-secondary">{packageDetailSummary}</p>
              )}
            </div>
          </div>

          <div
            ref={sidebarRef}
            className="order-2 mt-4 w-full lg:order-none lg:mt-0 lg:w-4/12 lg:sticky lg:top-[148px] lg:self-start"
          >
            <EsimProductSidebar
              selectedPackage={catalog.selectedPackage}
              selectedVariant={catalog.selectedVariant}
              selectedVariantMoney={catalog.selectedVariantMoney}
              activeRegionLabel={catalog.activeRegionLabel}
              serviceTypeLabel={catalog.serviceTypeLabel}
              titleFallback={categoryTitleFallback}
              quantity={catalog.quantity}
              total={catalog.total}
              onBookNow={catalog.handleBookNow}
              detailSections={catalog.detailSections}
              openDetailSection={catalog.openDetailSection}
              setOpenDetailSection={catalog.setOpenDetailSection}
              sticky={false}
              showDetailHeader
              actionBlockRef={actionBlockRef}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="w-full pb-44 lg:pb-32">
      {isDetailPage ? renderDetailShell() : renderListingShell()}

      {isDetailPage ? (
        <div className="bg-white">
          <div className={detailContainerClassName}>
            {footerContent ? <div className="my-8">{footerContent}</div> : null}
          </div>
        </div>
      ) : null}

      {isDetailPage && showMobilePaymentBar ? (
        <div className="fixed bottom-16 left-0 z-40 flex w-full items-center justify-between border-t border-slate-200 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] lg:hidden sm:bottom-0">
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
            disabled={
              !catalog.selectedPackage ||
              !catalog.selectedVariant ||
              catalog.selectedVariantMoney.price <= 0
            }
            className="rounded-xl bg-hb-coral px-8 py-3 font-bold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("Đặt ngay")}
          </button>
        </div>
      ) : null}

      {catalog.showModal && catalog.selectedPackage ? (
        <PackageSelectorModal
          pkg={catalog.selectedPackage}
          currentSku={catalog.selectedSku}
          locale={activeLocale}
          onSelect={catalog.handleSelectVariant}
          onClose={() => catalog.setShowModal(false)}
        />
      ) : null}

      {!isDetailPage && footerContent ? <div className={pageContainerClassName}>{footerContent}</div> : null}
    </main>
  );
}
