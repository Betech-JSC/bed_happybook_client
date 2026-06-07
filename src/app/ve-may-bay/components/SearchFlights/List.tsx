"use client";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addDays,
  differenceInHours,
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import Image from "next/image";
import {
  formatTimeFromHour,
  pareseDateFromString,
} from "@/lib/formatters";
import {
  getCurrentLanguage,
  handleScrollSmooth,
  handleSessionStorage,
} from "@/utils/Helper";
import { filtersFlight, ListFlight } from "@/types/flight";
import { useRouter } from "next/navigation";
import SignUpReceiveCheapTickets from "../SignUpReceiveCheapTickets";
import FlightDetailPopup from "../FlightDetailPopup";
import { FlightApi } from "@/api/Flight";
import { translateText } from "@/utils/translateApi";
import { useLanguage } from "@/contexts/LanguageContext";
import FlightDomesticDetail from "./Detail";
import TimeRangeSlider from "@/components/base/TimeRangeSlider";
import SideBarFilterFlights from "../SideBarFilter";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getCheapestComparablePrice,
  getDomesticDisplayedPrice,
} from "../../lib/cheapest";
import { createSelectedFlight } from "@/utils/createSelectedFlight";
import { saveSelectedFlight, loadSelectedFlightsForBooking } from "@/utils/selectedFlightStorage";
import { isVietJetSource } from "@/utils/fareValueToken";
import {
  buildCombinedSelectionFingerprint,
  buildLegSelectionFingerprint,
  buildSearchRouteFromParams,
  evaluateFlightSelectionChange,
  replaceDraftLegSelection,
  saveFlightDraftMetaForSearch,
  type FlightSelectionLeg,
} from "@/utils/flightDraftSession";
import { toast } from "react-hot-toast";
import ReplaceFlightDraftDialog from "../ReplaceFlightDraftDialog";
import VerifyFlightPriceDialog from "../VerifyFlightPriceDialog";
import { buildFlightConfirmPricePayloadFromSelections } from "@/utils/buildFlightConfirmPricePayload";
import { formatFlightBookingError } from "@/utils/formatFlightBookingError";
import { HttpError } from "@/lib/error";


const defaultFilers: filtersFlight = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
  stopNum: [],
  departureTime: [0, 24],
  arrivalTime: [0, 24],
};
const INITIAL_LIMIT = 5;

