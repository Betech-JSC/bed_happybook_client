"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import { loadAllEsimPackages, loadEsimOptions } from "../lib/esim-loader";
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
const PRICE_FILTER_CAP = 2_000_000;

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
  const [packageQuery, setPackageQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(() => !hasInitialPackages);
  const [error, setError] = useState("");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [openDetailSection, setOpenDetailSection] = useState<DetailAccordionKey | null>("compatibility");
  const selectedPackageSlugRef = useRef("");
  const selectedSkuRef = useRef("");
  const appliedInitialCategoryRef = useRef("");
  const routeCategory = useMemo(
    () => (initialCategory ? normalizeSimDuLichCategory(initialCategory) : ""),
    [initialCategory]
  );

  const debouncedQuery = useDeferredValue(query.trim());
  const debouncedPackageQuery = useDeferredValue(packageQuery.trim());

  useEffect(() => {
    selectedPackageSlugRef.current = selectedPackageSlug;
  }, [selectedPackageSlug]);

  useEffect(() => {
    selectedSkuRef.current = selectedSku;
  }, [selectedSku]);

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
      } catch (err) {
        console.error("Failed to load eSIM filters", err);
      }
    };

    void loadOptions();

    return () => {
      active = false;
    };
  }, [activeLocale, hasInitialPackages]);

  useEffect(() => {
    appliedInitialCategoryRef.current = "";
    setQuery("");
    setSelectedRegionId("");
    setSelectedDestinationLabels([]);
    setPackageQuery("");
    setPriceRange([0, 0]);
  }, [initialCategory]);

  useEffect(() => {
    if (!filters.regions.length || !initialCategory) return;

    const resolvedRegionId = resolveEsimRegionPreset(filters.regions, initialCategory);
    if (!resolvedRegionId) return;
    if (appliedInitialCategoryRef.current === initialCategory && selectedRegionId === resolvedRegionId) {
      return;
    }

    appliedInitialCategoryRef.current = initialCategory;
    setSelectedRegionId(resolvedRegionId);
  }, [filters.regions, initialCategory, selectedRegionId]);

  useEffect(() => {
    if (hasInitialPackages) {
      setPackages(initialPackages ?? []);
      setLoading(false);
      setError("");
      return;
    }

    let active = true;

    const loadPackages = async () => {
      setLoading(true);
      setError("");

      try {
        const items = await loadAllEsimPackages({
          q: debouncedQuery || undefined,
          region_id: selectedRegionId || undefined,
          locale: activeLocale,
        });

        if (!active) return;

        setPackages(items);

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
          items[0];

        const nextPackage = preferredPackage;

        if (nextPackage.slug !== currentPackageSlug) {
          setSelectedPackageSlug(nextPackage.slug);
        }

        const selectableVariants = getSelectableEsimVariants(nextPackage, activeLocale);
        const nextVariant =
          selectableVariants.find((variant) => variant.sku === currentSku) ||
          selectableVariants[0] ||
          null;

        if (nextVariant && nextVariant.sku !== currentSku) {
          setSelectedSku(nextVariant.sku);
        } else if (!nextVariant) {
          setSelectedSku("");
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

    const timer = setTimeout(() => {
      void loadPackages();
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    activeLocale,
    debouncedQuery,
    hasInitialPackages,
    initialPackageSlug,
    initialPackages,
    initialSelectedPackage,
    selectedRegionId,
    t,
  ]);

  const normalizeText = useCallback(
    (value: string) =>
      value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    []
  );
  const priceBounds = useMemo(() => {
    if (!packages.length) return { min: 0, max: 0 };

    const prices = packages
      .map((pkg) => {
        const cheapest = findCheapestVariant(pkg, activeLocale);
        return cheapest ? getEsimVariantMoney(cheapest, activeLocale).price : null;
      })
      .filter((price): price is number => typeof price === "number" && Number.isFinite(price) && price > 0);

    if (!prices.length) return { min: 0, max: 0 };

    return {
      min: Math.min(...prices),
      max: PRICE_FILTER_CAP,
    };
  }, [activeLocale, packages]);

  useEffect(() => {
    if (!packages.length) {
      setPriceRange([0, 0]);
      return;
    }

    setPriceRange((current) => {
      if (current[0] === 0 && current[1] === 0) {
        return [priceBounds.min, priceBounds.max];
      }

      return [
        Math.max(priceBounds.min, Math.min(current[0], priceBounds.max)),
        Math.max(priceBounds.min, Math.min(current[1], priceBounds.max)),
      ];
    });
  }, [packages.length, priceBounds.max, priceBounds.min]);

  const visiblePackages = useMemo(() => {
    if (!packages.length) return packages;

    const selectedDestinationSet = new Set(selectedDestinationLabels.map((label) => normalizeText(label)));
    const selectedVariantSku = debouncedPackageQuery;

    return packages.filter((pkg) => {
      const cheapest = findCheapestVariant(pkg, activeLocale);
      const money = getEsimVariantMoney(cheapest, activeLocale);
      const sidebarText =
        sidebarFilterMode === "operator"
          ? normalizeText(
              [pkg.operator, pkg.network, pkg.title, pkg.destination, pkg.regionLabel]
                .filter(Boolean)
                .join(" ")
            )
          : normalizeText([pkg.destination, pkg.title, pkg.regionLabel, pkg.coverage].filter(Boolean).join(" "));
      const matchesVariantInfo =
        selectedVariantSku === "" ||
        getSelectableEsimVariants(pkg, activeLocale).some((variant) => variant.sku === selectedVariantSku);
      const matchesDestination =
        selectedDestinationSet.size === 0 ||
        (sidebarText !== "" &&
          Array.from(selectedDestinationSet).some(
            (label) => sidebarText.includes(label) || label.includes(sidebarText)
          ));
      const matchesPrice =
        priceBounds.min === 0 && priceBounds.max === 0
          ? true
          : money.price >= priceRange[0] && money.price <= priceRange[1];

      return matchesDestination && matchesVariantInfo && matchesPrice;
    });
  }, [
    activeLocale,
    debouncedPackageQuery,
    normalizeText,
    packages,
    priceRange,
    priceBounds.max,
    priceBounds.min,
    sidebarFilterMode,
    selectedDestinationLabels,
  ]);

  const sidebarOptions = useMemo<EsimFilterOption[]>(() => {
    if (sidebarFilterMode !== "operator") {
      return filters.destinations;
    }

    const fromPackages: EsimFilterOption[] = [];
    const seen = new Set<string>();

    packages.forEach((pkg) => {
      const label =
        pkg.title?.trim() ||
        pkg.network?.trim() ||
        pkg.operator?.trim() ||
        pkg.destination?.trim() ||
        pkg.regionLabel?.trim() ||
        "";
      const value = pkg.operator?.trim() || pkg.network?.trim() || label;
      const normalizedKey = normalizeText(label || value);

      if (!normalizedKey || seen.has(normalizedKey)) return;
      seen.add(normalizedKey);
      fromPackages.push({ label, value });
    });

    if (fromPackages.length > 0) {
      return fromPackages.sort((a, b) => a.label.localeCompare(b.label, "vi"));
    }

    return filters.operators;
  }, [filters.destinations, filters.operators, normalizeText, packages, sidebarFilterMode]);

  const selectedPackage = useMemo<EsimPackageView | null>(() => {
    if (!visiblePackages.length) return null;
    return (
      visiblePackages.find((item) => item.slug === selectedPackageSlug) ||
      visiblePackages.find((item) => item.slug === initialPackageSlug) ||
      (initialPackageSlug && initialSelectedPackage?.slug === initialPackageSlug ? initialSelectedPackage : null) ||
      visiblePackages[0]
    );
  }, [initialPackageSlug, initialSelectedPackage, selectedPackageSlug, visiblePackages]);

  const selectedVariant = useMemo<EsimVariantView | null>(() => {
    if (!selectedPackage?.variants.length) return null;
    const matchedVariant =
      selectedPackage.variants.find((variant) => variant.sku === selectedSku) || null;
    if (matchedVariant && isEsimVariantSelectable(matchedVariant, activeLocale)) {
      return matchedVariant;
    }

    const fallbackVariant = getSelectableEsimVariants(selectedPackage, activeLocale)[0] || null;
    return fallbackVariant;
  }, [activeLocale, selectedPackage, selectedSku]);

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
      selectableVariants[0]?.sku ||
      "";

    if (nextSku !== selectedSku) {
      setSelectedSku(nextSku);
    }
  }, [activeLocale, selectedPackage, selectedPackageSlug, selectedSku, visiblePackages]);

  const handleSelectPackage = useCallback((pkg: EsimPackageView) => {
    if (routeCategory) {
      router.push(getSimDuLichDetailHref(routeCategory, pkg.slug));
      return;
    }

    const selectableVariants = getSelectableEsimVariants(pkg, activeLocale);
    setSelectedPackageSlug(pkg.slug);
    setSelectedSku(selectableVariants[0]?.sku || "");
    setShowModal(false);
  }, [activeLocale, routeCategory, router]);

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

  const handleSelectDestinationLabel = useCallback((label: string | null) => {
    setSelectedDestinationLabels(label ? [label] : []);
    setQuery("");
    setPackageQuery("");
  }, []);

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
    handleToggleDestinationLabel,
    handleSelectDestinationLabel,
    handleSelectPackageFilterSku,
    packageQuery,
    setPackageQuery,
    priceRange,
    setPriceRange,
    priceBounds,
    packages,
    visiblePackages,
    filters,
    loading,
    error,
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
    handleSelectPackage,
    handleSelectVariant,
    handleSelectSkuByValidity,
    handleSelectSkuByData,
    handleBookNow,
  };
}
