"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatEsimMoney, getEsimVariantMoney, type EsimPackageView, type EsimVariantView } from "../lib/esim";
import { loadEsimPackageBySlug } from "../lib/esim-loader";
import { ProductEsimApi } from "@/api/ProductEsim";
import type { EsimCheckoutData, EsimQuoteData, PaymentMethod } from "../checkout/types";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

const unwrapResponseData = (payload: unknown): any => {
  if (!payload || typeof payload !== "object") return {};

  const data = (payload as { data?: unknown }).data;
  if (data && typeof data === "object") return data;

  return payload;
};

type Args = {
  pkgSlug: string;
  skuFromQuery: string;
  qty: number;
};

export function useEsimCheckoutFlow({ pkgSlug, skuFromQuery, qty }: Args) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const activeLocale = isEnglish ? "en" : "vi";
  const t = useSimDuLichStaticText(activeLocale);

  const [packageData, setPackageData] = useState<EsimPackageView | null>(null);
  const [selectedSku, setSelectedSku] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<2 | 3>(2);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isEnglish ? "paypal" : "vietqr");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3540);
  const [quote, setQuote] = useState<EsimQuoteData | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [checkoutData, setCheckoutData] = useState<EsimCheckoutData | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(false);

  const formatCheckoutAmount = useCallback((amount: number, currency?: string) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(amount);
    }

    return formatEsimMoney(amount, currency);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!pkgSlug) {
        if (!active) return;
        setPackageData(null);
        setSelectedSku("");
        setError(t("Thiếu thông tin gói eSIM."));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const detail = await loadEsimPackageBySlug(pkgSlug, activeLocale);

        if (!active) return;

        if (!detail) {
          setPackageData(null);
          setSelectedSku("");
          setError(t("Không tìm thấy gói eSIM bạn đã chọn."));
          return;
        }

        setPackageData(detail);
        const matchedSku = detail.variants.find((variant) => variant.sku === skuFromQuery)?.sku;
        setSelectedSku(matchedSku || detail.variants[0]?.sku || "");
      } catch (err) {
        if (!active) return;
        console.error("Failed to load eSIM checkout package", err);
        setPackageData(null);
        setSelectedSku("");
        setError(t("Không thể tải chi tiết gói eSIM. Vui lòng thử lại sau."));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [activeLocale, pkgSlug, skuFromQuery, t]);

  const selectedVariant = useMemo<EsimVariantView | null>(() => {
    if (!packageData?.variants.length) return null;
    return (
      packageData.variants.find((variant) => variant.sku === selectedSku) ||
      packageData.variants[0] ||
      null
    );
  }, [packageData, selectedSku]);

  const selectedVariantMoney = useMemo(
    () => getEsimVariantMoney(selectedVariant, activeLocale),
    [activeLocale, selectedVariant]
  );

  useEffect(() => {
    let active = true;

    const loadQuote = async () => {
      if (!selectedVariant?.id) {
        if (!active) return;
        setQuote(null);
        setQuoteError("");
        return;
      }

      setQuoteLoading(true);
      setQuoteError("");

      try {
        const response = await ProductEsimApi.quote(
          {
            variant_id: selectedVariant.id,
            quantity: qty,
            payment_method: paymentMethod,
          },
          activeLocale
        );
        if (!active) return;
        const data = unwrapResponseData(response?.payload) as EsimQuoteData;
        setQuote(data);
      } catch (err: any) {
        if (!active) return;
        console.error("Failed to load eSIM quote", err);
        setQuote(null);
        setQuoteError(t("Không thể tính giá thanh toán lúc này."));
      } finally {
        if (active) {
          setQuoteLoading(false);
        }
      }
    };

    void loadQuote();

    return () => {
      active = false;
    };
  }, [activeLocale, paymentMethod, qty, selectedVariant?.id, t]);

  const subtotal = quote?.subtotal_amount ?? (selectedVariant ? selectedVariantMoney.price * qty : 0);
  const serviceFee = quote?.service_fee_amount ?? (selectedVariant ? selectedVariantMoney.serviceFeeAmount * qty : 0);
  const total = checkoutData?.payable_amount ?? quote?.total_amount ?? subtotal + serviceFee;
  const currency = quote?.currency || checkoutData?.currency || selectedVariantMoney.currency || (isEnglish ? "USD" : "VND");
  const quoteIsAvailable = quote?.is_available !== false;

  useEffect(() => {
    setPaymentMethod(isEnglish ? "paypal" : "vietqr");
  }, [isEnglish]);

  useEffect(() => {
    if (step !== 3) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const validateEmail = useCallback((val: string) => {
    if (!val) return t("Vui lòng nhập email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return t("Email không hợp lệ");
    return "";
  }, [t]);

  const handleContinue = useCallback(() => {
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;
    if (!quoteIsAvailable) {
      toast.error(t("Gói eSIM hiện không khả dụng để thanh toán."));
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [email, quoteIsAvailable, t, validateEmail]);

  useEffect(() => {
    let interval: number | undefined;

    if (!orderCode || isPaid || !pollingStatus) {
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/check-payment-status?order_code=${orderCode}`,
          {
            headers: {
              language: typeof window !== "undefined" ? localStorage.getItem("language") || "vi" : "vi",
            },
          }
        );
        const result = await response.json();
        const paid = result?.data?.paid === true;

        if (paid) {
          setIsPaid(true);
          setPollingStatus(false);
          toast.success(t("Thanh toán eSIM thành công."));
          router.push(`/payment-result?status=success&id=${orderCode}&payment_method=${paymentMethod}`);
        }
      } catch (err) {
        console.error("Failed to poll eSIM payment status", err);
      }
    };

    void checkStatus();
    interval = window.setInterval(checkStatus, 4000);

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPaid, orderCode, pollingStatus, paymentMethod, router, t]);

  const handlePay = useCallback(async () => {
    if (!packageData || !selectedVariant?.id) return;

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setSubmitting(true);

    try {
      const response = await ProductEsimApi.checkout(
        {
          variant_id: selectedVariant.id,
          quantity: qty,
          contact_name: contactName || undefined,
          contact_phone: contactPhone || undefined,
          contact_email: email,
          delivery_method: "email",
          delivery_email: email,
          delivery_phone: contactPhone || undefined,
          payment_method: paymentMethod,
          source: "website",
        },
        activeLocale
      );

      const data = unwrapResponseData(response?.payload) as {
        order?: { order_code?: string };
        quote?: EsimQuoteData;
        checkout?: EsimCheckoutData;
      };

      const nextOrderCode = data?.order?.order_code || data?.checkout?.order_code || "";
      setOrderCode(nextOrderCode);
      setQuote(data?.quote || null);
      setCheckoutData(data?.checkout || null);
      setIsPaid(false);

      if (paymentMethod === "onepay" || paymentMethod === "paypal") {
        const paymentUrl = data?.checkout?.payment_url || data?.checkout?.approval_url;
        if (!paymentUrl) {
          toast.error(
            paymentMethod === "paypal"
              ? t("Không thể tạo link thanh toán PayPal.")
              : t("Không thể tạo link thanh toán OnePay.")
          );
          return;
        }

        setPollingStatus(false);
        window.location.href = paymentUrl;
        toast.success(
          paymentMethod === "paypal"
            ? t("Đang chuyển tới PayPal.")
            : t("Đang chuyển tới trang thanh toán OnePay.")
        );
        return;
      }

      setPollingStatus(true);
      toast.success(t("Đã tạo mã thanh toán VietQR."));
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (err: any) {
      console.error("Failed to create eSIM checkout", err);
      toast.error(err?.payload?.message || t("Không thể tạo đơn hàng eSIM."));
    } finally {
      setSubmitting(false);
    }
  }, [activeLocale, contactName, contactPhone, email, packageData, paymentMethod, qty, selectedVariant?.id, t, validateEmail]);

  const handleContactSave = useCallback((name: string, phone: string) => {
    setContactName(name);
    setContactPhone(phone);
    setShowContact(false);
  }, []);

  useEffect(() => {
    setCheckoutData(null);
    setOrderCode("");
    setIsPaid(false);
    setPollingStatus(false);
  }, [selectedVariant?.id, qty, isEnglish]);

  return {
    isEnglish,
    activeLocale,
    packageData,
    selectedSku,
    setSelectedSku,
    loading,
    error,
    step,
    setStep,
    email,
    setEmail,
    emailError,
    setEmailError,
    showContact,
    setShowContact,
    contactName,
    contactPhone,
    paymentMethod,
    setPaymentMethod,
    summaryOpen,
    setSummaryOpen,
    timeLeft,
    quote,
    quoteLoading,
    quoteError,
    submitting,
    orderCode,
    checkoutData,
    isPaid,
    setIsPaid,
    pollingStatus,
    formatCheckoutAmount,
    formatTime,
    subtotal,
    serviceFee,
    total,
    currency,
    quoteIsAvailable,
    handleContinue,
    handlePay,
    handleContactSave,
    selectedVariant,
    selectedVariantMoney,
  };
}