export default function ListFlights({
  airportsData,
  flightsData,
  airlineData,
  isFullFlightResource,
  from,
  to,
  StartPoint,
  EndPoint,
  returnDate,
  departDate,
  currentDate,
  currentReturnDay,
  departDays,
  returnDays,
  handleClickDate,
  flightSession,
  tripsSource = "resource",
  paxCounts = { adult: 1, child: 0, infant: 0 },
  isRoundTrip,
  totalPassengers,
  flightType,
  flightStopNum,
  translatedStaticText,
  isReady,
  onDraftChange,
}: ListFlight) {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const departFlightRef = useRef<HTMLDivElement>(null);
  const returnFlightRef = useRef<HTMLDivElement>(null);
  const [filteredFlightsData, setFilteredFlightsData] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [isLoadingFareRules, setIsLoadingFareRules] = useState<boolean>(false);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [departLimit, setDepartLimit] = useState(INITIAL_LIMIT);
  const [returnLimit, setReturnLimit] = useState(INITIAL_LIMIT);
  const [filters, setFilters] = useState(defaultFilers);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [replaceDialogMessage, setReplaceDialogMessage] = useState("");
  const pendingSelectRef = useRef<(() => void) | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const buildMockPassengers = (paxCounts: { adult: number; child: number; infant: number }) => {
    const passengers: any[] = [];
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


  const searchRoute = useMemo(
    () =>
      buildSearchRouteFromParams({
        startPoint: StartPoint ?? "",
        endPoint: EndPoint ?? "",
        tripType: isRoundTrip ? "roundTrip" : "oneWay",
        departDate: departDate ?? "",
        returnDate: isRoundTrip
          ? (returnDate ?? departDate ?? "")
          : (departDate ?? ""),
      }),
    [StartPoint, EndPoint, isRoundTrip, departDate, returnDate]
  );

  const notifyDraftChange = useCallback(() => {
    onDraftChange?.();
  }, [onDraftChange]);

  const getFareIndexFromFlight = (flight: {
    fareOptions?: { fareValue?: string }[];
    selectedTicketClass?: { fareValue?: string };
  }): number => {
    const selectedFv = flight.selectedTicketClass?.fareValue;
    if (!selectedFv || !flight.fareOptions?.length) return 0;
    const idx = flight.fareOptions.findIndex((f) => f.fareValue === selectedFv);
    return idx >= 0 ? idx : 0;
  };

  // AOS is handled globally via AosProvider IntersectionObserver
  const scrollToRef = (ref: any) => {
    if (ref.current) {
      handleScrollSmooth(ref.current);
    }
  };
  const resetFilters = () => {
    setFilters(defaultFilers);
  };

  // Filter data
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (isFullFlightResource) {
      setFilters((prev) => {
        if (name === "airLine") {
          return {
            ...prev,
            airlines: checked
              ? [...prev.airlines, value]
              : prev.airlines.filter((airline) => airline !== value),
          };
        } else if (name === "priceWithoutTax") {
          return {
            ...prev,
            priceWithoutTax: checked ? value : "0",
          };
        } else if (name === "timeDepart") {
          return {
            ...prev,
            timeDepart: checked ? value : "",
          };
        } else if (name === "sortPrice") {
          return {
            ...prev,
            sortPrice: checked ? value : "",
          };
        } else if (name === "sortAirLine") {
          return {
            ...prev,
            sortAirLine: checked ? value : "",
          };
        } else if (name === "stopNum") {
          return {
            ...prev,
            stopNum: checked
              ? [...prev.stopNum, value]
              : prev.stopNum.filter((itemStopNum) => itemStopNum !== value),
          };
        }
        return prev;
      });
    }
  };

  const toggleShowRuleTicket = useCallback(
    async (flight: any) => {
      // const response = await fetchFareRules(flight, indexFareOption);
      const response = await FlightApi.getFareRules({
        ...flight,
        language: language,
      });
      return response?.payload?.data ?? [];
    },
    [language]
  );

  const handleShowPopupFlightDetail = (
    flight: any,
    indexFareOption: number,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    if (showRuleTicket) {
      flight.fareOptSelected = flight.fareOptions[indexFareOption];
      if (!flight.domestic && ["1G", "VN1A"].includes(flight.source)) {
        setShowDetail(true);
        setFlightDetail([flight]);
      } else {
        const response = toggleShowRuleTicket(flight);
        response.then((rules) => {
          if (rules) flight.fareRules = rules;
          setShowDetail(true);
          setFlightDetail([flight]);
        });
      }
    } else {
      setShowDetail(true);
      setFlightDetail([flight]);
    }
    setTabsFlightDetail(tabs);
  };

  const handleClosePopupFlightDetail = useCallback(() => {
    setShowDetail(false);
    setFlightDetail([]);
    setTabsFlightDetail([]);
  }, []);

  useEffect(() => {
    if (isRoundTrip) {
      if (selectedDepartFlight && selectedReturnFlight) return;
    } else if (selectedDepartFlight) return;

    let filtered = flightsData.map((flight: any) => ({ ...flight }));

    if (filtered.length > 0) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.airlines.some(
            (airline) =>
              airline.trim().toLowerCase() ===
              flight.airLineCode.trim().toLowerCase()
          );
          return match;
        });
      }

      if (filters.stopNum.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.stopNum.some((stopNumber) => {
            const intStopNum = parseInt(stopNumber) ?? 0;
            const flightStopNum = parseInt(flight.legs) ?? 1;
            return intStopNum === flightStopNum;
          });
          return match;
        });
      }

      if (
        filters?.departureTime?.[0] !== 0 ||
        filters?.departureTime?.[1] !== 24
      ) {
        const [startHour, endHour] = filters.departureTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        filtered = filtered.filter((flight: any) => {
          const departure = parseISO(flight.departure.at);
          const departureMinutes =
            departure.getHours() * 60 + departure.getMinutes();
          return departureMinutes >= fromMinute && departureMinutes <= toMinute;
        });
      }

      if (filters?.arrivalTime?.[0] !== 0 || filters?.arrivalTime?.[1] !== 24) {
        const [startHour, endHour] = filters.arrivalTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        filtered = filtered.filter((flight: any) => {
          const arrival = parseISO(flight.arrival.at);
          const arrivalMinutes = arrival.getHours() * 60 + arrival.getMinutes();
          return arrivalMinutes >= fromMinute && arrivalMinutes <= toMinute;
        });
      }

      filtered = [...filtered].sort((a, b) => {
        if (filters.sortAirLine === "asc") {
          const nameA = a.airline?.toLowerCase() ?? "";
          const nameB = b.airline?.toLowerCase() ?? "";
          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) return nameCompare;
        }

        const priceA = a.fareOptions?.[0]?.totalPrice ?? 0;
        const priceB = b.fareOptions?.[0]?.totalPrice ?? 0;
        if (priceA !== priceB) return priceA - priceB;

        const stopNumA = a.legs ?? 0;
        const stopNumB = b.legs ?? 0;
        if (stopNumA !== stopNumB) return stopNumA - stopNumB;

        const timeA = parseISO(a.departure.at).getTime();
        const timeB = parseISO(b.departure.at).getTime();
        return timeA - timeB;
      });
    }
    if (isRoundTrip) {
      if (selectedDepartFlight && !selectedReturnFlight) {
        const arrivalTimeGo = parseISO(selectedDepartFlight.arrival.at);
        filtered = filtered.filter((flight: any) => {
          const departureTimeReturn = parseISO(flight.departure.at);
          const hoursDiff = differenceInHours(
            departureTimeReturn,
            arrivalTimeGo
          );
          return flight.flightLeg === 1 && hoursDiff >= 2;
        });
      } else if (!selectedDepartFlight && selectedReturnFlight) {
        const departureTimeReturn = parseISO(selectedReturnFlight.departure.at);
        filtered = filtered.filter((flight: any) => {
          const arrivalTimeGo = parseISO(flight.arrival.at);
          const hoursDiff = differenceInHours(
            departureTimeReturn,
            arrivalTimeGo
          );
          return flight.flightLeg === 0 && hoursDiff >= 2;
        });
      }
    }
    setFilteredFlightsData(filtered);
  }, [
    filters,
    isFullFlightResource,
    flightsData,
    selectedDepartFlight,
    selectedReturnFlight,
    isRoundTrip,
  ]);
  // Group Flights
  const groupFlights = useCallback(
    (flights: any[]) => {
      if (flights.length < 1) {
        return isRoundTrip ? { 0: [], 1: [] } : { 0: [] };
      }
      const listFlights = flights.reduce((acc, flight) => {
        const leg = flight.flightLeg;
        if (!acc[leg]) {
          acc[leg] = [];
        }
        acc[leg].push(flight);
        return acc;
      }, {} as { [key: string]: any[] });

      if (isRoundTrip && !listFlights[1]) {
        listFlights[1] = [];
      }
      return listFlights;
    },
    [isRoundTrip]
  );

  // Select Depart and Return Flight
  const buildSelection = (flight: any, fareOptionIndex: number) => {
    if (!flightSession) return null;
    return createSelectedFlight(flight, fareOptionIndex, {
      searchId: flightSession,
      tripsSource,
      paxCounts,
      resourceId: flight._resourceId,
    });
  };

  const applyDepartSelection = (flight: any, fareOptionIndex: number) => {
    const selection = buildSelection(flight, fareOptionIndex);
    if (!selection) return;
    try {
      saveSelectedFlight("depart", selection, { searchFlight: flight });
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "VJ_SEGMENT_TOKEN_REQUIRED" && isVietJetSource(flight.source)) {
        toast.error(
          "Chuyến bay chưa có mã chặng từ hệ thống. Vui lòng tìm kiếm lại hoặc chọn chuyến khác."
        );
        return;
      }
      throw err;
    }
    const legacyTrip = {
      ...selection.trip,
      ...flight,
      segments: selection.trip.segments ?? flight.segments,
      fareOptions: flight.fareOptions ?? selection.trip.fareOptions,
      selectedTicketClass: selection.fareOption,
      flightCode: flight.flightCode,
    };
    setSelectedDepartFlight(legacyTrip);
    if (isRoundTrip && !selectedReturnFlight) {
      setTimeout(() => scrollToRef(returnFlightRef), 100);
    }
  };

  const applyReturnSelection = (flight: any, fareOptionIndex: number) => {
    const selection = buildSelection(flight, fareOptionIndex);
    if (!selection) return;
    try {
      saveSelectedFlight("return", selection, { searchFlight: flight });
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      if (code === "VJ_SEGMENT_TOKEN_REQUIRED" && isVietJetSource(flight.source)) {
        toast.error(
          "Chuyến bay chưa có mã chặng từ hệ thống. Vui lòng tìm kiếm lại hoặc chọn chuyến khác."
        );
        return;
      }
      throw err;
    }
    const legacyTrip = {
      ...selection.trip,
      ...flight,
      segments: selection.trip.segments ?? flight.segments,
      fareOptions: flight.fareOptions ?? selection.trip.fareOptions,
      selectedTicketClass: selection.fareOption,
      flightCode: flight.flightCode,
    };
    setSelectedReturnFlight(legacyTrip);
    if (isRoundTrip && !selectedDepartFlight) {
      setTimeout(() => scrollToRef(departFlightRef), 100);
    }
  };

  const runSelectionWithDraftGate = (
    leg: FlightSelectionLeg,
    flight: any,
    fareOptionIndex: number,
    isDeselect: boolean,
    applyFn: () => void
  ) => {
    if (isDeselect) {
      applyFn();
      notifyDraftChange();
      return;
    }

    const newLegFp = buildLegSelectionFingerprint(
      flight as Record<string, unknown>,
      fareOptionIndex,
      leg
    );
    const action = evaluateFlightSelectionChange({
      searchRoute,
      leg,
      newLegFingerprint: newLegFp,
      isDeselect: false,
    });

    if (action.type === "block_pending_payment") {
      toast.error(
        action.orderCode
          ? `Đơn ${action.orderCode} đang chờ thanh toán. Vui lòng hoàn tất hoặc hủy đơn trước khi chọn chuyến khác.`
          : "Đơn đang chờ thanh toán. Vui lòng hoàn tất thanh toán trước."
      );
      return;
    }

    if (action.type === "confirm_replace") {
      pendingSelectRef.current = () => {
        replaceDraftLegSelection({
          searchRoute,
          leg,
          newLegFingerprint: newLegFp,
          fromLabel: from ?? undefined,
          toLabel: to ?? undefined,
        });
        applyFn();
        toast.success("Đã chuyển sang chuyến mới");
        notifyDraftChange();
      };
      setReplaceDialogMessage(action.message);
      setReplaceDialogOpen(true);
      return;
    }

    if (action.type === "auto_replaced") {
      replaceDraftLegSelection({
        searchRoute,
        leg,
        newLegFingerprint: newLegFp,
        fromLabel: from ?? undefined,
        toLabel: to ?? undefined,
      });
      toast.success("Đã chuyển sang chuyến mới", { duration: 2500 });
    }

    applyFn();
    notifyDraftChange();
  };

  const handleSelectDepartFlight = (flight: any, fareOptionIndex: number) => {
    const isDeselect = selectedDepartFlight?.flightCode === flight.flightCode;
    runSelectionWithDraftGate(
      "depart",
      flight,
      fareOptionIndex,
      isDeselect,
      () => {
        if (isDeselect) {
          setSelectedDepartFlight(null);
        } else {
          applyDepartSelection(flight, fareOptionIndex);
        }
      }
    );
  };

  const handleSelectReturnFlight = (flight: any, fareOptionIndex: number) => {
    const isDeselect = selectedReturnFlight?.flightCode === flight.flightCode;
    runSelectionWithDraftGate(
      "return",
      flight,
      fareOptionIndex,
      isDeselect,
      () => {
        if (isDeselect) {
          setSelectedReturnFlight(null);
        } else {
          applyReturnSelection(flight, fareOptionIndex);
        }
      }
    );
  };

  const handleConfirmReplaceDraft = () => {
    setReplaceDialogOpen(false);
    pendingSelectRef.current?.();
    pendingSelectRef.current = null;
  };

  const handleCancelReplaceDraft = () => {
    setReplaceDialogOpen(false);
    pendingSelectRef.current = null;
  };

  useEffect(() => {
    if (isRoundTrip) {
      if (selectedDepartFlight && selectedReturnFlight) {
        setIsCheckOut(true);
      }
    } else if (selectedDepartFlight) {
      setIsCheckOut(true);
    }
  }, [isRoundTrip, selectedReturnFlight, selectedDepartFlight]);

  const handleCheckout = useCallback(async () => {
    const selections = loadSelectedFlightsForBooking();
    if (!selections.length) return;

    try {
      setIsVerifying(true);
      setVerifyError(null);

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
        const errDisplay = formatFlightBookingError(payload, language as "vi" | "en");
        setVerifyError(errDisplay.message || "Hạng vé hoặc chuyến bay bạn chọn hiện không còn khả dụng trên hệ thống hãng bay.");
        return;
      }

      // Save confirm result so Passenger Details page doesn't verify again
      const confirmResult = respon?.payload?.data ?? respon?.payload;
      handleSessionStorage("save", "flightConfirmPrice", {
        confirm: confirmResult,
        bookingDraft: null,
      });

      const res = await fetch("/api/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightType: "NORMAL",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = "/ve-may-bay/thong-tin-hanh-khach";
      }
    } catch (err: any) {
      const payload = err instanceof HttpError ? err.payload : err?.payload ?? err;
      const errDisplay = formatFlightBookingError(payload, language as "vi" | "en");
      setVerifyError(errDisplay.message || "Hệ thống gặp sự cố khi xác thực giá vé từ hãng bay.");
    } finally {
      setIsVerifying(false);
    }
  }, [language]);


  useEffect(() => {
    if (isCheckOut && typeof window !== "undefined") {
      if (!selectedReturnFlight) {
        handleSessionStorage("remove", "returnFlight");
        handleSessionStorage("remove", "selectedFlightReturn");
      }
      if (flightSession) {
        handleSessionStorage("save", "flightSession", flightSession);
      }
      if (flightType) {
        handleSessionStorage("save", "flightType", flightType);
      }
      const selectionFingerprint = buildCombinedSelectionFingerprint({
        depart: selectedDepartFlight
          ? {
              flight: selectedDepartFlight,
              fareOptionIndex: getFareIndexFromFlight(selectedDepartFlight),
            }
          : null,
        return: selectedReturnFlight
          ? {
              flight: selectedReturnFlight,
              fareOptionIndex: getFareIndexFromFlight(selectedReturnFlight),
            }
          : null,
      });
      saveFlightDraftMetaForSearch({
        startPoint: StartPoint ?? "",
        endPoint: EndPoint ?? "",
        tripType: isRoundTrip ? "roundTrip" : "oneWay",
        departDate: departDate ?? "",
        returnDate: isRoundTrip ? (returnDate ?? departDate ?? "") : (departDate ?? ""),
        fromLabel: from ?? undefined,
        toLabel: to ?? undefined,
        stage: "selecting",
        resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
        selectionFingerprint,
      });
      handleCheckout();
    }
  }, [
    router,
    isCheckOut,
    selectedDepartFlight,
    selectedReturnFlight,
    flightType,
    flightSession,
    handleCheckout,
    StartPoint,
    EndPoint,
    departDate,
    returnDate,
    from,
    to,
    isRoundTrip,
  ]);

  const flightsGroup: any = useMemo(
    () => groupFlights(filteredFlightsData),
    [filteredFlightsData, groupFlights]
  );
  const rawDepartFlightsData = useMemo(
    () => flightsGroup[0] ?? [],
    [flightsGroup]
  );
  const rawReturnFlightsData = useMemo(
    () => flightsGroup[1] ?? [],
    [flightsGroup]
  );
  let departFlightsData = rawDepartFlightsData;
  let returnFlightsData = rawReturnFlightsData;
  if (selectedDepartFlight) departFlightsData = [selectedDepartFlight];
  if (selectedReturnFlight) returnFlightsData = [selectedReturnFlight];

  const cheapestDepartPrice = useMemo(
    () =>
      getCheapestComparablePrice(rawDepartFlightsData, (flight: any) =>
        getDomesticDisplayedPrice(flight, filters.priceWithoutTax)
      ),
    [rawDepartFlightsData, filters.priceWithoutTax]
  );

  const cheapestReturnPrice = useMemo(
    () =>
      getCheapestComparablePrice(rawReturnFlightsData, (flight: any) =>
        getDomesticDisplayedPrice(flight, filters.priceWithoutTax)
      ),
    [rawReturnFlightsData, filters.priceWithoutTax]
  );

  // Load more depart flights
  const visibleDepartData = departFlightsData.slice(0, departLimit);
  const loadMoreDepartRef = useRef<HTMLDivElement | null>(null);
  const timeoutDepartId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loadMoreDepartRef.current || departLimit >= departFlightsData.length)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutDepartId.current = setTimeout(() => {
            setDepartLimit((prev) =>
              Math.min(prev + INITIAL_LIMIT, departFlightsData.length)
            );
            timeoutDepartId.current = null;
          }, 200);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreDepartRef.current);

    return () => {
      observer.disconnect();
      if (timeoutDepartId.current) clearTimeout(timeoutDepartId.current);
    };
  }, [departLimit, departFlightsData.length]);

  // Load more return flights
  const visibleReturnData = returnFlightsData.slice(0, returnLimit);
  const loadMoreReturnRef = useRef<HTMLDivElement | null>(null);
  const timeoutReturnId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!loadMoreReturnRef.current || returnLimit >= returnFlightsData.length)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutReturnId.current = setTimeout(() => {
            setReturnLimit((prev) =>
              Math.min(prev + INITIAL_LIMIT, returnFlightsData.length)
            );
            timeoutReturnId.current = null;
          }, 200);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreReturnRef.current);

    return () => {
      observer.disconnect();
      if (timeoutReturnId.current) clearTimeout(timeoutReturnId.current);
    };
  }, [returnLimit, returnFlightsData.length]);

  const cheapestDepartIndex = useMemo(() => {
    if (cheapestDepartPrice == null) return -1;
    return visibleDepartData.findIndex(
      (item: any) =>
        getDomesticDisplayedPrice(item, filters.priceWithoutTax) ===
        cheapestDepartPrice
    );
  }, [visibleDepartData, cheapestDepartPrice, filters.priceWithoutTax]);

  const cheapestReturnIndex = useMemo(() => {
    if (cheapestReturnPrice == null) return -1;
    return visibleReturnData.findIndex(
      (item: any) =>
        getDomesticDisplayedPrice(item, filters.priceWithoutTax) ===
        cheapestReturnPrice
    );
  }, [visibleReturnData, cheapestReturnPrice, filters.priceWithoutTax]);

  return (
    <Fragment>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mt-6 pb-12">
        <SideBarFilterFlights
          flightStopNum={flightStopNum}
          setFilters={setFilters}
          filters={filters}
          handleCheckboxChange={handleCheckboxChange}
          airlineData={airlineData}
          resetFilters={resetFilters}
          t={t}
        />
        <div className="xl:col-span-9" data-aos="fade">
          <div className="max-w-5xl mx-auto">
            <div>
              <div ref={departFlightRef}>
                <div
                  className="flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                  style={{
                    background:
                      " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                  }}
                >
                  <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                    <Image
                      src="/icon/AirplaneTilt.svg"
                      width={20}
                      height={20}
                      alt="Máy bay"
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{`${from} - ${to} `}</h3>
                    <p className="text-sm">
                      {totalPassengers} Khách -{" "}
                      {departDate
                        ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                        : ""}
                    </p>
                  </div>
                </div>
                {/* Tabs day */}
                <div className="grid grid-cols-7 items-center bg-white rounded-b-2xl">
                  {departDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        !day.disabled && handleClickDate(day.date, 0)
                      }
                      className={`flex flex-col items-center p-3  border-r border-gray-200 last:border-r-0 ${isSameDay(day.date, currentDate)
                        ? "border-b-2 border-b-primary text-primary"
                        : "text-gray-700"
                        } ${day.disabled
                          ? "text-gray-700 opacity-50 cursor-not-allowed"
                          : "text-black"
                        }`}
                    >
                      <div
                        className="text-sm md:text-base font-semibold"
                        data-translate
                      >
                        {day.label}
                      </div>
                      <div className="text-xs md:text-sm mt-2">
                        {format(day.date, "dd/MM")}
                      </div>
                    </button>
                  ))}
                </div>
                {visibleDepartData.length > 0 ? (
                  <div className="mt-6">
                    {visibleDepartData.map((item: any, index: number) => (
                      <div key={index}>
                        <FlightDomesticDetail
                          FareData={item}
                          onSelectFlight={handleSelectDepartFlight}
                          selectedFlight={selectedDepartFlight}
                          setFlightDetail={handleShowPopupFlightDetail}
                          filters={filters}
                          isCheapest={index === cheapestDepartIndex}
                          totalPassengers={totalPassengers}
                          translatedStaticText={translatedStaticText}
                        />
                      </div>
                    ))}
                    {departLimit < departFlightsData.length && (
                      <div
                        ref={loadMoreDepartRef}
                        className="mt-4 h-10 text-center inline-flex justify-center items-center w-full gap-3"
                      >
                        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                        {/* <span className="text-18">
                          {t("dang_tai_them_chuyen_bay")}...
                        </span> */}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full my-12 text-center text-2xl font-semibold">
                    <p>{t("khong_co_chuyen_bay_nao_trong_ngay_hom_nay")}</p>
                    <p className="mt-1">
                      {t(
                        "quy_khach_vui_long_chuyen_sang_ngay_khac_de_dat_ve_xin_cam_on"
                      )}
                    </p>
                  </div>
                )}
              </div>
              {isRoundTrip && (
                <div ref={returnFlightRef} className="mt-8">
                  <div
                    className="flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                    style={{
                      background:
                        " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  >
                    <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                      <Image
                        src="/icon/AirplaneTilt.svg"
                        width={20}
                        height={20}
                        alt="Máy bay"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{`${to} - ${from} `}</h3>
                      <p className="text-sm">
                        {totalPassengers} {t("khach")} -{" "}
                        {returnDate
                          ? pareseDateFromString(
                            returnDate,
                            "ddMMyyyy",
                            "dd/MM"
                          )
                          : ""}
                      </p>
                    </div>
                  </div>
                  {/* Tabs day */}
                  <div className="grid grid-cols-7 items-center bg-white px-3 rounded-b-2xl">
                    {returnDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          !day.disabled && handleClickDate(day.date, 1)
                        }
                        className={`flex flex-col items-center p-3  border-r border-gray-200 last:border-r-0 ${isSameDay(day.date, currentReturnDay)
                          ? "border-b-2 border-b-primary text-primary"
                          : "text-gray-700"
                          } ${day.disabled
                            ? "text-gray-700 opacity-50 cursor-not-allowed"
                            : "text-black"
                          }`}
                      >
                        <div className="text-sm md:text-base font-semibold">
                          {day.label}
                        </div>
                        <div className="text-xs md:text-sm mt-2">
                          {format(day.date, "dd/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                  {visibleReturnData.length > 0 ? (
                    <div className="my-6">
                      {visibleReturnData.map((item: any, index: number) => (
                        <div key={index}>
                          <FlightDomesticDetail
                            FareData={item}
                            onSelectFlight={handleSelectReturnFlight}
                            selectedFlight={selectedReturnFlight}
                            setFlightDetail={handleShowPopupFlightDetail}
                            filters={filters}
                            isCheapest={index === cheapestReturnIndex}
                            totalPassengers={totalPassengers}
                            translatedStaticText={translatedStaticText}
                          />
                        </div>
                      ))}
                      {returnLimit < returnFlightsData.length && (
                        <div
                          ref={loadMoreReturnRef}
                          className="mt-4 h-10 text-center inline-flex justify-center items-center w-full gap-3"
                        >
                          <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                          {/* <span className="text-18">
                            {t("dang_tai_them_chuyen_bay")}...
                          </span> */}
                        </div>
                      )}
                    </div>
                  ) : (
                    isFullFlightResource && (
                      <div className="w-full mt-12 text-center text-2xl font-semibold">
                        <p>{t("khong_co_chuyen_bay_nao_trong_ngay_hom_nay")}</p>
                        <p className="mt-1">
                          {t(
                            "quy_khach_vui_long_chuyen_sang_ngay_khac_de_dat_ve_xin_cam_on"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          <SignUpReceiveCheapTickets />
        </div>
        <FlightDetailPopup
          airports={airportsData}
          tabs={tabsFlightDetail}
          flights={flightDetail}
          isOpen={showDetail}
          onClose={handleClosePopupFlightDetail}
          isLoadingFareRules={isLoadingFareRules}
        />
        <ReplaceFlightDraftDialog
          open={replaceDialogOpen}
          message={replaceDialogMessage}
          onCancel={handleCancelReplaceDraft}
          onConfirm={handleConfirmReplaceDraft}
        />
        <VerifyFlightPriceDialog
          open={isVerifying || verifyError !== null}
          loading={isVerifying}
          error={verifyError}
          language={language}
          onClose={() => setVerifyError(null)}
        />
      </div>
    </Fragment>
  );
}
