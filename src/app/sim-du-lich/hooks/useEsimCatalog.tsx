"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EsimCmsFaqItem, EsimCmsPageContent } from "../lib/cms-content";
import { loadAllEsimPackages, loadEsimOptions } from "../lib/esim-loader";
import {
  getEsimVariantMoney,
  type EsimFilterOptions,
  type EsimPackageView,
  type EsimVariantView,
} from "../lib/esim";
import { useEsimDetailSections } from "./useEsimDetailSections";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

type Locale = "vi" | "en";
type DetailAccordionKey = "compatibility" | "refund" | "faq";

type Args = {
  cmsPageContent: EsimCmsPageContent | null | undefined;
  faqItems?: EsimCmsFaqItem[];
  activeLocale: Locale;
};

export function useEsimCatalog({ cmsPageContent, faqItems, activeLocale }: Args) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackageSlug, setSelectedPackageSlug] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [openDetailSection, setOpenDetailSection] = useState<DetailAccordionKey | null>("compatibility");
  const selectedPackageSlugRef = useRef("");
  const selectedSkuRef = useRef("");

  const debouncedQuery = useDeferredValue(query.trim());

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

        const nextPackage = items.find((item) => item.slug === currentPackageSlug) || items[0];

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
  }, [activeLocale, debouncedQuery, selectedRegionId, t]);

  const selectedPackage = useMemo<EsimPackageView | null>(() => {
    if (!packages.length) return null;
    return packages.find((item) => item.slug === selectedPackageSlug) || packages[0];
  }, [packages, selectedPackageSlug]);

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

  useEffect(() => {
    if (!selectedPackage || !selectedPackage.variants.length) return;

    if (!selectedPackageSlug) {
      setSelectedPackageSlug(selectedPackage.slug);
    }

    const currentVariant = selectedPackage.variants.find((variant) => variant.sku === selectedSku);
    if (!currentVariant) {
      setSelectedSku(selectedPackage.variants[0].sku);
    }
  }, [selectedPackage, selectedPackageSlug, selectedSku]);

  const subtotal = selectedVariant ? selectedVariantMoney.price * quantity : 0;
  const serviceFee = selectedVariant ? selectedVariantMoney.serviceFeeAmount * quantity : 0;
  const total = subtotal + serviceFee;

  const handleSelectPackage = useCallback((pkg: EsimPackageView) => {
    setSelectedPackageSlug(pkg.slug);
    setSelectedSku(pkg.variants[0]?.sku || "");
    setShowModal(false);
  }, []);

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
    packages,
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
