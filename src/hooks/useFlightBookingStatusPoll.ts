"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FlightApi } from "@/api/Flight";
import type { FlightBookingOrderStatus } from "@/types/flightBooking";
import {
  BOOKING_STATUS_POLL_INTERVAL_MS,
  BOOKING_STATUS_POLL_MAX_MS,
  isFlightBookingTerminal,
  parseBookingStatusPayload,
} from "@/utils/flightBookingFlow";

export function useFlightBookingStatusPoll(
  orderCode: string | undefined,
  enabled: boolean,
  initialStatus?: FlightBookingOrderStatus
) {
  const [status, setStatus] = useState<FlightBookingOrderStatus | undefined>(
    initialStatus
  );
  const [pnrNumber, setPnrNumber] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!orderCode) return null;
    const response = await FlightApi.bookingStatus(orderCode);
    const parsed = parseBookingStatusPayload(
      response?.payload as Record<string, unknown>
    );
    if (parsed?.status) {
      setStatus(parsed.status);
    }
    if (parsed?.pnr_number) {
      setPnrNumber(parsed.pnr_number);
    }
    return parsed;
  }, [orderCode]);

  useEffect(() => {
    if (!enabled || !orderCode) {
      setIsPolling(false);
      return;
    }

    startedAtRef.current = Date.now();
    setIsPolling(true);

    const tick = async () => {
      if (
        startedAtRef.current &&
        Date.now() - startedAtRef.current > BOOKING_STATUS_POLL_MAX_MS
      ) {
        setIsPolling(false);
        return;
      }

      try {
        const parsed = await fetchStatus();
        if (parsed && isFlightBookingTerminal(parsed.status)) {
          setIsPolling(false);
        }
      } catch {
        /* keep polling until timeout */
      }
    };

    void tick();
    const interval = setInterval(tick, BOOKING_STATUS_POLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [enabled, orderCode, fetchStatus]);

  return {
    status,
    pnrNumber,
    isPolling,
    fetchStatus,
    setStatus,
    setPnrNumber,
  };
}
