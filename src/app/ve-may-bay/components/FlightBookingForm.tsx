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
import { Controller, useForm } from "react-hook-form";
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
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import {
  buildFlightConfirmPricePayloadFromSelections,
  buildPassengersFromForm,
  normalizeConfirmPriceResponse,
} from "@/utils/buildFlightConfirmPricePayload";
import {
  loadSelectedFlightsForBooking,
  tripFromSelection,
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
  const [pnrNumber, setPnrNumber] = useState<string | null>(null);
  const [pendingBookingPayload, setPendingBookingPayload] = useState<any>(null);
  const [selectedFlights, setSelectedFlights] = useState<SelectedFlight[]>([]);
  const [draftModal, setDraftModal] = useState<FlightDraftMatch | null>(null);
  const { userInfo } = useUser();

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
    data.trip = flights.length > 1 ? "round_trip" : "one_way";
    const { atd, chd, inf, checkBoxGenerateInvoice, ...formatData } = data;
    let fare_data: any = [];
    let total_price_net = 0;
    let total_tax = 0;
    let total_fee_service = 0;
    let total_price = 0;

    const ticketClassOf = (item: Record<string, unknown>) =>
      (item.selectedTicketClass as Record<string, unknown>) ?? item;

    if (is1G) {
      const primary = flights[0] as Record<string, unknown>;
      const tc = ticketClassOf(primary);
      total_price_net += Number(tc.totalPriceWithOutTax ?? tc.fareAdult ?? primary.totalPrice ?? 0);
      total_tax +=
        Number(tc.totalTaxAdt ?? primary.totalTaxAdt ?? 0) +
        Number(tc.totalTaxChd ?? primary.totalTaxChd ?? 0) +
        Number(tc.totalTaxInf ?? primary.totalTaxInf ?? 0);
      total_price += Number(tc.totalPrice ?? primary.totalPrice ?? 0);
      total_fee_service += Number(tc.totalServiceFee ?? primary.totalServiceFee ?? 0);
      fare_data.push({
        session: flightSession,
        fare_data_id_api: primary.hpb_id ?? primary.flightId,
        source: "1G",
        flights,
      });
    } else {
      flights.map((item) => {
        const tc = ticketClassOf(item);
        total_price_net += Number(tc.totalPriceWithOutTax ?? 0);
        total_tax +=
          Number(tc.totalTaxAdt ?? 0) +
          Number(tc.totalTaxChd ?? 0) +
          Number(tc.totalTaxInf ?? 0);
        total_price += Number(tc.totalPrice ?? 0);
        total_fee_service += Number(tc.totalServiceFee ?? 0);
        fare_data.push({
          session: flightSession,
          fare_data_id_api: item.flightId,
          source: item.source,
          flights: [
            {
              flight_value: resolveFareValueFromFareOption(
                item.source,
                tc,
                item
              ),
              detail: item,
            },
          ],
        });
      });
    }
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

  const onSubmit = async (data: FlightBookingInforType) => {
    if (confirmStep === "review") return;

    const selections = resolveSelectionsForBooking();

    const verifyErrors = verifySelectedFlights(selections);
    if (verifyErrors.length) {
      toast.error(verifyErrors[0]);
      return;
    }

    const confirmPassengers = buildPassengersFromForm(
      data,
      listBaggagePassenger
    );

    const contact = {
      full_name: data.contact.full_name,
      gender:
        data.contact.gender === true || data.contact.gender === "male"
          ? "male"
          : data.contact.gender === false || data.contact.gender === "female"
            ? "female"
            : String(data.contact.gender ?? "male"),
      phone: data.contact.phone,
      email: data.contact.email,
      address: "",
    };

    let confirmPayload;
    try {
      confirmPayload = buildFlightConfirmPricePayloadFromSelections({
        selections,
        passengers: confirmPassengers,
        contact,
      });
    } catch (buildErr) {
      const code =
        buildErr instanceof Error ? buildErr.message : String(buildErr ?? "");
      if (code === "VJ_SEGMENT_TOKEN_REQUIRED") {
        toast.error(
          "Thiếu mã chặng bay VJ từ kết quả tìm kiếm. Vui lòng tìm chuyến lại và chọn hạng vé."
        );
      } else if (code === "VJ_SESSION_REQUIRED") {
        toast.error("Phiên tìm kiếm đã hết hạn. Vui lòng tìm chuyến bay lại.");
      } else if (code === "VN1A_SESSION_REQUIRED") {
        toast.error("Phiên tìm kiếm VN1A đã hết hạn. Vui lòng tìm chuyến bay lại.");
      } else if (code === "VN1A_FARE_VALUE_REQUIRED") {
        toast.error(
          "Thiếu mã giá Vietnam Airlines (fareValue). Vui lòng chọn lại hạng vé hoặc tìm chuyến mới."
        );
      } else if (code === "VU_FARE_VALUE_REQUIRED") {
        toast.error(
          "Thiếu mã giá Vietravel (fareValue). Vui lòng chọn lại hạng vé hoặc tìm chuyến mới."
        );
      } else {
        toast.error(
          "Giá vé không còn hiệu lực. Vui lòng tìm chuyến bay lại và chọn hạng vé mới."
        );
      }
      return;
    }

    const finalData = buildBookingPayload(data);
    if (!finalData) return;

    try {
      setLoading(true);
      const respon = await FlightApi.confirmPrice(confirmPayload);
      if (respon?.status === 200) {
        const confirmResult =
          (respon?.payload?.data as ConfirmPriceResponse) ??
          (respon?.payload as ConfirmPriceResponse);
        const resultRecord = confirmResult as Record<string, unknown>;

        if (isConfirmPriceSoftFailure(resultRecord)) {
          setBookingError({
            code: "fare_token_invalid",
            message:
              "Không giữ được giá (mã giá hết hạn hoặc không khớp phiên tìm kiếm). Vui lòng tìm chuyến bay lại và xác nhận giá ngay.",
            details: [],
          });
          toast.error(
            "Token giá không hợp lệ hoặc đã hết hạn. Vui lòng tìm kiếm lại."
          );
          return;
        }

        setBookingError(null);
        setConfirmData(confirmResult);
        setConfirmExpired(false);
        setPendingBookingPayload(finalData);

        const normalizedConfirm =
          normalizeConfirmPriceResponse(confirmResult);
        const requestId =
          normalizedConfirm.bookingFlightRequestId ??
          (confirmResult as any).booking_flight_request_id;

        handleSessionStorage("save", "flightConfirmPrice", {
          confirm: confirmResult,
          request: confirmPayload,
          bookingDraft: finalData,
        });

        // Gọi hold-flight để giữ PNR ngay sau khi confirm giá
        if (requestId) {
          const holdPayload = {
            ...finalData,
            booking_flight_request_id: requestId,
          };
          try {
            const holdRes = await FlightApi.holdFlight(holdPayload);
            if (holdRes?.status === 200) {
              const holdData = (holdRes?.payload?.data ??
                holdRes?.payload) as FlightBookFlightResponse;
              const holdOrderInfo = holdData.orderInfo as Record<string, unknown> | undefined;

              setIsHeld(true);
              setPnrNumber(
                (holdOrderInfo?.pnr_number as string) ?? null
              );

              const storedConfirmRequest = handleSessionStorage("get", "flightConfirmPrice")
                ?.request as Record<string, unknown> | undefined;

              const draftSession = {
                ...finalData,
                flights,
                booking_flight_request_id: requestId,
                confirmPrice: confirmResult,
                confirmPriceRequest: storedConfirmRequest,
                bookingId: normalizedConfirm.bookingId,
                airdata_booking_id:
                  (confirmResult as any).airdata_booking_id ?? normalizedConfirm.bookingId,
                order_code: normalizedConfirm.orderCode,
              };

              const bookingFlight = mergeBookFlightIntoSession(
                draftSession,
                holdData,
                confirmResult
              );

              if (totalDiscount > 0 && bookingFlight.orderInfo) {
                (bookingFlight.orderInfo as { total_discount?: number }).total_discount =
                  totalDiscount;
              }

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
                stage: "held",
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
              toast.success("Đã giữ chỗ thành công. Vui lòng thanh toán để xác nhận vé.");
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }
            // Hold failed — fall through to show confirm-only UI
            toast.error("Không thể giữ chỗ. Vui lòng thử lại hoặc tiếp tục đặt vé.");
          } catch {
            toast.error("Lỗi giữ chỗ. Vui lòng thử lại.");
          }
        }

        // Fallback: hold không thành công hoặc không có requestId — show confirm review
        setConfirmStep("review");
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
          stage: "price_confirmed",
          resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
          orderCode: normalizedConfirm.orderCode || undefined,
          bookingDeadline: normalizedConfirm.bookingDeadline,
          holdExpiresAt: normalizedConfirm.holdExpiresAt ?? undefined,
          flow: resolveBookingDraftFlow(flights, flightType),
          selectionFingerprint,
        });
        toast.success("Đã xác nhận giá. Vui lòng kiểm tra trước khi thanh toán.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errDisplay = showFlightBookingError(
          respon?.payload,
          toaStrMsg.sendFailed
        );
        if (isFlightDepartureError(errDisplay.code)) {
          setConfirmStep("form");
          setConfirmData(null);
          handleSessionStorage("remove", "flightConfirmPrice");
        }
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

    // Đã hold PNR trước đó — chỉ redirect, không cần gọi API
    if (isHeld) {
      const heldSession = handleSessionStorage("get", "bookingFlight") as
        | Record<string, unknown>
        | undefined;
      if (heldSession?.confirmPrice) {
        handleSessionStorage(
          "save",
          "bookingFlight",
          attachPriceHoldToBookingSession(
            heldSession,
            heldSession.confirmPrice as ConfirmPriceResponse,
            new Date().toISOString()
          )
        );
      }
      handleSessionStorage("remove", [
        "selectedFlightDepart",
        "selectedFlightReturn",
        "departFlight",
        "returnFlight",
        "flightConfirmPrice",
      ]);
      setBookingError(null);
      router.push("/ve-may-bay/thong-tin-dat-cho");
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

      const storedConfirmRequest = handleSessionStorage("get", "flightConfirmPrice")
        ?.request as Record<string, unknown> | undefined;

      const draftSession = {
        ...pendingBookingPayload,
        flights,
        booking_flight_request_id: requestId,
        confirmPrice: confirmData,
        confirmPriceRequest: storedConfirmRequest,
        bookingId: normalized.bookingId,
        airdata_booking_id:
          confirmData.airdata_booking_id ?? normalized.bookingId,
        order_code: normalized.orderCode,
      };

      const merged = mergeBookFlightIntoSession(
        draftSession,
        bookData,
        confirmData
      );
      const bookingFlight = attachPriceHoldToBookingSession(
        merged,
        confirmData
      );

      if (totalDiscount > 0 && bookingFlight.orderInfo) {
        (bookingFlight.orderInfo as { total_discount?: number }).total_discount =
          totalDiscount;
      }

      handleSessionStorage("save", "bookingFlight", bookingFlight);
      handleSessionStorage("save", "flightBookingDraft", pendingBookingPayload);
      const orderSku =
        (bookingFlight.orderInfo as { sku?: string })?.sku ??
        normalized.orderCode;
      updateFlightDraftMeta({
        stage: "pending_payment",
        resumeUrl: "/ve-may-bay/thong-tin-dat-cho",
        orderCode: orderSku,
        bookingDeadline:
          (bookingFlight.orderInfo as { booking_deadline?: string })
            ?.booking_deadline ?? normalized.bookingDeadline,
        holdExpiresAt: normalized.holdExpiresAt ?? undefined,
        flow: resolveBookingDraftFlow(flights, flightType),
      });
      handleSessionStorage("remove", [
        "selectedFlightDepart",
        "selectedFlightReturn",
        "departFlight",
        "returnFlight",
        "flightConfirmPrice",
      ]);
      setBookingError(null);
      router.push("/ve-may-bay/thong-tin-dat-cho");
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
    setPnrNumber(null);
    setBookingError(null);
    handleSessionStorage("remove", "flightConfirmPrice");
  };

  const handleConfirmExpired = () => {
    setConfirmExpired(true);
    toast.error("Phiên đặt vé đã hết hạn");
    router.push("/ve-may-bay/tim-kiem-ve");
  };
  useEffect(() => {
    const selections = loadSelectedFlightsForBooking();
    if (!selections.length) {
      router.push("/ve-may-bay");
      return;
    }

    const flightData = selections.map(tripFromSelection);
    const flightSession = handleSessionStorage("get", "flightSession");

    if (selections.length > 1) setIsRoundTrip(true);
    setSelectedFlights(selections);
    setFlights(flightData);
    const is1G = String(selections[0].trip?.source ?? "").toUpperCase() === "1G";
    setFlightType(
      is1G || !selections[0].trip.domestic ? "international" : "domestic"
    );
    setFlightsDetail(flightData);
    setFlightSession(flightSession ?? selections[0].searchId);
    const savedConfirm = handleSessionStorage("get", "flightConfirmPrice");
    if (savedConfirm?.confirm && savedConfirm?.bookingDraft) {
      setConfirmData(savedConfirm.confirm);
      setPendingBookingPayload(savedConfirm.bookingDraft);
      setConfirmStep("review");
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

  let totalPrice = 0;
  let totalAdt = 1;
  let totalChd = 0;
  let totalInf = 0;
  let totalPriceAdt = 0;
  let totalPriceChd = 0;
  let totalPriceInf = 0;
  let keyLoopPassenger = 1;
  let keyLoopDropdown = 1;
  let totalPriceTicketAdt = 0;
  let totalPriceTicketChd = 0;
  let totalPriceTicketInf = 0;
  let totalTaxAdt = 0;
  let totalTaxChd = 0;
  let totalTaxInf = 0;
  let dropdown: any = [];
  flights.map((item) => {
    const ticketClass =
      (item.selectedTicketClass as Record<string, unknown>) ?? item;
    totalAdt = item.numberAdt;
    totalChd = item.numberChd;
    totalInf = item.numberInf;
    totalPriceTicketAdt += Number(ticketClass.fareAdultFinal ?? item.fareAdultFinal ?? 0);
    totalPriceTicketChd += Number(ticketClass.fareChildFinal ?? item.fareChildFinal ?? 0);
    totalPriceTicketInf += Number(ticketClass.fareInfantFinal ?? item.fareInfantFinal ?? 0);
    totalTaxAdt += Number(ticketClass.taxAdult ?? item.taxAdult ?? 0);
    totalTaxChd += Number(ticketClass.taxChild ?? item.taxChild ?? 0);
    totalTaxInf += Number(ticketClass.taxInfant ?? item.taxInfant ?? 0);
    totalPriceAdt += Number(ticketClass.totalAdult ?? item.totalAdult ?? 0);
    totalPriceChd += Number(ticketClass.totalChild ?? item.totalChild ?? 0);
    totalPriceInf += Number(ticketClass.totalInfant ?? item.totalInfant ?? 0);
    totalPrice += Number(ticketClass.totalPrice ?? item.totalPrice ?? 0);
  });
  if (totalAdt) {
    dropdown.push({
      totalPrice: totalPriceAdt,
      quantity: totalAdt,
      totalPriceTicket: totalPriceTicketAdt,
      totalTax: totalTaxAdt,
      type: "Adt",
      title: "Vé người lớn",
    });
  }
  if (totalChd) {
    dropdown.push({
      totalPrice: totalPriceChd,
      quantity: totalChd,
      totalPriceTicket: totalPriceTicketChd,
      totalTax: totalTaxChd,
      type: "Chd",
      title: "Vé trẻ em",
    });
  }
  if (totalInf) {
    dropdown.push({
      totalPrice: totalPriceInf,
      quantity: totalInf,
      totalPriceTicket: totalPriceTicketInf,
      totalTax: totalTaxInf,
      type: "Inf",
      title: "Vé em bé",
    });
  }

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
          flight.segments.map((segment: any) => {
            baggeParams.itineraries.push({
              airline: segment.airline,
              source: flight.source,
              departure: segment.departure.IATACode,
              arrival: segment.arrival.IATACode,
              departureDate: segment.departure.at,
              arrivalDate: segment.arrival.at,
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
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`chd.${index}.gender`)}
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
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`inf.${index}.gender`)}
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
                    </div>
                  </div>
                ))}
            </div>
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
              </div>
            )}
            {confirmStep === "review" && confirmData && (
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
              const durationFlight = flight.duration
                ? flight.duration
                : differenceInSeconds(
                  new Date(flight.arrival.at),
                  new Date(flight.departure.at)
                ) / 60;
              const startDateLocale = format(
                new Date(flight.departure.at),
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
                      imagePath={`assets/images/airline/${flight.airLineCode.toLowerCase()}.gif`}
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
                            flight.departure.at,
                            flight.departure.timezone
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {flight.departure.IATACode}
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
                            flight.arrival.at,
                            flight.arrival.timezone
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {flight.arrival.IATACode}
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
