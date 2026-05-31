"use client";
import { FlightApi } from "@/api/Flight";
import { differenceInSeconds, format } from "date-fns";
import LoadingButton from "@/components/base/LoadingButton";
import {
  formatCurrency,
  formatNumberToHoursAndMinutesFlight,
  formatTime,
  formatTimeZone,
} from "@/lib/formatters";
import {
  FlightBookingInforBody,
  FlightBookingInforType,
} from "@/schemaValidations/flightBookingInfor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type Path } from "react-hook-form";
import { toast } from "react-hot-toast";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/flightBooking.scss";
import { vi } from "date-fns/locale";
import { getCurrentLanguage, handleSessionStorage } from "@/utils/Helper";
import FlightDetailPopup from "./FlightDetailPopup";
import DisplayImage from "@/components/base/DisplayImage";
import { translateText } from "@/utils/translateApi";
import { flightStaticText } from "@/constants/staticText";
import { formatTranslationMap, translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/contexts/LanguageContext";
import { datePickerLocale } from "@/constants/language";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useUser } from "@/contexts/UserContext";
import { isEmpty, isNumber } from "lodash";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { HttpError } from "@/lib/error";
import type { FlightBookFlightResponse } from "@/types/flightBooking";
import {
  attachPriceHoldToBookingSession,
  mergeBookFlightIntoSession,
  resolveBookingDraftFlow,
} from "@/utils/flightBookingFlow";
import { isPriceHoldExpired } from "@/utils/flightHoldExpiry";
import {
  buildCombinedSelectionFingerprint,
  buildSearchRouteFromParams,
  findMatchingFlightDraft,
  updateFlightDraftMeta,
  type FlightDraftMatch,
  type FlightDraftStage,
} from "@/utils/flightDraftSession";
import ResumeFlightDraftModal from "@/components/flight/ResumeFlightDraftModal";
import { FLIGHT_NATIONALITIES } from "@/constants/countries";
import {
  flightBookingErrorToastText,
  formatFlightBookingError,
  isFlightDepartureError,
  type FlightBookingErrorDisplay,
} from "@/utils/formatFlightBookingError";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";
import PhoneInput from "@/components/form/PhoneInput";
import FlightConfirmPriceReview from "./FlightConfirmPriceReview";
import type { ConfirmPriceResponse, ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import {
  buildFlightConfirmPricePayloadFromSelections,
  normalizeConfirmPriceResponse,
} from "@/utils/buildFlightConfirmPricePayload";
import {
  flightsFromSelections,
  loadSelectedFlightsForBooking,
} from "@/utils/selectedFlightStorage";
import {
  resolveCheckoutFareTotal,
  sumServiceFeeFromFlights,
} from "@/utils/flightCheckoutPricing";
import {
  isConfirmPriceSoftFailure,
  resolveFareValueFromFareOption,
} from "@/utils/fareValueToken";
import { verifySelectedFlights } from "@/utils/verifySelectedFlight";
import { appendBookFlightPassportFields } from "@/utils/buildPaxDocuments";
import { readSegmentEndpoint } from "@/utils/segmentEndpoint";
import {
  build1GHoldFareData,
  sum1GHoldFareTotals,
} from "@/utils/build1GHoldFareData";
import { merge1GSelectionsForConfirm } from "@/utils/oneGConfirmPrice";
import {
  assertVuFareConsistency,
  isVuSource,
} from "@/utils/vuConfirmPrice";
import InternationalPassportFields from "./InternationalPassportFields";
import type { SelectedFlight } from "@/types/selectedFlight";

export default function FlightBookForm({ airportsData }: any) {
  const router = useRouter();
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const lang = language as "vi" | "en";
  const [bookingError, setBookingError] =
    useState<FlightBookingErrorDisplay | null>(null);
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [flights, setFlights] = useState<any[]>([]);
  const [flightsDetail, setFlightsDetail] = useState<any[]>([]);
  const [flightType, setFlightType] = useState<string>("");
  const [listBaggage, setListBaggage] = useState<any[]>([]);
  const [listBaggageGrouped, setListBaggageGrouped] = useState<any[]>([]);
  const [listBaggagePassenger, setListBaggagePassenger] = useState<any>([]);
  const [totalBaggages, setTotalBaggages] = useState<{
    price: number;
    quantity: number;
  }>({ price: 0, quantity: 0 });
  const [flightSession, setFlightSession] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [showFlightDetail, setShowFlightDetail] = useState<boolean>(false);
  const [confirmStep, setConfirmStep] = useState<"form" | "review">("form");
  const [confirmData, setConfirmData] = useState<ConfirmPriceResponse | null>(
    null
  );
  const [confirmExpired, setConfirmExpired] = useState(false);
  const [proceedingPayment, setProceedingPayment] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [isSkippedHold, setIsSkippedHold] = useState(false);
  const [pnrNumber, setPnrNumber] = useState<string | null>(null);
  const [pendingBookingPayload, setPendingBookingPayload] = useState<any>(null);
  const [selectedFlights, setSelectedFlights] = useState<SelectedFlight[]>([]);
  const [draftModal, setDraftModal] = useState<FlightDraftMatch | null>(null);
  const { userInfo } = useUser();

  const [preVerifyLoading, setPreVerifyLoading] = useState(false);
  const [preVerifyError, setPreVerifyError] = useState<FlightBookingErrorDisplay | null>(null);

  const buildMockPassengers = (paxCounts: { adult: number; child: number; infant: number }) => {
    const passengers: ConfirmPricePaxListItem[] = [];
    let idx = 0;
    for (let i = 0; i < (paxCounts.adult || 1); i++) {
      passengers.push({
        index: idx++,
        type: "ADT",
        firstName: "GUEST",
        lastName: "ADULT",
        gender: true,
        birthday: "1990-01-01",
        passport: "G12345678",
        passport_expiry_date: "2030-12-31",
        passport_country: "VN",
        nationality: "VN",
      });
    }
    for (let i = 0; i < (paxCounts.child || 0); i++) {
      passengers.push({
        index: idx++,
        type: "CHD",
        firstName: "GUEST",
        lastName: "CHILD",
        gender: true,
        birthday: "2018-06-01",
        passport: "G12345678",
        passport_expiry_date: "2030-12-31",
        passport_country: "VN",
        nationality: "VN",
      });
    }
    for (let i = 0; i < (paxCounts.infant || 0); i++) {
      passengers.push({
        index: idx++,
        type: "INF",
        firstName: "GUEST",
        lastName: "INFANT",
        gender: true,
        birthday: "2025-06-01",
        passport: "G12345678",
        passport_expiry_date: "2030-12-31",
        passport_country: "VN",
        nationality: "VN",
      });
    }
    return passengers;
  };

  const runPreVerification = async (selections: SelectedFlight[]) => {
    try {
      setPreVerifyLoading(true);
      setPreVerifyError(null);

      const contact = {
        full_name: "GUEST CONTACT",
        gender: "male",
        phone: "0900000000",
        email: "guest@happybook.com.vn",
        address: "Vietnam",
      };

      const paxCounts = selections[0]?.paxCounts ?? { adult: 1, child: 0, infant: 0 };
      const mockPassengers = buildMockPassengers(paxCounts);

      const confirmPayload = buildFlightConfirmPricePayloadFromSelections({
        selections,
        passengers: mockPassengers,
        contact,
      });

      const respon = await FlightApi.confirmPrice(confirmPayload);
      if (respon?.status !== 200) {
        const payload = respon?.payload ?? {};
        const errDisplay = formatFlightBookingError(payload, lang);
        setPreVerifyError(errDisplay);
      }
    } catch (err: any) {
      const payload = err instanceof HttpError ? err.payload : err?.payload ?? err;
      const errDisplay = formatFlightBookingError(payload, lang);
      setPreVerifyError(errDisplay);
    } finally {
      setPreVerifyLoading(false);
    }
  };


  const earliestDepartureDate = useMemo(() => {
    let earliest: Date | undefined;
    for (const flight of flights) {
      const at = (flight.departure as { at?: string } | undefined)?.at;
      if (!at) continue;
      const d = new Date(at);
      if (!Number.isNaN(d.getTime()) && (!earliest || d < earliest)) {
        earliest = d;
      }
    }
    return earliest;
  }, [flights]);
  // Handle Voucher
  const {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    searchingVouchers,
    setVoucherErrors,
    handleApplyVoucher,
    handleSearch,
  } = useVoucherManager("airline_ticket");
  // End Voucher
  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [schemaForm, setSchemaForm] = useState(() =>
    FlightBookingInforBody(
      messages,
      generateInvoice,
      flightType,
      earliestDepartureDate
    )
  );

  useEffect(() => {
    if (datePickerLocale[language]) {
      registerLocale(language, datePickerLocale[language]);
    }
  }, [language]);

  useEffect(() => {
    setSchemaForm(
      FlightBookingInforBody(
        messages,
        generateInvoice,
        flightType,
        earliestDepartureDate
      )
    );
  }, [flightType, generateInvoice, messages, earliestDepartureDate]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FlightBookingInforType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      atd: [
        {
          gender: "",
          firstName: "",
          lastName: "",
        },
      ],
      contact: {
        full_name: userInfo?.name,
        phone: userInfo?.phone?.toString(),
        email: userInfo?.email,
        gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      },
      checkBoxGenerateInvoice: false,
    },
  });

  const validateField = (name: Path<FlightBookingInforType>) => {
    void trigger(name);
  };

  const handleAutoFillMockData = async () => {
    const paxCounts = selectedFlights[0]?.paxCounts ?? { adult: 1, child: 0, infant: 0 };
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const getLetter = (index: number) => letters[index % letters.length];
    
    const atdList = Array.from({ length: paxCounts.adult || 1 }, (_, i) => ({
      firstName: "TESTADT",
      lastName: `PASSENGER ${getLetter(i)}`,
      gender: i % 2 === 0 ? "male" : "female",
      birthday: new Date(1990, 0, 1),
      passport: "G12345678",
      nationality: "VN",
      passport_expiry_date: new Date(2035, 11, 31),
    }));

    const chdList = Array.from({ length: paxCounts.child || 0 }, (_, i) => ({
      firstName: "TESTCHD",
      lastName: `CHILD ${getLetter(i)}`,
      gender: i % 2 === 0 ? "male" : "female",
      birthday: new Date(new Date().getFullYear() - 5, 0, 1),
      passport: "G12345678",
      nationality: "VN",
      passport_expiry_date: new Date(2035, 11, 31),
    }));

    const infList = Array.from({ length: paxCounts.infant || 0 }, (_, i) => ({
      firstName: "TESTINF",
      lastName: `INFANT ${getLetter(i)}`,
      gender: i % 2 === 0 ? "male" : "female",
      birthday: new Date(new Date().getFullYear() - 1, 0, 1),
      passport: "G12345678",
      nationality: "VN",
      passport_expiry_date: new Date(2035, 11, 31),
    }));

    reset({
      atd: atdList,
      chd: chdList.length > 0 ? chdList : undefined,
      inf: infList.length > 0 ? infList : undefined,
      contact: {
        full_name: "NGUYEN VAN TOAN",
        phone: "0900000000",
        email: "toan.nguyen@happybook.com.vn",
        gender: "male",
        address: "Ho Chi Minh City",
      },
      Note: "Auto filled test booking",
      checkBoxGenerateInvoice: false,
    });
    
    // Trì hoãn 1 chút để React Hook Form cập nhật giá trị rồi mới chạy validation
    setTimeout(async () => {
      await trigger();
      toast.success("Đã tự động điền và validate dữ liệu test!");
    }, 100);
  };

  const showFlightBookingError = (
    payload: unknown,
    fallback: string
  ): FlightBookingErrorDisplay => {
    const display = formatFlightBookingError(payload, lang);
    setBookingError(display);
    toast.error(flightBookingErrorToastText(payload, lang, fallback), {
      duration: 7000,
    });
    return display;
  };

  /**
   * Build the draft session object from booking payload + confirm response.
   * Shared between onSubmit (hold flow) and handleProceedToPayment (book flow).
   */
  const buildDraftSession = (
    payload: Record<string, unknown>,
    requestId: string | number,
    confirm: ConfirmPriceResponse,
    normalized: ReturnType<typeof normalizeConfirmPriceResponse>,
    selections?: SelectedFlight[]
  ) => {
    const storedConfirmRequest = handleSessionStorage("get", "flightConfirmPrice")
      ?.request as Record<string, unknown> | undefined;

    return {
      ...payload,
      flights: resolveFlightsForSession(selections),
      booking_flight_request_id: requestId,
      confirmPrice: confirm,
      confirmPriceRequest: storedConfirmRequest,
      bookingId: normalized.bookingId,
      airdata_booking_id: confirm.airdata_booking_id ?? normalized.bookingId,
      order_code: normalized.orderCode,
    };
  };

  /**
   * Persist booking session, clean up intermediate keys, and navigate to checkout.
   * Returns false if persistence fails.
   */
  const persistBookingAndNavigate = (
    bookingFlight: Record<string, unknown>,
    payload: Record<string, unknown>,
    opts: {
      stage: FlightDraftStage;
      orderCode?: string;
      bookingDeadline?: string;
      holdExpiresAt?: string;
      selectionFingerprint?: string;
    }
  ): boolean => {
    if (totalDiscount > 0 && bookingFlight.orderInfo) {
      (bookingFlight.orderInfo as { total_discount?: number }).total_discount =
        totalDiscount;
    }

    handleSessionStorage("save", "bookingFlight", bookingFlight);
    handleSessionStorage("save", "flightBookingDraft", payload);

    updateFlightDraftMeta({
      stage: opts.stage,
      resumeUrl: "/ve-may-bay/thong-tin-dat-cho",
      orderCode: opts.orderCode,
      bookingDeadline: opts.bookingDeadline,
      holdExpiresAt: opts.holdExpiresAt,
      flow: resolveBookingDraftFlow(flights, flightType),
      selectionFingerprint: opts.selectionFingerprint,
    });

    handleSessionStorage("remove", [
      "selectedFlightDepart",
      "selectedFlightReturn",
      "departFlight",
      "returnFlight",
      "flightConfirmPrice",
    ]);

    const persisted = handleSessionStorage("get", "bookingFlight");
    if (!persisted) {
      toast.error("Không thể tạo dữ liệu đơn đặt chỗ. Vui lòng thử lại.");
      return false;
    }

    setBookingError(null);
    const orderSku = persisted?.orderInfo?.sku || persisted?.order_code || opts.orderCode;
    router.push(
      orderSku
        ? `/ve-may-bay/thong-tin-dat-cho?order_code=${orderSku}`
        : "/ve-may-bay/thong-tin-dat-cho"
    );
    return true;
  };

  const buildBookingPayload = (data: FlightBookingInforType) => {
    const adtArr = data.atd.map((item, index) => {
      if (listBaggagePassenger.atd && listBaggagePassenger.atd[index]) {
        item.baggages = listBaggagePassenger.atd[index];
      }
      return { value: item, Type: "ADT" };
    });
    const chdArr = data.chd
      ? data.chd.map((item, index) => {
        if (listBaggagePassenger.chd && listBaggagePassenger.chd[index]) {
          item.baggages = listBaggagePassenger.chd[index];
        }
        return { value: item, Type: "CHD" };
      })
      : [];
    const infArr = data.inf
      ? data.inf.map((item) => ({ value: item, Type: "INF" }))
      : [];

    const passengers = [...adtArr, ...chdArr, ...infArr].reduce(
      (acc: any, item: any, index) => {
        const passengerObj: any = {
          index: index,
          first_name: item.value.firstName,
          last_name: item.value.lastName,
          gender: item.value.gender === "male" ? true : false,
          type: item.Type,

          birthday: item.value.birthday
            ? format(new Date(item.value.birthday), "yyyy-MM-dd")
            : "",
        };
        appendBookFlightPassportFields(passengerObj, item.value, {
          isInternational: flightType === "international",
          paxType: item.Type as "ADT" | "CHD" | "INF",
        });
        if (item.value.baggages && item.value.baggages.length > 0) {
          passengerObj.baggages = item.value.baggages;
        }
        acc.push(passengerObj);
        return acc;
      },
      []
    );
    const is1G =
      flights.length > 0 &&
      String(flights[0]?.source ?? "").toUpperCase() === "1G";
    data.book_type = is1G ? "1G" : "book-normal";
    const { atd, chd, inf, checkBoxGenerateInvoice, ...formatData } = data;
    let fare_data: any = [];
    let total_price_net = 0;
    let total_tax = 0;
    let total_fee_service = 0;
    let total_price = 0;

    const ticketClassOf = (item: Record<string, unknown>) =>
      (item.selectedTicketClass as Record<string, unknown>) ?? item;
    const buildVuHoldDetail = (item: Record<string, unknown>) => {
      const selectedFare = assertVuFareConsistency(item, "hold");
      const normalizedSegments = Array.isArray(item.segments)
        ? (item.segments as Record<string, unknown>[]).map((seg) => ({
            ...seg,
            fareBasisCode: selectedFare.fareBasisCode,
            bookingClass: selectedFare.bookingClass,
            groupClass: selectedFare.groupClass,
            fareType: selectedFare.fareType ?? selectedFare.groupClass,
            segmentId: String(seg.segmentId ?? "").trim(),
            segmentValue: String(seg.segmentValue ?? "").trim(),
          }))
        : [];
      return {
        ...item,
        segments: normalizedSegments,
        selectedTicketClass: selectedFare,
      };
    };
    const toFareFlightRow = (item: Record<string, unknown>) => {
      const tc = isVuSource(item.source)
        ? assertVuFareConsistency(item, "hold")
        : ticketClassOf(item);
      const detail = isVuSource(item.source)
        ? buildVuHoldDetail(item)
        : {
            ...item,
            selectedTicketClass: tc,
          };
      return {
        flight_value: resolveFareValueFromFareOption(item.source, tc, item),
        detail,
      };
    };

    if (is1G) {
      const primary = flights[0] as Record<string, unknown>;
      const selections = resolveSelectionsForBooking();
      const merged1G = merge1GSelectionsForConfirm(selections);
      const departPkg = handleSessionStorage("get", "departFlight") as
        | Record<string, unknown>
        | null;
      const packageTrip = {
        ...(departPkg ?? {}),
        ...((merged1G?.trip ??
          selections[0]?.trip ??
          primary) as Record<string, unknown>),
        journeys:
          (merged1G?.trip as Record<string, unknown> | undefined)?.journeys ??
          (selections[0]?.trip as Record<string, unknown> | undefined)?.journeys ??
          departPkg?.journeys,
        _selectedJourneyFlights:
          (merged1G?.trip as Record<string, unknown> | undefined)
            ?._selectedJourneyFlights ??
          (selections[0]?.trip as Record<string, unknown> | undefined)
            ?._selectedJourneyFlights ??
          departPkg?._selectedJourneyFlights,
      } as Record<string, unknown>;
      const paxCounts = merged1G?.paxCounts ?? selections[0]?.paxCounts;

      fare_data = build1GHoldFareData({
        packageTrip,
        session: flightSession ?? "",
        fareDataIdApi: String(packageTrip.hpb_id ?? packageTrip.flightId ?? ""),
        fareOptionIndex: merged1G?.fareOptionIndex ?? selections[0]?.fareOptionIndex ?? 0,
        paxCounts: paxCounts
          ? {
              adult: paxCounts.adult,
              child: paxCounts.child,
              infant: paxCounts.infant,
            }
          : undefined,
        fallbackFlights: flights as Record<string, unknown>[],
      });

      const legTotals = sum1GHoldFareTotals(fare_data);
      total_price = legTotals.total_price;
      total_tax = legTotals.total_tax;
      total_price_net = legTotals.total_price_net;
      total_fee_service = legTotals.total_fee_service;
    } else {
      flights.map((item) => {
        const tc = isVuSource(item.source)
          ? assertVuFareConsistency(item, "hold")
          : ticketClassOf(item);
        total_price_net += Number(
          tc.totalPriceWithOutTax ??
            (Number(tc.fareAdult ?? 0) +
              Number(tc.fareChild ?? 0) +
              Number(tc.fareInfant ?? 0))
        );
        total_tax +=
          Number(tc.totalTaxAdt ?? tc.taxAdult ?? 0) +
          Number(tc.totalTaxChd ?? tc.taxChild ?? 0) +
          Number(tc.totalTaxInf ?? tc.taxInfant ?? 0);
        total_price += Number(tc.totalPrice ?? 0);
        total_fee_service += Number(tc.totalServiceFee ?? 0);
        fare_data.push({
          session: flightSession,
          fare_data_id_api:
            item.flightId ?? item.hpb_id ?? item.flightCode ?? "",
          source: item.source,
          flights: [toFareFlightRow(item as Record<string, unknown>)],
        });
      });
    }

    data.trip = fare_data.length > 1 ? "round_trip" : "one_way";

    formatData.contact.gender =
      formatData.contact.gender === "male" ? true : false;
    if (!generateInvoice) {
      delete formatData.invoice;
    }
    return {
      ...formatData,
      ticket_object_list: dropdown,
      totalBaggages,
      passengers,
      fare_data,
      is_invoice: generateInvoice,
      flightType: flightType,
      ...(is1G ? { source: "1G" } : {}),
      total_price_net: total_price_net,
      total_tax: total_tax,
      total_fee_service: total_fee_service,
      total_price: total_price,
      customer_id: userInfo?.id,
      voucher_program_ids: voucherProgramIds,
    };
  };

  const resolveSelectionsForBooking = (): SelectedFlight[] => {
    if (selectedFlights.length > 0) return selectedFlights;
    return loadSelectedFlightsForBooking();
  };

  const resolveFlightsForSession = (selections?: SelectedFlight[]) =>
    flightsFromSelections(selections ?? resolveSelectionsForBooking());

  const redirectToCheckout = (confirm: ConfirmPriceResponse) => {
    const heldSession = handleSessionStorage("get", "bookingFlight") as
      | Record<string, unknown>
      | undefined;
    if (!heldSession) {
      toast.error("Không tìm thấy dữ liệu đặt chỗ. Vui lòng xác nhận giá lại.");
      return false;
    }
    if (heldSession.confirmPrice) {
      handleSessionStorage(
        "save",
        "bookingFlight",
        attachPriceHoldToBookingSession(
          heldSession,
          heldSession.confirmPrice as ConfirmPriceResponse,
          new Date().toISOString()
        )
      );
    } else if (confirm) {
      handleSessionStorage(
        "save",
        "bookingFlight",
        attachPriceHoldToBookingSession(heldSession, confirm)
      );
    }
    handleSessionStorage("remove", [
      "selectedFlightDepart",
      "selectedFlightReturn",
      "departFlight",
      "returnFlight",
      "flightConfirmPrice",
    ]);
    const persistedBooking = handleSessionStorage("get", "bookingFlight");
    if (!persistedBooking) {
      toast.error("Không thể tạo dữ liệu đơn đặt chỗ. Vui lòng thử lại.");
      return false;
    }
    setBookingError(null);
    const orderSku = persistedBooking?.orderInfo?.sku || persistedBooking?.order_code;
    router.push(orderSku ? `/ve-may-bay/thong-tin-dat-cho?order_code=${orderSku}` : "/ve-may-bay/thong-tin-dat-cho");
    return true;
  };

  const onSubmit = async (data: FlightBookingInforType) => {
    if (confirmStep === "review") return;

    const selections = resolveSelectionsForBooking();

    const verifyErrors = verifySelectedFlights(selections);
    if (verifyErrors.length) {
      toast.error(verifyErrors[0]);
      return;
    }

    const savedConfirm = handleSessionStorage("get", "flightConfirmPrice");
    const preVerifyConfirmResult = savedConfirm?.confirm;
    const preVerifyRequestId = preVerifyConfirmResult?.booking_flight_request_id;

    if (!preVerifyRequestId || !preVerifyConfirmResult) {
      toast.error("Không tìm thấy dữ liệu xác thực giá. Vui lòng quay lại chọn chuyến.");
      return;
    }

    const finalData = buildBookingPayload(data);
    if (!finalData) return;

    try {
      setLoading(true);

      const confirmResult = preVerifyConfirmResult as ConfirmPriceResponse;
      const normalizedConfirm = normalizeConfirmPriceResponse(confirmResult);

      setBookingError(null);
      setConfirmData(confirmResult);
      setConfirmExpired(false);
      setPendingBookingPayload(finalData);

      // Gọi hold-flight để giữ PNR ngay lập tức bằng ID đã xác thực trước đó
      const is1GHold =
        flights.length > 0 &&
        String(flights[0]?.source ?? "").toUpperCase() === "1G";
      const holdPayload: Record<string, unknown> = {
        ...finalData,
        booking_flight_request_id: preVerifyRequestId,
        ...(is1GHold
          ? {
              book_type: "1G",
              source: "1G",
              flightType: "international",
              trip:
                Array.isArray(finalData.fare_data) &&
                finalData.fare_data.length > 1
                  ? "round_trip"
                  : finalData.trip,
            }
          : {}),
      };

      if (normalizedConfirm.totalPrice != null) {
        holdPayload.total_price = normalizedConfirm.totalPrice;
      }
      if (normalizedConfirm.totalTax != null) {
        holdPayload.total_tax = normalizedConfirm.totalTax;
      }
      if (normalizedConfirm.breakdown.total_price_net != null) {
        holdPayload.total_price_net = normalizedConfirm.breakdown.total_price_net;
      }
      if (normalizedConfirm.breakdown.total_fee_service != null) {
        holdPayload.total_fee_service =
          normalizedConfirm.breakdown.total_fee_service;
      }

      const holdRes = await FlightApi.holdFlight(holdPayload);
      if (holdRes?.status === 200) {
        const holdData = (holdRes?.payload?.data ??
          holdRes?.payload) as FlightBookFlightResponse;
        const holdRecord = holdData as Record<string, unknown>;
        const holdOrderInfo = holdData.orderInfo as Record<string, unknown> | undefined;
        const isActuallyHeld = holdRecord.held === true;
        const didSkipHold = holdRecord.skipped_hold === true;

        setIsHeld(isActuallyHeld);
        setIsSkippedHold(didSkipHold);
        setPnrNumber(
          isActuallyHeld
            ? ((holdOrderInfo?.pnr_number as string) ?? null)
            : null
        );

        const draftSession = buildDraftSession(
          finalData,
          preVerifyRequestId,
          confirmResult,
          normalizedConfirm,
          selections
        );

        const bookingFlight: Record<string, unknown> = {
          ...mergeBookFlightIntoSession(
            draftSession,
            holdData,
            confirmResult
          ),
          held: isActuallyHeld,
          skipped_hold: didSkipHold,
        };

        handleSessionStorage("save", "bookingFlight", bookingFlight);
        handleSessionStorage("save", "flightBookingDraft", finalData);

        const confirmSelections = resolveSelectionsForBooking();
        const selectionFingerprint = buildCombinedSelectionFingerprint({
          depart: confirmSelections[0]
            ? {
                flight: {
                  ...confirmSelections[0].trip,
                  flightCode: (confirmSelections[0].trip as { flightCode?: string })
                    .flightCode,
                  fareOptions: [confirmSelections[0].fareOption],
                  selectedTicketClass: confirmSelections[0].fareOption,
                } as Record<string, unknown>,
                fareOptionIndex: confirmSelections[0].fareOptionIndex ?? 0,
              }
            : null,
          return: confirmSelections[1]
            ? {
                flight: {
                  ...confirmSelections[1].trip,
                  flightCode: (confirmSelections[1].trip as { flightCode?: string })
                    .flightCode,
                  fareOptions: [confirmSelections[1].fareOption],
                  selectedTicketClass: confirmSelections[1].fareOption,
                } as Record<string, unknown>,
                fareOptionIndex: confirmSelections[1].fareOptionIndex ?? 0,
              }
            : null,
        });

        updateFlightDraftMeta({
          stage: isActuallyHeld ? "held" : "price_confirmed",
          resumeUrl: "/ve-may-bay/thong-tin-dat-cho",
          orderCode:
            (holdOrderInfo?.sku as string) ?? normalizedConfirm.orderCode ?? undefined,
          bookingDeadline:
            (holdOrderInfo?.booking_deadline as string) ??
            normalizedConfirm.bookingDeadline,
          holdExpiresAt: normalizedConfirm.holdExpiresAt ?? undefined,
          flow: resolveBookingDraftFlow(flights, flightType),
          selectionFingerprint,
        });
        setConfirmStep("review");
        if (isActuallyHeld) {
          toast.success("Đã giữ chỗ thành công. Vui lòng thanh toán để xác nhận vé.");
        } else if (didSkipHold) {
          toast.success("Đã xác nhận giá. Vui lòng thanh toán để xác nhận vé.");
        } else {
          toast.success("Đã sẵn sàng thanh toán. Vui lòng tiếp tục để xác nhận vé.");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Hold failed (non-200 but not thrown) — parse API error
      const errDisplay = showFlightBookingError(
        holdRes?.payload,
        "Không thể giữ chỗ. Vui lòng thử lại hoặc tiếp tục đặt vé."
      );
      if (isFlightDepartureError(errDisplay.code)) {
        setConfirmStep("form");
        setConfirmData(null);
        handleSessionStorage("remove", "flightConfirmPrice");
      }
    } catch (error: any) {
      if (
        error instanceof HttpError &&
        error.payload?.errors?.voucher_programs
      ) {
        setVoucherErrors(error.payload.errors.voucher_programs);
        toast.error(toaStrMsg.inValidVouchers);
      } else {
        const payload =
          error instanceof HttpError ? error.payload : error?.payload ?? error;
        const errDisplay = showFlightBookingError(payload, toaStrMsg.error);
        if (isFlightDepartureError(errDisplay.code)) {
          setConfirmStep("form");
          setConfirmData(null);
          handleSessionStorage("remove", "flightConfirmPrice");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!confirmData || !pendingBookingPayload || confirmExpired) return;

    const normalized = normalizeConfirmPriceResponse(confirmData);
    const holdDeadline = normalized.holdExpiresAt;

    if (isPriceHoldExpired(holdDeadline)) {
      setConfirmExpired(true);
      toast.error(
        isHeld
          ? "Đã hết thời gian giữ chỗ. Vui lòng chọn lại chuyến bay."
          : "Đã hết thời gian giữ giá. Vui lòng chọn lại chuyến bay."
      );
      return;
    }

    // Chỉ gọi book-flight khi BE skip hold (vd. VJ gần giờ bay). Còn lại → checkout trực tiếp.
    if (!isSkippedHold) {
      redirectToCheckout(confirmData);
      return;
    }

    const requestId =
      normalized.bookingFlightRequestId ?? confirmData.booking_flight_request_id;

    if (!requestId) {
      toast.error("Thiếu mã đơn giữ giá. Vui lòng xác nhận giá lại.");
      return;
    }

    const bookPayload = {
      ...pendingBookingPayload,
      booking_flight_request_id: requestId,
    };

    try {
      setProceedingPayment(true);
      const respon = await FlightApi.bookFlightDomestic(bookPayload);

      if (respon?.status !== 200) {
        showFlightBookingError(respon?.payload, toaStrMsg.sendFailed);
        return;
      }

      const bookData = (respon?.payload?.data ??
        respon?.payload) as FlightBookFlightResponse;

      const draftSession = buildDraftSession(
        pendingBookingPayload,
        requestId,
        confirmData,
        normalized
      );

      const merged = mergeBookFlightIntoSession(
        draftSession,
        bookData,
        confirmData
      );
      const bookingFlight = attachPriceHoldToBookingSession(
        merged,
        confirmData
      );

      const orderSku =
        (bookingFlight.orderInfo as { sku?: string })?.sku ??
        normalized.orderCode;

      persistBookingAndNavigate(
        bookingFlight as Record<string, unknown>,
        pendingBookingPayload,
        {
          stage: "pending_payment",
          orderCode: orderSku,
          bookingDeadline:
            (bookingFlight.orderInfo as { booking_deadline?: string })
              ?.booking_deadline ?? normalized.bookingDeadline ?? undefined,
          holdExpiresAt: normalized.holdExpiresAt ?? undefined,
        }
      );
    } catch (error: unknown) {
      const httpErr = error instanceof HttpError ? error : null;
      const message =
        (httpErr?.payload as { message?: string })?.message ||
        (error as Error)?.message ||
        toaStrMsg.error;

      if (
        message.includes("expired") ||
        message.includes("Booking hold has expired")
      ) {
        setConfirmExpired(true);
        toast.error(
          "Đã hết thời gian giữ giá. Vui lòng quay lại và xác nhận giá lại."
        );
      } else if (message.includes("not ready for passenger")) {
        toast.error(
          "Đơn chưa sẵn sàng. Vui lòng xác nhận giá lại trước khi tiếp tục."
        );
      } else {
        showFlightBookingError(httpErr?.payload ?? error, toaStrMsg.error);
      }
    } finally {
      setProceedingPayment(false);
    }
  };

  const handleBackFromConfirm = () => {
    setConfirmStep("form");
    setConfirmData(null);
    setConfirmExpired(false);
    setIsHeld(false);
    setIsSkippedHold(false);
    setPnrNumber(null);
    setBookingError(null);
    handleSessionStorage("remove", "flightConfirmPrice");
  };

  const handleConfirmExpired = () => {
    setConfirmExpired(true);
    toast.error("Phiên đặt vé đã hết hạn");
    router.push("/ve-may-bay/tim-kiem-ve");
  };

  const handleSearchRedirect = () => {
    if (!selectedFlights || selectedFlights.length === 0) {
      router.push("/ve-may-bay/tim-kiem-ve");
      return;
    }
    const selections = selectedFlights;
    const departFlight = selections[0]?.trip;
    if (!departFlight) {
      router.push("/ve-may-bay/tim-kiem-ve");
      return;
    }
    const depart = departFlight.departure as { IATACode?: string; at?: string } | undefined;
    const arrival = departFlight.arrival as { IATACode?: string } | undefined;
    if (!depart?.IATACode || !arrival?.IATACode || !depart.at) {
      router.push("/ve-may-bay/tim-kiem-ve");
      return;
    }
    const startPoint = depart.IATACode;
    const endPoint = arrival.IATACode;
    const tripType = selections.length > 1 ? "roundTrip" : "oneWay";
    const departDate = format(new Date(depart.at), "ddMMyyyy");
    
    let returnDate = departDate;
    const returnDepart = selections[1]?.trip?.departure as { at?: string } | undefined;
    if (tripType === "roundTrip" && returnDepart?.at) {
      returnDate = format(new Date(returnDepart.at), "ddMMyyyy");
    }

    const startAirport = airportsData?.find((a: any) => a.code === startPoint);
    const endAirport = airportsData?.find((a: any) => a.code === endPoint);
    const fromLabel = startAirport ? `${startAirport.city} (${startAirport.code})` : startPoint;
    const toLabel = endAirport ? `${endAirport.city} (${endAirport.code})` : endPoint;

    const params = new URLSearchParams({
      tripType,
      StartPoint: startPoint,
      EndPoint: endPoint,
      DepartDate: departDate,
      ReturnDate: returnDate,
      Adt: String(selections[0].paxCounts?.adult ?? 1),
      Chd: String(selections[0].paxCounts?.child ?? 0),
      Inf: String(selections[0].paxCounts?.infant ?? 0),
      from: fromLabel,
      to: toLabel,
    });

    router.push(`/ve-may-bay/tim-kiem-ve?${params.toString()}`);
  };

  useEffect(() => {
    const selections = loadSelectedFlightsForBooking();
    if (!selections.length) {
      router.push("/ve-may-bay");
      return;
    }

    const flightData = flightsFromSelections(selections);
    const flightSession = handleSessionStorage("get", "flightSession");

    if (selections.length > 1 || flightData.length > 1) setIsRoundTrip(true);
    setSelectedFlights(selections);
    setFlights(flightData);
    const is1G = String(selections[0].trip?.source ?? "").toUpperCase() === "1G";
    setFlightType(
      is1G || !selections[0].trip.domestic ? "international" : "domestic"
    );
    setFlightsDetail(flightData);
    setFlightSession(flightSession ?? selections[0].searchId);
    const savedConfirm = handleSessionStorage("get", "flightConfirmPrice");
    if (savedConfirm?.confirm) {
      setConfirmData(savedConfirm.confirm);
      if (savedConfirm?.bookingDraft) {
        setPendingBookingPayload(savedConfirm.bookingDraft);
        setConfirmStep("review");
      } else {
        setConfirmStep("form");
      }
      setPreVerifyLoading(false);
    } else {
      runPreVerification(selections);
    }
    const bookingFlight = handleSessionStorage("get", "bookingFlight") as
      | Record<string, unknown>
      | undefined;
    if (bookingFlight) {
      if (bookingFlight.held === true) {
        setIsHeld(true);
      }
      if (bookingFlight.skipped_hold === true) {
        setIsSkippedHold(true);
      }
      const orderInfo = bookingFlight.orderInfo as
        | { pnr_number?: string }
        | undefined;
      if (orderInfo?.pnr_number) {
        setPnrNumber(orderInfo.pnr_number);
      }
    }
    setDocumentReady(true);

    if (selections[0] && !selections[0].trip.domestic) {
      const depart = selections[0].trip.departure as {
        IATACode?: string;
        at?: string;
      };
      const arrival = selections[0].trip.arrival as { IATACode?: string };
      if (depart?.IATACode && arrival?.IATACode && depart.at) {
        const d = new Date(depart.at);
        const departDate = format(d, "ddMMyyyy");
        const searchRoute = buildSearchRouteFromParams({
          startPoint: depart.IATACode,
          endPoint: arrival.IATACode,
          tripType: selections.length > 1 ? "roundTrip" : "oneWay",
          departDate,
          returnDate:
            selections.length > 1
              ? format(
                  new Date(
                    (selections[1].trip.departure as { at?: string }).at ??
                      depart.at
                  ),
                  "ddMMyyyy"
                )
              : departDate,
        });
        const match = findMatchingFlightDraft(searchRoute);
        if (match?.meta.flow === "international") {
          setDraftModal(match);
        }
      }
    }
  }, [router]);

  const {
    totalPrice,
    totalAdt,
    totalChd,
    totalInf,
    dropdown,
    totalPriceAdt,
    totalPriceChd,
    totalPriceInf,
  } = useMemo(() => {
    let _totalPrice = 0;
    let _totalAdt = 1;
    let _totalChd = 0;
    let _totalInf = 0;
    let _totalPriceAdt = 0;
    let _totalPriceChd = 0;
    let _totalPriceInf = 0;
    let _totalPriceTicketAdt = 0;
    let _totalPriceTicketChd = 0;
    let _totalPriceTicketInf = 0;
    let _totalTaxAdt = 0;
    let _totalTaxChd = 0;
    let _totalTaxInf = 0;
    const _dropdown: any = [];

    flights.forEach((item) => {
      const ticketClass =
        (item.selectedTicketClass as Record<string, unknown>) ?? item;
      _totalAdt = item.numberAdt;
      _totalChd = item.numberChd;
      _totalInf = item.numberInf;
      _totalPriceTicketAdt += Number(ticketClass.fareAdultFinal ?? item.fareAdultFinal ?? 0);
      _totalPriceTicketChd += Number(ticketClass.fareChildFinal ?? item.fareChildFinal ?? 0);
      _totalPriceTicketInf += Number(ticketClass.fareInfantFinal ?? item.fareInfantFinal ?? 0);
      _totalTaxAdt += Number(ticketClass.taxAdult ?? item.taxAdult ?? 0);
      _totalTaxChd += Number(ticketClass.taxChild ?? item.taxChild ?? 0);
      _totalTaxInf += Number(ticketClass.taxInfant ?? item.taxInfant ?? 0);
      _totalPriceAdt += Number(ticketClass.totalAdult ?? item.totalAdult ?? 0);
      _totalPriceChd += Number(ticketClass.totalChild ?? item.totalChild ?? 0);
      _totalPriceInf += Number(ticketClass.totalInfant ?? item.totalInfant ?? 0);
      _totalPrice += Number(ticketClass.totalPrice ?? item.totalPrice ?? 0);
    });

    if (_totalAdt) {
      _dropdown.push({
        totalPrice: _totalPriceAdt,
        quantity: _totalAdt,
        totalPriceTicket: _totalPriceTicketAdt,
        totalTax: _totalTaxAdt,
        type: "Adt",
        title: "Vé người lớn",
      });
    }
    if (_totalChd) {
      _dropdown.push({
        totalPrice: _totalPriceChd,
        quantity: _totalChd,
        totalPriceTicket: _totalPriceTicketChd,
        totalTax: _totalTaxChd,
        type: "Chd",
        title: "Vé trẻ em",
      });
    }
    if (_totalInf) {
      _dropdown.push({
        totalPrice: _totalPriceInf,
        quantity: _totalInf,
        totalPriceTicket: _totalPriceTicketInf,
        totalTax: _totalTaxInf,
        type: "Inf",
        title: "Vé em bé",
      });
    }

    return {
      totalPrice: _totalPrice,
      totalAdt: _totalAdt,
      totalChd: _totalChd,
      totalInf: _totalInf,
      dropdown: _dropdown,
      totalPriceAdt: _totalPriceAdt,
      totalPriceChd: _totalPriceChd,
      totalPriceInf: _totalPriceInf,
    };
  }, [flights]);

  let keyLoopPassenger = 1;
  let keyLoopDropdown = 1;

  const serviceFeeTotal = sumServiceFeeFromFlights(flights);
  const checkoutFareTotal = confirmData
    ? resolveCheckoutFareTotal({
        confirmPrice: confirmData,
        summedFromFlights: totalPrice,
        serviceFeeFromSearch: serviceFeeTotal,
      })
    : totalPrice;
  const sidebarGrandTotal =
    checkoutFareTotal + totalBaggages.price - totalDiscount;

  const calculateTotalBaggagePrice = (data: Record<string, any>) => {
    return Object.values(data)
      .flat(2)
      .reduce(
        (acc: { price: number; quantity: number }, item) => {
          const price = Number(item.price);
          acc.price += isNaN(price) ? 0 : price;
          acc.quantity++;
          return acc;
        },
        { price: 0, quantity: 0 }
      );
  };

  const handleChooseBaggage = (
    leg: number,
    code: string,
    typePassenger: string,
    passengerIndex: number
  ) => {
    if (listBaggage.length) {
      if (!listBaggagePassenger[typePassenger]) {
        listBaggagePassenger[typePassenger] = [];
      }
      if (!listBaggagePassenger[typePassenger][passengerIndex]) {
        listBaggagePassenger[typePassenger][passengerIndex] = [];
      }
      if (code) {
        listBaggage.find((item) => {
          if (item.code_uni === code && item.leg === leg) {
            let finalPriceTmp = finalPrice + item.price;
            const baggageObj = {
              airline: item.airline,
              leg: item.leg,
              route: item.route,
              currency: "VND",
              code: item.code,
              name: item.detail.weight + item.detail.unit,
              price: item.price,
              value: item.ssrValue || "unknown",
            };
            const index = listBaggagePassenger[typePassenger][
              passengerIndex
            ].findIndex((item: any) => {
              if (item.leg === leg) {
                finalPriceTmp -= item.price;
                return item;
              }
            });

            if (index >= 0) {
              listBaggagePassenger[typePassenger][passengerIndex][index] =
                baggageObj;
            } else {
              listBaggagePassenger[typePassenger][passengerIndex].push(
                baggageObj
              );
            }
            setFinalPrice(finalPriceTmp);
            setTotalBaggages(calculateTotalBaggagePrice(listBaggagePassenger));
          }
        });
      } else {
        listBaggagePassenger[typePassenger][passengerIndex].map(
          (item: any, index: number) => {
            if (item.leg === leg) {
              setFinalPrice(finalPrice - item.price);
              listBaggagePassenger[typePassenger][passengerIndex].splice(
                index,
                1
              );
            }
          }
        );
        setTotalBaggages(calculateTotalBaggagePrice(listBaggagePassenger));
      }
    }
  };
  useEffect(() => {
    setFinalPrice(totalPrice);
  }, [totalPrice]);
  // Fetch and Handle Data
  useEffect(() => {
    const fetchData = async () => {
      const defaultGroupedObj =
        flights.length > 1 ? { 0: [], 1: [] } : { 0: [] };
      try {
        let params: any = [];
        flights.map((flight) => {
          let baggeParams: any = {
            source: flight.source,
            paxList: [
              {
                type: "ADULT",
                count: 1,
              },
              {
                type: "CHILD",
                count: 1,
              },
            ],
            itineraries: [],
            flightLeg: flight.flightLeg,
          };
          (flight.segments ?? []).map((segment: any) => {
            const segDep = readSegmentEndpoint(segment, "departure");
            const segArr = readSegmentEndpoint(segment, "arrival");
            if (!segDep?.IATACode || !segArr?.IATACode) return;
            baggeParams.itineraries.push({
              airline: segment.airline,
              source: flight.source,
              departure: segDep.IATACode,
              arrival: segArr.IATACode,
              departureDate: segDep.at,
              arrivalDate: segArr.at,
              flightNumber: segment.flightNumber,
              flightNOP: segment.flightNOP
                ? segment.flightNOP
                : segment.flightNumber,
              fareBasisCode: segment.fareBasisCode,
              bookingClass: segment.bookingClass,
              groupClass: segment.groupClass,
              segmentId: segment.segmentId,
              fareValue: resolveFareValueFromFareOption(
                flight.source,
                flight.selectedTicketClass,
                flight
              ),
              itineraryId: flight.itineraryId
                ? flight.itineraryId.toString()
                : "1",
            });
            params.push(baggeParams);
          });
        });
        const promises = params.map((param: any) =>
          FlightApi.getBaggage(param)
        );
        const results = await Promise.all(promises);
        const bagsData: any[] = [];

        results.forEach((res) => {
          const bags = res?.payload?.data ?? [];
          if (bags.length) {
            bagsData.push(...bags);
          }
        });
        const groupedByLeg = bagsData.reduce((acc: any, item: any) => {
          acc[item.leg].push(item);
          return acc;
        }, defaultGroupedObj as { [key: number]: typeof bagsData });
        setListBaggage(bagsData);
        setListBaggageGrouped(groupedByLeg);
        translatePage("#wrapper-flight-booking-form", 100);
      } catch (error: any) {
        setListBaggage([]);
        setListBaggageGrouped([defaultGroupedObj]);
      } finally {
        setLoading(false);
      }
    };
    if (flights.length > 0) {
      fetchData();
    }
  }, [flights]);

  const handleClosePopupFlightDetail = () => {
    setShowFlightDetail(false);
  };
  useEffect(() => {
    translateText(flightStaticText, language).then((data) => {
      const translationMap = formatTranslationMap(flightStaticText, data);
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  if (!documentReady) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Loading...</span>
      </div>
    );
  }

  if (preVerifyLoading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center py-12 bg-white rounded-2xl shadow-sm mt-6">
        <span className="loader_spiner !w-12 !h-12 !border-4 !border-blue-500 !border-t-blue-200 animate-spin"></span>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Đang kiểm tra tình trạng chỗ và giá vé từ hãng bay...
        </p>
      </div>
    );
  }

  if (preVerifyError) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center py-12 px-6 bg-white rounded-2xl shadow-sm mt-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Vé hoặc Hạng ghế không khả dụng
        </h3>
        <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
          {preVerifyError.message || "Hạng vé hoặc chuyến bay bạn chọn hiện không còn khả dụng trên hệ thống hãng bay."}
        </p>
        <button
          onClick={handleSearchRedirect}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          {language === "vi" ? "Quay lại tìm kiếm chuyến bay" : "Search flights again"}
        </button>
      </div>
    );
  }

  return (
    <form
      id="wrapper-flight-booking-form"
      className="mt-0 md:mt-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
        <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
          <div
            className="rounded-2xl"
            style={{
              background:
                "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
            }}
          >
            <h3
              className="text-22 py-4 px-8 font-semibold text-white"
              data-translate="true"
            >
              Thông tin đặt hàng
            </h3>
          </div>
          {confirmStep === "form" && (
            <>
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-yellow-800 font-semibold text-sm">Chế độ DEV: Giả lập dữ liệu test</p>
                    <p className="text-xs text-yellow-600">Tự động điền đầy đủ thông tin hành khách và liên hệ hợp lệ.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillMockData}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Tự động điền Form
                  </button>
                </div>
              )}
              <div className="mt-6">
            <p className="font-bold text-18" data-translate="true">
              Thông tin liên hệ
            </p>
            <div className="bg-white rounded-xl py-4 px-6 mt-3">
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="FirstName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Họ và tên</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="FirstName"
                      type="text"
                      {...register("contact.full_name")}
                      placeholder="Nhập Họ và tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.full_name && (
                      <p className="text-red-600">
                        {errors.contact?.full_name.message}
                      </p>
                    )}
                  </div>
                  {/* <div className="relative">
                    <label
                      htmlFor="LastName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Tên đệm & Tên</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="LastName"
                      type="text"
                      {...register("contact.last_name")}
                      placeholder="Nhập tên đệm & tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.last_name && (
                      <p className="text-red-600">
                        {errors.contact?.last_name.message}
                      </p>
                    )}
                  </div> */}
                  <div className="relative">
                    <label
                      htmlFor="gender_person_contact"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Giới tính</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                      <select
                        id="gender_person_contact"
                        className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                        {...register("contact.gender")}
                      >
                        <option value="" data-translate="true">
                          Vui lòng chọn giới tính
                        </option>
                        <option value="male" data-translate="true">
                          Quý ông
                        </option>
                        <option value="female" data-translate="true">
                          Quý bà
                        </option>
                      </select>
                    </div>
                    {errors.contact?.gender && (
                      <p className="text-red-600">
                        {errors.contact?.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Controller
                      name="contact.phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Nhập số điện thoại"
                          error={errors.contact?.phone?.message}
                          defaultCountry="VN"
                          label="Số điện thoại"
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email_person_contact"
                      type="text"
                      placeholder="Nhập email"
                      {...register("contact.email")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />
                    {errors.contact?.email && (
                      <p className="text-red-600">
                        {errors.contact?.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <textarea
                    placeholder="Yêu cầu đặc biệt"
                    {...register("Note")}
                    className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                  ></textarea>
                </div>
                <GenerateInvoiceForm
                  register={register}
                  errors={errors}
                  generateInvoice={generateInvoice}
                  setGenerateInvoice={setGenerateInvoice}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold text-18" data-translate="true">
              Thông tin hành khách
            </p>
            <div>
              {totalAdt > 0 &&
                Array.from({ length: totalAdt }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        (vé người lớn)
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.atd?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.atd[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.atd?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.atd[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`atd.${index}.gender`)}
                          >
                            <option value="" data-translate="true">
                              Vui lòng chọn giới tính
                            </option>
                            <option value="male" data-translate="true">
                              Quý ông
                            </option>
                            <option value="female" data-translate="true">
                              Quý bà
                            </option>
                          </select>
                        </div>
                        {errors.atd?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.atd[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`atd.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`atd.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`atd.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(
                                    new Date().getFullYear() - 12,
                                    11,
                                    31
                                  )
                                }
                                minDate={
                                  new Date(
                                    new Date().getFullYear() - 100,
                                    11,
                                    31
                                  )
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.atd?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.atd[index].birthday?.message}
                          </p>
                        )}
                      </div>
                      {flightType === "international" && (
                        <>
                          <div className="relative">
                            <label
                              id={`atd.${index}.passport`}
                              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                            >
                              <span data-translate="true">Số hộ chiếu</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`atd.${index}.passport`}
                              type="text"
                              {...register(`atd.${index}.passport`)}
                              placeholder="Nhập số hộ chiếu"
                              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                            />
                            {errors.atd?.[index]?.passport && (
                              <p className="text-red-600">
                                {errors.atd?.[index]?.passport.message}
                              </p>
                            )}
                          </div>
                          <div className="relative">
                            <label
                              htmlFor={`atd.${index}.nationality`}
                              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                            >
                              <span data-translate="true">Quốc tịch</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              id={`atd.${index}.nationality`}
                              {...register(`atd.${index}.nationality`)}
                              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Chọn quốc tịch
                              </option>
                              {FLIGHT_NATIONALITIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            {errors.atd?.[index]?.nationality && (
                              <p className="text-red-600">
                                {errors.atd?.[index]?.nationality?.message}
                              </p>
                            )}
                          </div>
                          <div className="relative">
                            <label
                              id={`atd.${index}.passport_expiry_date`}
                              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                            >
                              <span data-translate="true">Ngày hết hạn hộ chiếu</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                              <Controller
                                name={`atd.${index}.passport_expiry_date`}
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    id={`atd.${index}.passport_expiry_date`}
                                    selected={field.value || null}
                                    onChange={(date: Date | null) =>
                                      field.onChange(date)
                                    }
                                    onChangeRaw={(event) => {
                                      if (event) {
                                        const target =
                                          event.target as HTMLInputElement;
                                        if (target.value) {
                                          target.value = target.value
                                            .trim()
                                            .replace(/\//g, "-");
                                        }
                                      }
                                    }}
                                    placeholderText="Nhập ngày hết hạn"
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    locale={language}
                                    maxDate={
                                      new Date(
                                        new Date().getFullYear() + 50,
                                        11,
                                        31
                                      )
                                    }
                                    minDate={
                                      new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        new Date().getDate()
                                      )
                                    }
                                    className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                                  />
                                )}
                              />
                            </div>
                            {errors.atd?.[index]?.passport_expiry_date && (
                              <p className="text-red-600">
                                {
                                  errors.atd?.[index]?.passport_expiry_date
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {Object.keys(listBaggageGrouped).length > 0 &&
                        Object.entries(listBaggageGrouped).map(
                          ([flightLeg, items]) => {
                            const leg = parseInt(flightLeg);
                            const adtBaggages =
                              items.length > 0 &&
                              items.filter((bag: any) => {
                                return (
                                  bag.paxType === "ADULT" ||
                                  bag.paxType === "ALL"
                                );
                              });
                            const hasBaggage =
                              adtBaggages.length > 0 ? true : false;
                            return (
                              <div
                                id={`wrapper-baggage-atd-leg-${leg}`}
                                className={`relative ${!hasBaggage ? "cursor-not-allowed" : ""
                                  }`}
                                key={leg}
                              >
                                <label
                                  data-translate="true"
                                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                                >
                                  Hành lý chiều {leg === 0 ? "đi" : "về"}
                                </label>
                                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                  <select
                                    onChange={(event) => {
                                      handleChooseBaggage(
                                        leg,
                                        event.target.value,
                                        "atd",
                                        index
                                      );
                                    }}
                                    disabled={!hasBaggage}
                                    className={`text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5 ${!hasBaggage
                                        ? "cursor-not-allowed appearance-none"
                                        : ""
                                      }`}
                                  >
                                    <option value="" data-translate="true">
                                      {hasBaggage
                                        ? "Chọn gói hành lý"
                                        : "Liên hệ Happybook"}
                                    </option>
                                    {hasBaggage &&
                                      adtBaggages.map(
                                        (baggage: any, key: any) => (
                                          <option
                                            key={key}
                                            value={baggage.code_uni}
                                            data-translate="true"
                                          >
                                            {`${baggage.detail.weight} ${baggage.detail.unit}`}{" "}
                                            {" / "}
                                            {formatCurrency(baggage.price)}{" "}
                                            {baggage.description
                                              ? `(${baggage.description})`
                                              : ""}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {totalChd > 0 &&
                Array.from({ length: totalChd }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        ( vé trẻ em)
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.chd?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.chd[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.chd?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.chd[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          {(() => {
                            const genderReg = register(`chd.${index}.gender`);
                            return (
                              <select
                                className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                                {...genderReg}
                                onChange={(e) => {
                                  genderReg.onChange(e);
                                  validateField(`chd.${index}.gender`);
                                }}
                              >
                                <option value="" data-translate="true">
                                  Vui lòng chọn giới tính
                                </option>
                                <option value="male" data-translate="true">
                                  Nam
                                </option>
                                <option value="female" data-translate="true">
                                  Nữ
                                </option>
                              </select>
                            );
                          })()}
                        </div>
                        {errors.chd?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.chd[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`chd.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`chd.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`chd.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) => {
                                  field.onChange(date);
                                  validateField(`chd.${index}.birthday`);
                                }}
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  validateField(`chd.${index}.birthday`);
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(new Date().getFullYear() - 2, 11, 31)
                                }
                                minDate={
                                  new Date(new Date().getFullYear() - 12, 0, 1)
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.chd?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.chd[index].birthday?.message}
                          </p>
                        )}
                      </div>
                      {flightType === "international" && (
                        <InternationalPassportFields
                          segment="chd"
                          index={index}
                          register={register}
                          control={control}
                          errors={errors}
                          language={language}
                          onFieldValidate={validateField}
                        />
                      )}
                      {Object.keys(listBaggageGrouped).length > 0 &&
                        Object.entries(listBaggageGrouped).map(
                          ([flightLeg, items]) => {
                            const leg = parseInt(flightLeg);
                            const chdBaggages =
                              items.length > 0 &&
                              items.filter((bag: any) => {
                                return (
                                  bag.paxType === "CHILD" ||
                                  bag.paxType === "ALL"
                                );
                              });
                            const hasBaggage =
                              chdBaggages.length > 0 ? true : false;
                            return (
                              <div
                                className={`relative ${!hasBaggage ? "cursor-not-allowed" : ""
                                  }`}
                                key={leg}
                              >
                                <label
                                  data-translate="true"
                                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                                >
                                  Hành lý chiều {leg === 0 ? "đi" : "về"}
                                </label>
                                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                  <select
                                    onChange={(event) => {
                                      handleChooseBaggage(
                                        leg,
                                        event.target.value,
                                        "chd",
                                        index
                                      );
                                    }}
                                    disabled={!hasBaggage}
                                    className={`text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5 ${!hasBaggage
                                        ? "cursor-not-allowed appearance-none"
                                        : ""
                                      }`}
                                  >
                                    <option value="" data-translate="true">
                                      {hasBaggage
                                        ? "Chọn gói hành lý"
                                        : "Liên hệ Happybook"}
                                    </option>
                                    {hasBaggage &&
                                      chdBaggages.map(
                                        (baggage: any, key: any) => (
                                          <option
                                            key={key}
                                            value={baggage.code_uni}
                                            data-translate="true"
                                          >
                                            {`${baggage.detail.weight} ${baggage.detail.unit}`}{" "}
                                            {" / "}
                                            {formatCurrency(baggage.price)}{" "}
                                            {baggage.description
                                              ? `(${baggage.description})`
                                              : ""}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {totalInf > 0 &&
                Array.from({ length: totalInf }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        ( vé em bé)
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.inf?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.inf[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.inf?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.inf[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          {(() => {
                            const genderReg = register(`inf.${index}.gender`);
                            return (
                              <select
                                className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                                {...genderReg}
                                onChange={(e) => {
                                  genderReg.onChange(e);
                                  validateField(`inf.${index}.gender`);
                                }}
                              >
                                <option value="" data-translate="true">
                                  Vui lòng chọn giới tính
                                </option>
                                <option value="male" data-translate="true">
                                  Nam
                                </option>
                                <option value="female" data-translate="true">
                                  Nữ
                                </option>
                              </select>
                            );
                          })()}
                        </div>
                        {errors.inf?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.inf[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`inf.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`inf.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`inf.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) => {
                                  field.onChange(date);
                                  validateField(`inf.${index}.birthday`);
                                }}
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  validateField(`inf.${index}.birthday`);
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(new Date().getFullYear(), 11, 31)
                                }
                                minDate={
                                  new Date(new Date().getFullYear() - 2, 0, 1)
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.inf?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.inf[index].birthday?.message}
                          </p>
                        )}
                      </div>
                      {flightType === "international" && (
                        <InternationalPassportFields
                          segment="inf"
                          index={index}
                          register={register}
                          control={control}
                          errors={errors}
                          language={language}
                          onFieldValidate={validateField}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
            {bookingError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                <p className="font-semibold">{bookingError.message}</p>
                {bookingError.details.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {bookingError.details.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                {bookingError.code === "FARE_ALREADY_EXPIRED" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleSearchRedirect}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {language === "vi" ? "Tìm kiếm lại chuyến bay" : "Search flights again"}
                    </button>
                  </div>
                )}
              </div>
            )}
            {confirmStep === "review" && confirmData && (
              <div className="mt-6 space-y-6">
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                  <h4 className="text-18 font-bold mb-4 border-b pb-2 text-[#0C4089]" data-translate="true">
                    Thông tin liên hệ & hành khách
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-500" data-translate="true">Người liên hệ</p>
                      <p className="font-semibold text-gray-800">{getValues("contact.full_name")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500" data-translate="true">Số điện thoại</p>
                      <p className="font-semibold text-gray-800">{getValues("contact.phone")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500" data-translate="true">Email</p>
                      <p className="font-semibold text-gray-800">{getValues("contact.email")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500" data-translate="true">Giới tính</p>
                      <p className="font-semibold text-gray-800">
                        {getValues("contact.gender") === "male" || getValues("contact.gender") === true ? "Nam" : "Nữ"}
                      </p>
                    </div>
                  </div>

                  <h5 className="text-sm font-bold mb-3 text-gray-700" data-translate="true">
                    Danh sách hành khách
                  </h5>
                  <div className="space-y-3">
                    {getValues("atd")?.map((p, idx) => (
                      <div key={`adt-${idx}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {idx + 1}. {p.lastName?.toUpperCase()} {p.firstName?.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.gender === "male" ? "Nam" : "Nữ"}
                            {p.birthday && ` - ${format(new Date(p.birthday), "dd/MM/yyyy")}`}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium" data-translate="true">
                          Người lớn
                        </span>
                      </div>
                    ))}
                    {getValues("chd")?.map((p, idx) => (
                      <div key={`chd-${idx}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {idx + 1}. {p.lastName?.toUpperCase()} {p.firstName?.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.gender === "male" ? "Nam" : "Nữ"}
                            {p.birthday && ` - ${format(new Date(p.birthday), "dd/MM/yyyy")}`}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium" data-translate="true">
                          Trẻ em
                        </span>
                      </div>
                    ))}
                    {getValues("inf")?.map((p, idx) => (
                      <div key={`inf-${idx}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {idx + 1}. {p.lastName?.toUpperCase()} {p.firstName?.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {p.gender === "male" ? "Nam" : "Nữ"}
                            {p.birthday && ` - ${format(new Date(p.birthday), "dd/MM/yyyy")}`}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium" data-translate="true">
                          Em bé
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <FlightConfirmPriceReview
                  confirmData={confirmData}
                  searchFareTotal={totalPrice}
                  serviceFeeTotal={serviceFeeTotal}
                  baggageTotal={totalBaggages.price}
                  totalDiscount={totalDiscount}
                  onBack={handleBackFromConfirm}
                  onProceedPayment={handleProceedToPayment}
                  isProceeding={proceedingPayment}
                  isExpired={confirmExpired}
                  onExpired={handleConfirmExpired}
                  isHeld={isHeld}
                  pnrNumber={pnrNumber}
                />
              </div>
            )}
            {confirmStep === "form" && (
              <div className="mt-6">
                <LoadingButton
                  isLoading={loading}
                  text="Tiếp tục"
                  disabled={false}
                />
              </div>
            )}
          </div>
        <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl pb-0 ">
          <div className="pb-0 py-4 px-3 lg:px-6">
            <div className="flex flex-col space-y-2 items-start lg:items-center lg:space-y-0 lg:flex-row lg:justify-between">
              <span className="text-22 font-semibold" data-translate="true">
                Thông tin đặt chỗ
              </span>
              <button
                type="button"
                className="underline underline-offset-8	 text-blue-700 pb-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFlightDetail(true);
                }}
                data-translate="true"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
          {/* Flight */}
          <div>
            {flights.map((item, index) => {
              const flight = item;
              const departure = flight.departure as
                | { at?: string; IATACode?: string; timezone?: string }
                | undefined;
              const arrival = flight.arrival as
                | { at?: string; IATACode?: string; timezone?: string }
                | undefined;
              if (
                !departure?.at ||
                !arrival?.at ||
                !departure?.IATACode ||
                !arrival?.IATACode
              ) {
                return null;
              }
              const departAt = departure.at;
              const arriveAt = arrival.at;
              const durationFlight = flight.duration
                ? flight.duration
                : differenceInSeconds(
                  new Date(arriveAt),
                  new Date(departAt)
                ) / 60;
              const startDateLocale = format(
                new Date(departAt),
                "EEEE dd/MM/yyyy",
                { locale: vi }
              );
              return (
                <div
                  className={`py-3 px-3 lg:px-6 mb-3 border-t-gray-300 ${index > 0 ? "border-t" : "border-t-0"
                    }`}
                  key={index}
                >
                  <div className="flex justify-between">
                    <p className="font-bold" data-translate="true">
                      {index === 1 ? "Chiều về" : "Chiều đi"}
                    </p>
                    <p className="text-sm text-gray-500" data-translate="true">
                      {startDateLocale}
                    </p>
                  </div>
                  <div className="flex my-3 item-start items-center text-left space-x-3">
                    <DisplayImage
                      imagePath={`assets/images/airline/${String(flight.airLineCode ?? flight.airline ?? "vn").toLowerCase()}.gif`}
                      width={80}
                      height={24}
                      alt={flight.airline}
                      classStyle={"max-w-16 md:max-w-20 max-h-10"}
                    />
                    <div>
                      <h3 className="text-sm md:text-18 font-semibold mb-1">
                        {flight.airline}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-3 flex justify-between">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">
                          {formatTimeZone(
                            departAt,
                            departure.timezone ?? "Asia/Ho_Chi_Minh"
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {departure.IATACode}
                        </span>
                      </div>

                      <div className="flex items-center w-full space-x-3">
                        <Image
                          src="/icon/fa-solid_plane.svg"
                          width={20}
                          height={20}
                          alt="Máy bay"
                          className="w-5 h-5 hidden md:block"
                        />
                        <div className="flex flex-col items-center w-full">
                          <span className="text-sm text-gray-700 mb-2">
                            {formatNumberToHoursAndMinutesFlight(
                              durationFlight
                            )}
                          </span>
                          <div className="relative flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-700"></div>
                            <div className="flex-shrink-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                          </div>
                          <span
                            className="text-sm text-gray-700 mt-2"
                            data-translate="true"
                          >
                            {flight.stopPoint
                              ? `${flight.stopPoint} điểm dừng`
                              : "Bay thẳng"}
                          </span>
                        </div>
                        <Image
                          src="/icon/map-pinned.svg"
                          width={20}
                          height={20}
                          alt="Điểm đến"
                          className="w-5 h-5 hidden md:block"
                        />
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-sm">
                          {formatTimeZone(
                            arriveAt,
                            arrival.timezone ?? "Asia/Ho_Chi_Minh"
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {arrival.IATACode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Line process */}
            <div className="mt-6 flex flex-row items-center justify-between w-full overflow-hidden">
              <div className="w-8 h-8 bg-gray-100 rounded-full -ml-3"></div>
              <div className="relative w-full h-px mx-2 overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:16px_2px] bg-repeat-x"></div>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full -mr-3"></div>
            </div>
            <div className="py-4 px-3 lg:px-6">
              <p className="text-22 font-bold mb-2" data-translate="true">
                Giá chi tiết
              </p>
              {dropdown.map((item: any, index: number) => (
                <div key={index} className="mb-4">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    className="flex justify-between text-sm items-start space-x-3 w-full text-left outline-none"
                  >
                    <div className="flex w-8/12">
                      <span data-translate="true">
                        {item.title} (
                        {Array.from({ length: item.quantity }, (_, key) => (
                          <span key={keyLoopDropdown++}>
                            hành khách {keyLoopDropdown}
                            {key < item.quantity - 1 && ", "}
                          </span>
                        ))}
                        )
                      </span>
                      <span className="ml-1">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={
                              activeIndex === index
                                ? "M15 12.5L10 7.5L5 12.5"
                                : "M5 7.5L10 12.5L15 7.5"
                            }
                            stroke="#667085"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="text-gray-900 font-bold w-4/12 text-right">
                      {formatCurrency(item.totalPrice)} x {item.quantity}
                    </div>
                  </button>
                  <div
                    className={`rounded-lg transition-all delay-300 ease-in ${activeIndex === index
                        ? "max-h-16 opacity-100 visible"
                        : "max-h-0 opacity-0 invisible"
                      } `}
                  >
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span data-translate="true">Vé</span>
                      <span>
                        {formatCurrency(item.totalPriceTicket)} x{" "}
                        {item.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span data-translate="true">Thuế và phí</span>
                      <span>
                        {formatCurrency(item.totalTax)} x {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pb-4">
                <span className="text-sm text-gray-500" data-translate="true">
                  Hành lý bổ sung
                </span>
                <p className="font-semibold">
                  {totalBaggages.price && totalBaggages.quantity
                    ? `${formatCurrency(totalBaggages.price)} x ${totalBaggages.quantity
                    }`
                    : "0đ"}
                </p>
              </div>
              <div className="pt-4 border-t">
                <VoucherProgram
                  totalPrice={finalPrice}
                  onApplyVoucher={handleApplyVoucher}
                  vouchersData={vouchersData}
                  voucherErrors={voucherErrors}
                  currency={"VND"}
                  onSearch={handleSearch}
                  isSearching={searchingVouchers}
                />
              </div>
              <div className="border-t border-t-gray-200">
                {totalDiscount > 0 && (
                  <div>
                    <div className="flex pt-4 justify-between">
                      <span
                        className=" text-gray-700 font-bold"
                        data-translate="true"
                      >
                        Giá gốc
                      </span>
                      <p className="font-semibold">
                        {formatCurrency(finalPrice)}
                      </p>
                    </div>
                    <div className="flex py-4 justify-between">
                      <span
                        className=" text-gray-700 font-bold"
                        data-translate="true"
                      >
                        Giảm giá
                      </span>
                      <p className="font-semibold">
                        {formatCurrency(totalDiscount)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex pt-4 justify-between border-t border-t-gray-300 ">
                  <span
                    className=" text-gray-700 font-bold"
                    data-translate="true"
                  >
                    Tổng cộng
                  </span>
                  <p className="font-bold text-primary">
                    {formatCurrency(
                      confirmStep === "review" && confirmData
                        ? sidebarGrandTotal
                        : finalPrice - totalDiscount
                    )}
                  </p>
                </div>
                {/* <div className="text-[#166987] font-semibold mt-1 text-sm leading-6 italic">
                  Bạn được tặng {totalAdt + totalChd + totalInf} bảo hiểm du
                  lịch.Sau khi đơn hàng được đặt sẽ có booker liên hệ để tư vấn
                  gói bảo hiểm phù hợp với bạn.
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {flightsDetail.length > 0 && (
        <FlightDetailPopup
          airports={airportsData}
          tabs={[
            { id: 1, name: "Chi tiết hành trình" },
            { id: 2, name: "Điều kiện vé" },
          ]}
          flights={flightsDetail}
          isOpen={showFlightDetail}
          onClose={handleClosePopupFlightDetail}
          isLoadingFareRules={false}
        />
      )}
      {draftModal && (
        <ResumeFlightDraftModal
          match={draftModal}
          onClose={() => setDraftModal(null)}
        />
      )}
    </form>
  );
}
