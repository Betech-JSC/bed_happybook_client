"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import { loadEsimOptions, loadEsimPackagesPage, type EsimSortMode } from "../lib/esim-loader";
import {
  findCheapestVariant,
  getEsimVariantMoney,
  getSelectableEsimVariants,
  isEsimVariantSelectable,
  resolveEsimRegionPreset,
  type EsimFilterOption,
  type EsimFilterOptions,
  type EsimPackageView,
  type EsimVariantView,
} from "../lib/esim";
import { getSimDuLichDetailHref, normalizeSimDuLichCategory } from "../lib/routes";
import { useEsimDetailSections } from "./useEsimDetailSections";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

type Locale = "vi" | "en";
type DetailAccordionKey = "compatibility" | "refund" | "faq";
type SidebarFilterMode = "destination" | "operator";
const ESIM_LIST_PAGE_SIZE = 12;

type Args = {
  cmsPageContent: EsimCmsPageContent | null | undefined;
  faqItems?: EsimCmsFaqItem[];
  activeLocale: Locale;
  initialCategory?: string;
  initialPackageSlug?: string;
  initialSelectedPackage?: EsimPackageView | null;
  initialPackages?: EsimPackageView[];
  sidebarFilterMode?: SidebarFilterMode;
};

export function useEsimCatalog({
  cmsPageContent,
  faqItems,
  activeLocale,
  initialCategory,
  initialPackageSlug,
  initialSelectedPackage,
  initialPackages,
  sidebarFilterMode = "destination",
}: Args) {
  const router = useRouter();
  const t = useSimDuLichStaticText(activeLocale);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 1023px)").matches;
  });
  const [query, setQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const hasInitialPackages = Boolean(initialPackages?.length);
  const [packages, setPackages] = useState<EsimPackageView[]>(() => initialPackages ?? []);
  const [filters, setFilters] = useState<EsimFilterOptions>({
    regions: [],
    destinations: [],
    operators: [],
  });
  const [selectedDestinationLabels, setSelectedDestinationLabels] = useState<string[]>([]);
  const [selectedOperatorLabels, setSelectedOperatorLabels] = useState<string[]>([]);
  const [packageQuery, setPackageQuery] = useState("");
  const [sortMode, setSortMode] = useState<EsimSortMode>("price-asc");
  const [page, setPage] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(() => !hasInitialPackages);
  const [error, setError] = useState("");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [openDetailSection, setOpenDetailSection] = useState<DetailAccordionKey | null>("compatibility");
  const [initialRegionReady, setInitialRegionReady] = useState(() => !initialCategory);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const selectedPackageSlugRef = useRef("");
  const selectedSkuRef = useRef("");
  const packagesRef = useRef<EsimPackageView[]>(initialPackages ?? []);
  const appliedInitialCategoryRef = useRef("");
  const routeCategory = useMemo(
    () => (initialCategory ? normalizeSimDuLichCategory(initialCategory) : ""),
    [initialCategory]
  );

  const debouncedQuery = useDeferredValue(query.trim());
  const debouncedPackageQuery = useDeferredValue(packageQuery.trim());
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(query.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    selectedPackageSlugRef.current = selectedPackageSlug;
  }, [selectedPackageSlug]);

  useEffect(() => {
    selectedSkuRef.current = selectedSku;
  }, [selectedSku]);

  useEffect(() => {
    packagesRef.current = packages;
  }, [packages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    updateViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewport);
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    mediaQuery.addListener(updateViewport);
    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  useEffect(() => {
    if (hasInitialPackages) {
      setFilters({
        regions: [],
        destinations: [],
        operators: [],
      });
      return;
    }

    let active = true;

    const loadOptions = async () => {
      try {
        const data = await loadEsimOptions(activeLocale);
        if (!active) return;
        setFilters(data);
        setFiltersLoaded(true);
      } catch (err) {
        console.error("Failed to load eSIM filters", err);
        if (!active) return;
        setFiltersLoaded(true);
        setInitialRegionReady(true);
      }
    };

    void loadOptions();

    return () => {
      active = false;
    };
  }, [activeLocale, hasInitialPackages]);

  useEffect(() => {
    setInitialRegionReady(!initialCategory);
    appliedInitialCategoryRef.current = "";
    setQuery("");
    setSelectedRegionId("");
    setSelectedDestinationLabels([]);
    setSelectedOperatorLabels([]);
    setPackageQuery("");
    setPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, selectedRegionId, selectedDestinationLabels, sortMode]);

  useEffect(() => {
    if (!initialCategory || !filtersLoaded) return;

    if (!filters.regions.length) {
      setInitialRegionReady(true);
      return;
    }

    const resolvedRegionId = resolveEsimRegionPreset(filters.regions, initialCategory);
    if (resolvedRegionId) {
      if (appliedInitialCategoryRef.current === initialCategory && selectedRegionId === resolvedRegionId) {
        setInitialRegionReady(true);
        return;
      }

      appliedInitialCategoryRef.current = initialCategory;
      setSelectedRegionId(resolvedRegionId);
      setInitialRegionReady(true);
      return;
    }

    setInitialRegionReady(true);
  }, [filters.regions, filtersLoaded, initialCategory, selectedRegionId]);

  useEffect(() => {
    if (hasInitialPackages) {
      setPackages(initialPackages ?? []);
      setLoading(false);
      setError("");
      return;
    }

    if (initialCategory && !initialRegionReady) {
      setLoading(true);
      setError("");
      return;
    }

    let active = true;

    const loadPackages = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await loadEsimPackagesPage({
          q: debouncedSearchQuery || undefined,
          region_id: selectedRegionId || undefined,
          destination_ids: sidebarFilterMode === "destination" ? selectedDestinationLabels : [],
          operators: sidebarFilterMode === "operator" ? selectedOperatorLabels : [],
          sort: sortMode,
          page,
          page_size: ESIM_LIST_PAGE_SIZE,
          locale: activeLocale,
        });
        const items = page > 1 ? [...packagesRef.current, ...result.items] : result.items;

        if (!active) return;

        setPackages(items);
        setTotalPackages(result.total);
        setLastPage(result.lastPage);

        if (items.length === 0) {
          setSelectedPackageSlug("");
          setSelectedSku("");
          return;
        }

        const currentPackageSlug = selectedPackageSlugRef.current;
        const currentSku = selectedSkuRef.current;

        const preferredPackage =
          items.find((item) => item.slug === initialPackageSlug) ||
          items.find((item) => item.slug === currentPackageSlug) ||
          (initialPackageSlug && initialSelectedPackage?.slug === initialPackageSlug
            ? initialSelectedPackage
            : null) ||
          (!isMobileViewport ? items[0] : null);

        if (!preferredPackage) {
          if (!isMobileViewport) {
            setSelectedPackageSlug(items[0].slug);
            const defaultVariants = getSelectableEsimVariants(items[0], activeLocale);
            setSelectedSku(defaultVariants[0]?.sku || "");
          }
          return;
        }

        const nextPackage = preferredPackage;

        if (nextPackage.slug !== currentPackageSlug) {
          setSelectedPackageSlug(nextPackage.slug);
        }

        const selectableVariants = getSelectableEsimVariants(nextPackage, activeLocale);
        const nextVariant =
          selectableVariants.find((variant) => variant.sku === currentSku) ||
          (!isMobileViewport ? selectableVariants[0] || null : null) ||
          null;

        if (nextVariant && nextVariant.sku !== currentSku) {
          setSelectedSku(nextVariant.sku);
        } else if (!nextVariant) {
          if (currentSku) {
            setSelectedSku("");
          }
        }
      } catch (err) {
        if (!active) return;
        console.error("Failed to load eSIM packages", err);
        setPackages([]);
        setError(t("Không thể tải dữ liệu eSIM. Vui lòng thử lại sau."));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPackages();

    return () => {
      active = false;
    };
  }, [
    activeLocale,
    debouncedSearchQuery,
    debouncedPackageQuery,
    hasInitialPackages,
    initialPackageSlug,
    initialPackages,
    initialSelectedPackage,
    initialCategory,
    initialRegionReady,
    isMobileViewport,
    page,
    selectedDestinationLabels,
    selectedOperatorLabels,
    selectedRegionId,
    sidebarFilterMode,
    sortMode,
    t,
  ]);

  const visiblePackages = useMemo(() => {
    if (!packages.length) return packages;

    const selectedVariantSku = debouncedPackageQuery;

    return packages.filter((pkg) => {
      const matchesVariantInfo =
        selectedVariantSku === "" ||
        getSelectableEsimVariants(pkg, activeLocale).some((variant) => variant.sku === selectedVariantSku);

      return matchesVariantInfo;
    });
  }, [
    activeLocale,
    debouncedPackageQuery,
    packages,
  ]);

  const sidebarOptions = useMemo<EsimFilterOption[]>(() => {
    if (sidebarFilterMode !== "operator") {
      return filters.destinations;
    }

    return filters.operators;
  }, [filters.destinations, filters.operators, sidebarFilterMode]);

  const selectedPackage = useMemo<EsimPackageView | null>(() => {
    if (!visiblePackages.length) return null;
    return (
      visiblePackages.find((item) => item.slug === selectedPackageSlug) ||
      visiblePackages.find((item) => item.slug === initialPackageSlug) ||
      (initialPackageSlug && initialSelectedPackage?.slug === initialPackageSlug ? initialSelectedPackage : null) ||
      (!isMobileViewport ? visiblePackages[0] : null)
    );
  }, [initialPackageSlug, initialSelectedPackage, isMobileViewport, selectedPackageSlug, visiblePackages]);

  const selectedVariant = useMemo<EsimVariantView | null>(() => {
    if (!selectedPackage?.variants.length) return null;
    const matchedVariant =
      selectedPackage.variants.find((variant) => variant.sku === selectedSku) || null;
    if (matchedVariant && isEsimVariantSelectable(matchedVariant, activeLocale)) {
      return matchedVariant;
    }

    if (isMobileViewport) {
      return null;
    }

    const fallbackVariant = getSelectableEsimVariants(selectedPackage, activeLocale)[0] || null;
    return fallbackVariant;
  }, [activeLocale, isMobileViewport, selectedPackage, selectedSku]);

  const selectedVariantMoney = useMemo(
    () => getEsimVariantMoney(selectedVariant, activeLocale),
    [activeLocale, selectedVariant]
  );

  const subtotal = selectedVariant ? selectedVariantMoney.price * quantity : 0;
  const serviceFee = selectedVariant ? selectedVariantMoney.serviceFeeAmount * quantity : 0;
  const total = subtotal + serviceFee;

  useEffect(() => {
    if (!selectedPackage || !selectedPackage.variants.length) return;

    if (!selectedPackageSlug || !visiblePackages.some((item) => item.slug === selectedPackageSlug)) {
      setSelectedPackageSlug(selectedPackage.slug);
    }

    const selectableVariants = getSelectableEsimVariants(selectedPackage, activeLocale);
    const nextSku =
      selectableVariants.find((variant) => variant.sku === selectedSku)?.sku ||
      (!isMobileViewport ? selectableVariants[0]?.sku : "") ||
      "";

    if (nextSku !== selectedSku) {
      setSelectedSku(nextSku);
    }
  }, [activeLocale, isMobileViewport, selectedPackage, selectedPackageSlug, selectedSku, visiblePackages]);

  const handleSelectPackage = useCallback((pkg: EsimPackageView) => {
    if (routeCategory) {
      router.push(getSimDuLichDetailHref(routeCategory, pkg.slug));
      return;
    }

    const selectableVariants = getSelectableEsimVariants(pkg, activeLocale);
    setSelectedPackageSlug(pkg.slug);
    setSelectedSku(isMobileViewport ? "" : selectableVariants[0]?.sku || "");
    setShowModal(false);
  }, [activeLocale, isMobileViewport, routeCategory, router]);

  const handleSelectVariant = useCallback((variant: EsimVariantView) => {
    if (!isEsimVariantSelectable(variant, activeLocale)) return;
    setSelectedSku(variant.sku);
    setShowModal(false);
  }, [activeLocale]);

  const handleSelectSkuByValidity = useCallback(
    (validity: number) => {
      if (!selectedPackage) return;
      const selectableVariants = getSelectableEsimVariants(selectedPackage, activeLocale);
      const match =
        selectableVariants.find(
          (variant) => variant.validity === validity && variant.data === selectedVariant?.data
        ) ||
        selectableVariants.find((variant) => variant.validity === validity);
      if (match) setSelectedSku(match.sku);
    },
    [activeLocale, selectedPackage, selectedVariant?.data]
  );

  const handleSelectSkuByData = useCallback(
    (data: string) => {
      if (!selectedPackage) return;
      const selectableVariants = getSelectableEsimVariants(selectedPackage, activeLocale);
      const match =
        selectableVariants.find(
          (variant) => variant.data === data && variant.validity === selectedVariant?.validity
        ) ||
        selectableVariants.find((variant) => variant.data === data);
      if (match) setSelectedSku(match.sku);
    },
    [activeLocale, selectedPackage, selectedVariant?.validity]
  );

  const handleBookNow = useCallback(() => {
    if (!selectedPackage || !selectedVariant || !isEsimVariantSelectable(selectedVariant, activeLocale)) return;

    const params = new URLSearchParams({
      pkg: selectedPackage.slug,
      sku: selectedVariant.sku,
      qty: String(quantity),
    });
    router.push(`/sim-du-lich/checkout?${params.toString()}`);
  }, [activeLocale, quantity, router, selectedPackage, selectedVariant]);

  const regionOptions = useMemo(
    () => [{ value: "", label: t("Tất cả") }, ...filters.regions],
    [filters.regions, t]
  );

  const handleToggleDestinationLabel = useCallback((label: string) => {
    setSelectedDestinationLabels((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }, []);

  const handleToggleOperatorLabel = useCallback((label: string) => {
    setSelectedOperatorLabels((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  }, []);

  const handleSelectDestinationLabel = useCallback((label: string | null) => {
    setSelectedDestinationLabels(label ? [label] : []);
    setQuery("");
    setPackageQuery("");
  }, []);

  const handleLoadMorePackages = useCallback(() => {
    if (loading || page >= lastPage) return;
    setPage((current) => current + 1);
  }, [lastPage, loading, page]);

  const handleSelectPackageFilterSku = useCallback(
    (sku: string | null) => {
      setPackageQuery(sku || "");

      if (!sku) return;

      const matchedPackage = packages.find((pkg) => pkg.variants.some((variant) => variant.sku === sku));
      const matchedVariant = matchedPackage?.variants.find((variant) => variant.sku === sku);

      if (matchedPackage) {
        setSelectedPackageSlug(matchedPackage.slug);
      }

      if (matchedVariant && isEsimVariantSelectable(matchedVariant, activeLocale)) {
        setSelectedSku(matchedVariant.sku);
      } else {
        setSelectedSku("");
      }
    },
    [activeLocale, packages]
  );

  const activeRegionLabel =
    selectedPackage?.regionLabel ||
    regionOptions.find((item) => item.value === selectedRegionId)?.label || t("Tất cả");

  const serviceTypeLabel = selectedVariant
    ? selectedVariant.phoneNumberIncluded
      ? t("Có số điện thoại")
      : selectedVariant.unlimited
        ? t("Không giới hạn")
        : t("Chỉ internet")
    : t("Chỉ internet");

  const detailSections = useEsimDetailSections({
    cmsPageContent,
    selectedPackage,
    faqItems,
    activeLocale,
  });

  return {
    query,
    setQuery,
    selectedRegionId,
    setSelectedRegionId,
    selectedDestinationLabels,
    setSelectedDestinationLabels,
    selectedOperatorLabels,
    setSelectedOperatorLabels,
    handleToggleDestinationLabel,
    handleToggleOperatorLabel,
    handleSelectDestinationLabel,
    handleSelectPackageFilterSku,
    packageQuery,
    setPackageQuery,
    packages,
    visiblePackages,
    filters,
    loading,
    error,
    sortMode,
    setSortMode,
    totalPackages,
    hasMorePackages: page < lastPage,
    selectedPackageSlug,
    selectedSku,
    selectedPackage,
    selectedVariant,
    selectedVariantMoney,
    quantity,
    setQuantity,
    showModal,
    setShowModal,
    openDetailSection,
    setOpenDetailSection,
    subtotal,
    serviceFee,
    total,
    regionOptions,
    activeRegionLabel,
    sidebarOptions,
    serviceTypeLabel,
    detailSections,
    handleLoadMorePackages,
    handleSelectPackage,
    handleSelectVariant,
    handleSelectSkuByValidity,
    handleSelectSkuByData,
    handleBookNow,
  };
}
