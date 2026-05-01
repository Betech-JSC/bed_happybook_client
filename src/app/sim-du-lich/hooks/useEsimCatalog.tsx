"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import { loadAllEsimPackages, loadEsimOptions } from "../lib/esim-loader";
import {
  findCheapestVariant,
  getEsimVariantMoney,
  resolveEsimRegionPreset,
  type EsimFilterOptions,
  type EsimPackageView,
  type EsimVariantView,
} from "../lib/esim";
import { getSimDuLichDetailHref, normalizeSimDuLichCategory } from "../lib/routes";
import { useEsimDetailSections } from "./useEsimDetailSections";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

type Locale = "vi" | "en";
type DetailAccordionKey = "compatibility" | "refund" | "faq";

type Args = {
  cmsPageContent: EsimCmsPageContent | null | undefined;
  faqItems?: EsimCmsFaqItem[];
  activeLocale: Locale;
  initialCategory?: string;
  initialPackageSlug?: string;
};

export function useEsimCatalog({
  cmsPageContent,
  faqItems,
  activeLocale,
  initialCategory,
  initialPackageSlug,
}: Args) {
  const router = useRouter();
  const t = useSimDuLichStaticText(activeLocale);
  const [query, setQuery] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [packages, setPackages] = useState<EsimPackageView[]>([]);
  const [filters, setFilters] = useState<EsimFilterOptions>({
    regions: [],
    destinations: [],
    operators: [],
  });
  const [selectedDestinationLabels, setSelectedDestinationLabels] = useState<string[]>([]);
  const [packageQuery, setPackageQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(true);
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
  }, [activeLocale]);

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
          items[0];

        const nextPackage = preferredPackage;

        if (nextPackage.slug !== currentPackageSlug) {
          setSelectedPackageSlug(nextPackage.slug);
        }

        const nextVariant =
          nextPackage.variants.find((variant) => variant.sku === currentSku) ||
          nextPackage.variants[0];

        if (nextVariant && nextVariant.sku !== currentSku) {
          setSelectedSku(nextVariant.sku);
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
  }, [activeLocale, debouncedQuery, initialPackageSlug, selectedRegionId, t]);

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
        return cheapest ? getEsimVariantMoney(cheapest, activeLocale).price : 0;
      })
      .filter((price) => Number.isFinite(price));

    if (!prices.length) return { min: 0, max: 0 };

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
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
      const destinationText = normalizeText(pkg.destination || pkg.title || pkg.regionLabel || "");
      const titleText = normalizeText(pkg.title || "");
      const matchesVariantInfo =
        selectedVariantSku === "" ||
        pkg.variants.some((variant) => variant.sku === selectedVariantSku);
      const matchesDestination =
        selectedDestinationSet.size === 0 ||
        Array.from(selectedDestinationSet).some(
          (label) => destinationText.includes(label) || titleText.includes(label) || label.includes(destinationText)
        );
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
    selectedDestinationLabels,
  ]);

  const selectedPackage = useMemo<EsimPackageView | null>(() => {
    if (!visiblePackages.length) return null;
    return visiblePackages.find((item) => item.slug === selectedPackageSlug) || visiblePackages[0];
  }, [selectedPackageSlug, visiblePackages]);

  const selectedVariant = useMemo<EsimVariantView | null>(() => {
    if (!selectedPackage?.variants.length) return null;
    return (
      selectedPackage.variants.find((variant) => variant.sku === selectedSku) ||
      selectedPackage.variants[0] ||
      null
    );
  }, [selectedPackage, selectedSku]);

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

    const currentVariant = selectedPackage.variants.find((variant) => variant.sku === selectedSku);
    if (!currentVariant) {
      setSelectedSku(selectedPackage.variants[0].sku);
    }
  }, [selectedPackage, selectedPackageSlug, selectedSku, visiblePackages]);

  const handleSelectPackage = useCallback((pkg: EsimPackageView) => {
    if (routeCategory) {
      router.push(getSimDuLichDetailHref(routeCategory, pkg.slug));
      return;
    }

    setSelectedPackageSlug(pkg.slug);
    setSelectedSku(pkg.variants[0]?.sku || "");
    setShowModal(false);
  }, [routeCategory, router]);

  const handleSelectVariant = useCallback((variant: EsimVariantView) => {
    setSelectedSku(variant.sku);
    setShowModal(false);
  }, []);

  const handleSelectSkuByValidity = useCallback(
    (validity: number) => {
      if (!selectedPackage) return;
      const match = selectedPackage.variants.find((variant) => variant.validity === validity);
      if (match) setSelectedSku(match.sku);
    },
    [selectedPackage]
  );

  const handleSelectSkuByData = useCallback(
    (data: string) => {
      if (!selectedPackage) return;
      const match = selectedPackage.variants.find((variant) => variant.data === data);
      if (match) setSelectedSku(match.sku);
    },
    [selectedPackage]
  );

  const handleBookNow = useCallback(() => {
    if (!selectedPackage || !selectedVariant) return;

    const params = new URLSearchParams({
      pkg: selectedPackage.slug,
      sku: selectedSku,
      qty: String(quantity),
    });
    router.push(`/sim-du-lich/checkout?${params.toString()}`);
  }, [quantity, router, selectedPackage, selectedSku, selectedVariant]);

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

      if (matchedVariant) {
        setSelectedSku(matchedVariant.sku);
      }
    },
    [packages]
  );

  const activeRegionLabel =
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
    serviceTypeLabel,
    detailSections,
    handleSelectPackage,
    handleSelectVariant,
    handleSelectSkuByValidity,
    handleSelectSkuByData,
    handleBookNow,
  };
}
