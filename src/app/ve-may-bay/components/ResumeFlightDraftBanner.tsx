"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { FlightDraftMatch } from "@/utils/flightDraftSession";
import {
  clearFlightDraftSession,
  dismissFlightDraft,
  formatDraftDateLabel,
  restoreFlightSessionState,
} from "@/utils/flightDraftSession";
import type { FlightDraftStage } from "@/utils/flightDraftSession";
import { isBookingDeadlineExpired } from "@/utils/flightBookingFlow";
import { formatCurrency } from "@/lib/formatters";
import DisplayImage from "@/components/base/DisplayImage";
import { handleSessionStorage } from "@/utils/Helper";
import {
  Plane,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";

const AIRLINE_NAMES: Record<string, string> = {
  VN: "Vietnam Airlines",
  VJ: "Vietjet Air",
  QH: "Bamboo Airways",
  VU: "Vietravel Airlines",
};

interface StageThemeConfig {
  title: string;
  badgeClass: string;
  containerClass: string;
  helperText: string;
  ctaText: string;
  icon: any;
}

const STAGE_THEME: Record<FlightDraftStage, StageThemeConfig> = {
  selecting: {
    title: "Đang chọn dở",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
    containerClass: "border-blue-200 bg-gradient-to-r from-blue-50/90 via-blue-50/70 to-sky-50/30",
    helperText: "Bạn đang chọn dở chuyến bay. Tiếp tục hoàn tất đặt vé.",
    ctaText: "Tiếp tục chọn",
    icon: Plane,
  },
  price_confirmed: {
    title: "Đã xác nhận giá vé",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
    containerClass: "border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-indigo-50/70 to-blue-50/30",
    helperText: "Giá vé đã được xác nhận. Vui lòng hoàn tất thông tin hành khách để giữ chỗ.",
    ctaText: "Điền thông tin",
    icon: ShieldCheck,
  },
  held: {
    title: "Đã giữ chỗ thành công",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    containerClass: "border-amber-300 bg-gradient-to-r from-amber-50/95 via-amber-50/80 to-orange-50/40 shadow-sm",
    helperText: "Đơn hàng của quý khách đã giữ chỗ thành công. Hãy hoàn tất thanh toán trước khi hết hạn.",
    ctaText: "Thanh toán ngay",
    icon: Clock,
  },
  pending_payment: {
    title: "Chờ thanh toán",
    badgeClass: "bg-red-50 text-red-700 border-red-100",
    containerClass: "border-red-200 bg-gradient-to-r from-red-50/95 via-red-50/80 to-rose-50/40 shadow-sm",
    helperText: "Đơn hàng đang chờ thanh toán. Vui lòng thanh toán để hệ thống tiến hành xuất vé.",
    ctaText: "Thanh toán ngay",
    icon: AlertTriangle,
  },
};

function displayPlace(label: string | undefined, code: string): string {
  if (!label?.trim()) return code;
  const name = label
    .trim()
    .replace(/\s*\([A-Z]{3}\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return name ? `${name} (${code})` : code;
}

function formatPaxCount(pax?: { adult: number; child: number; infant: number }): string {
  if (!pax) return "";
  const parts: string[] = [];
  if (pax.adult > 0) parts.push(`${pax.adult} người lớn`);
  if (pax.child > 0) parts.push(`${pax.child} trẻ em`);
  if (pax.infant > 0) parts.push(`${pax.infant} em bé`);
  return parts.join(", ");
}

function BannerCountdown({
  targetTime,
  onExpired,
}: {
  targetTime: Date;
  onExpired: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const diff = targetTime.getTime() - Date.now();
      if (diff <= 0) {
        onExpired();
        return "Đã hết hạn";
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setIsUrgent(diff < 15 * 60 * 1000); // 15 mins

      const hh = String(hours).padStart(2, "0");
      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");

      return `${hh}:${mm}:${ss}`;
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpired]);

  return (
    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
      isUrgent
        ? "bg-red-100 text-red-700 animate-pulse border border-red-200"
        : "bg-orange-100 text-orange-700 border border-orange-200"
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>Còn {timeLeft}</span>
    </div>
  );
}

interface ResumeFlightDraftBannerProps {
  match: FlightDraftMatch;
  fromLabel?: string;
  toLabel?: string;
  onClose: () => void;
}

export default function ResumeFlightDraftBanner({
  match,
  fromLabel,
  toLabel,
  onClose,
}: ResumeFlightDraftBannerProps) {
  const router = useRouter();
  const { meta } = match;
  const theme = STAGE_THEME[meta.stage];
  const IconComponent = theme.icon;

  const routeLabel = `${displayPlace(fromLabel, meta.startPoint)} → ${displayPlace(toLabel, meta.endPoint)}`;
  const departLabel = formatDraftDateLabel(meta.departDate);
  const dateLabel =
    meta.tripType === "roundTrip"
      ? `${departLabel} – ${formatDraftDateLabel(meta.returnDate)}`
      : departLabel;

  const holdIso = meta.holdExpiresAt ?? meta.bookingDeadline ?? null;
  const deadline = holdIso ? new Date(holdIso) : null;
  const hasValidDeadline =
    deadline &&
    !Number.isNaN(deadline.getTime()) &&
    deadline.getTime() > Date.now();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [details, setDetails] = useState<{
    orderCode?: string;
    totalPrice?: number;
    paxCount?: { adult: number; child: number; infant: number };
    airlines?: string[];
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const bookingFlight = handleSessionStorage("get", "bookingFlight") as any;
      const flightConfirmPrice = handleSessionStorage("get", "flightConfirmPrice") as any;
      const searchContext = handleSessionStorage("get", "flightSearchContext") as any;

      let orderCode = meta.orderCode;
      let totalPrice = 0;
      let adult = 0;
      let child = 0;
      let infant = 0;
      const airlinesSet = new Set<string>();

      // 1. Read from bookingFlight (held or pending_payment)
      if (bookingFlight) {
        if (bookingFlight.orderInfo?.sku) {
          orderCode = bookingFlight.orderInfo.sku;
        } else if (bookingFlight.order_code) {
          orderCode = bookingFlight.order_code;
        }

        totalPrice =
          bookingFlight.orderInfo?.total_price ??
          bookingFlight.confirmPrice?.total_price ??
          bookingFlight.total_price ??
          0;

        // Parse passenger counts
        if (Array.isArray(bookingFlight.passengers) && bookingFlight.passengers.length > 0) {
          bookingFlight.passengers.forEach((p: any) => {
            if (p.type === "CHD") child++;
            else if (p.type === "INF") infant++;
            else adult++;
          });
        } else if (Array.isArray(bookingFlight.flights) && bookingFlight.flights.length > 0) {
          const firstFlight = bookingFlight.flights[0];
          adult = firstFlight.numberAdt ?? 0;
          child = firstFlight.numberChd ?? 0;
          infant = firstFlight.numberInf ?? 0;
        }

        // Parse airlines
        if (Array.isArray(bookingFlight.flights)) {
          bookingFlight.flights.forEach((f: any) => {
            if (f.airline) airlinesSet.add(f.airline);
            if (Array.isArray(f.segments)) {
              f.segments.forEach((seg: any) => {
                if (seg?.airline) airlinesSet.add(seg.airline);
              });
            }
          });
        }
      }

      // 2. Read from flightConfirmPrice (price_confirmed)
      if (flightConfirmPrice?.confirm) {
        const confirm = flightConfirmPrice.confirm;
        const confirmReq = flightConfirmPrice.confirmPriceRequest;

        if (!orderCode) {
          orderCode =
            confirm.order_code ??
            confirm.sku ??
            confirm.orderInfo?.sku ??
            confirmReq?.orderCode;
        }

        if (!totalPrice) {
          totalPrice =
            confirm.total_price ??
            confirm.orderInfo?.total_price ??
            confirm.price_breakdown?.total_price ??
            0;
        }

        if (adult === 0 && Array.isArray(confirmReq?.paxLists)) {
          confirmReq.paxLists.forEach((p: any) => {
            if (p.paxType === "CHILD") child++;
            else if (p.paxType === "INFANT") infant++;
            else adult++;
          });
        }

        if (airlinesSet.size === 0 && Array.isArray(confirmReq?.itineraries)) {
          confirmReq.itineraries.forEach((it: any) => {
            if (it.airline) airlinesSet.add(it.airline);
            if (Array.isArray(it.segments)) {
              it.segments.forEach((seg: any) => {
                if (seg?.airline) airlinesSet.add(seg.airline);
              });
            }
          });
        }
      }

      // 3. Fallbacks for passenger counts (from Search context)
      if (adult === 0) {
        if (searchContext?.paxCounts) {
          adult = searchContext.paxCounts.adult ?? 1;
          child = searchContext.paxCounts.child ?? 0;
          infant = searchContext.paxCounts.infant ?? 0;
        } else {
          adult = 1;
        }
      }

      // 4. Fallbacks for airlines (from current selection)
      if (airlinesSet.size === 0) {
        const dep = handleSessionStorage("get", "selectedFlightDepart") as any;
        const ret = handleSessionStorage("get", "selectedFlightReturn") as any;
        if (dep?.trip?.airline) {
          airlinesSet.add(dep.trip.airline);
        } else if (dep?.trip?.source) {
          airlinesSet.add(dep.trip.source);
        }
        if (ret?.trip?.airline) {
          airlinesSet.add(ret.trip.airline);
        } else if (ret?.trip?.source) {
          airlinesSet.add(ret.trip.source);
        }
      }

      // 5. Fallbacks for total price (from current selection)
      if (!totalPrice) {
        const dep = handleSessionStorage("get", "selectedFlightDepart") as any;
        const ret = handleSessionStorage("get", "selectedFlightReturn") as any;
        const depPrice = dep?.fareOption?.totalPrice ?? 0;
        const retPrice = ret?.fareOption?.totalPrice ?? 0;
        totalPrice = depPrice + retPrice;
      }

      setDetails({
        orderCode,
        totalPrice,
        paxCount: { adult, child, infant },
        airlines: Array.from(airlinesSet).filter((c) => typeof c === "string" && c.trim() !== ""),
      });
    } catch (e) {
      console.error("Error building draft details:", e);
    }
  }, [meta]);

  const handleContinue = async () => {
    if (meta.bookingDeadline && isBookingDeadlineExpired(meta.bookingDeadline)) {
      toast.error(
        meta.stage === "held"
          ? "Đã hết thời gian giữ chỗ."
          : "Đã hết thời gian giữ giá / thanh toán."
      );
      return;
    }

    restoreFlightSessionState(match.routeKey);

    const targetUrl = meta.orderCode
      ? `${meta.resumeUrl}?order_code=${meta.orderCode}`
      : meta.resumeUrl;

    router.push(targetUrl);
  };

  const handleDiscard = () => {
    clearFlightDraftSession();
    onClose();
  };

  const handleDismiss = () => {
    dismissFlightDraft(match.routeKey);
    onClose();
  };

  return (
    <div
      className={`mb-5 rounded-2xl border p-4 md:p-5 transition-all shadow-sm ${theme.containerClass}`}
      role="region"
      aria-label="Tiếp tục đặt vé trước đó"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left block: details */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Icon badge */}
          <div className="p-2.5 rounded-xl border border-gray-200/50 bg-white shadow-sm flex-shrink-0 mt-0.5">
            <IconComponent className="w-5 h-5 text-[#1570EF]" />
          </div>
          <div className="min-w-0 flex-1">
            {/* Badges / statuses */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${theme.badgeClass}`}>
                {theme.title}
              </span>
              {details?.orderCode && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-white border border-gray-200 rounded-md text-gray-700">
                  Mã đơn: <span className="font-bold text-gray-900">{details.orderCode}</span>
                </span>
              )}
              {hasValidDeadline && (
                <BannerCountdown
                  targetTime={deadline}
                  onExpired={handleDiscard}
                />
              )}
            </div>

            {/* Route details */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-900">
              <span className="font-bold text-base md:text-lg text-[#0C4089] truncate">
                {routeLabel}
              </span>
              {details?.airlines && details.airlines.length > 0 && (
                <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
                  {details.airlines.map((code) => (
                    <div
                      key={code}
                      className="inline-flex items-center bg-white rounded-md px-1.5 py-0.5 border border-gray-100 shadow-sm"
                      title={AIRLINE_NAMES[code] || code}
                    >
                      <DisplayImage
                        imagePath={`assets/images/airline/${code.toLowerCase()}.gif`}
                        width={40}
                        height={14}
                        alt={code}
                        classStyle="max-w-10 max-h-5 object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata (Date, Pax, Guide message) */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
              <span className="flex items-center gap-1 font-medium bg-white/40 px-2 py-0.5 rounded border border-gray-200/30">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {dateLabel}
              </span>
              {details?.paxCount && (
                <span className="flex items-center gap-1 font-medium bg-white/40 px-2 py-0.5 rounded border border-gray-200/30">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  {formatPaxCount(details.paxCount)}
                </span>
              )}
              {details?.totalPrice && details.totalPrice > 0 ? (
                <span className="font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-xs">
                  Tổng tiền: <span className="text-[#D92D20] font-extrabold text-sm">{formatCurrency(details.totalPrice)}</span>
                </span>
              ) : null}
            </div>

            <p className="mt-2.5 text-xs text-gray-500 font-normal italic">
              {theme.helperText}
            </p>
          </div>
        </div>

        {/* Right block: actions */}
        <div className="flex flex-shrink-0 items-center justify-end gap-2.5 w-full lg:w-auto border-t lg:border-t-0 pt-3.5 lg:pt-0 border-gray-200/50">
          <button
            type="button"
            onClick={handleContinue}
            disabled={paymentLoading}
            className="w-full sm:w-auto rounded-xl bg-[#1570EF] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0C4089] hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {paymentLoading ? "Đang xử lý..." : theme.ctaText}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            disabled={paymentLoading}
            className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60 text-center"
          >
            Chọn chuyến mới
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            disabled={paymentLoading}
            className="px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-all active:scale-95 disabled:opacity-60 text-center whitespace-nowrap"
          >
            Ẩn
          </button>
        </div>
      </div>
    </div>
  );
}

