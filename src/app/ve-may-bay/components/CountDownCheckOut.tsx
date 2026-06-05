"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export default function CountDownCheckOut({
  timeCountDown,
  handleTicketPaymentTimeout,
}: {
  timeCountDown: Date | string;
  handleTicketPaymentTimeout: () => void;
}) {
  const expiredNotifiedRef = useRef(false);
  const normalizedTime = typeof timeCountDown === "string" && timeCountDown.includes(" ") && !timeCountDown.includes("T")
    ? timeCountDown.replace(" ", "T")
    : timeCountDown;
  const targetTime = typeof normalizedTime === "string" ? parseISO(normalizedTime) : normalizedTime;

  const calculateTimeLeft = useCallback((targetMs: number) => {
    const difference = targetMs - Date.now();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, expired: true as const };
    }
    return {
      // Bỏ phép chia dư % 24 để hiển thị chính xác tổng số giờ (nếu > 24 giờ)
      hours: Math.floor(difference / 1000 / 60 / 60),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      totalMs: difference,
      expired: false as const,
    };
  }, []);

  const targetTimestamp = targetTime.getTime();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTimestamp));

  useEffect(() => {
    const tick = () => {
      const next = calculateTimeLeft(targetTimestamp);
      setTimeLeft(next);
      if (next.expired && !expiredNotifiedRef.current) {
        expiredNotifiedRef.current = true;
        handleTicketPaymentTimeout();
      }
    };

    tick();
    const timerCheckOut = setInterval(tick, 1000);
    return () => clearInterval(timerCheckOut);
  }, [targetTimestamp, calculateTimeLeft, handleTicketPaymentTimeout]);

  if (timeLeft.expired) {
    return (
      <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-red-500">
        <p>Đã hết hạn thanh toán</p>
      </div>
    );
  }

  const isLongHold = timeLeft.totalMs > 30 * 60 * 1000; // Còn trên 30 phút

  if (isLongHold) {
    const formattedDeadline = format(targetTime, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
    const hoursStr = String(timeLeft.hours).padStart(2, "0");
    const minutesStr = String(timeLeft.minutes).padStart(2, "0");
    const secondsStr = String(timeLeft.seconds).padStart(2, "0");
    const remainingText = `${hoursStr}:${minutesStr}:${secondsStr}`;

    return (
      <div className="mt-3 xl:mt-0 flex flex-col sm:flex-row sm:items-center justify-center xl:justify-end gap-2 sm:gap-4 text-base md:text-lg font-medium text-white">
        <span className="opacity-95 whitespace-nowrap">
          Hạn thanh toán: <strong className="text-yellow-300 font-semibold">{formattedDeadline}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sm font-semibold text-orange-200 shadow-sm border border-white/5 w-fit mx-auto sm:mx-0">
          <Image
            src={`/icon/clock-stopwatch.svg`}
            width={14}
            height={14}
            alt="Clock"
            className="w-3.5 h-3.5 filter invert"
          />
          Còn lại {remainingText}
        </span>
      </div>
    );
  }

  // Chế độ khẩn cấp (dưới 30 phút) - Đồng hồ đếm ngược chạy từng giây, nhấp nháy đỏ/cam khẩn cấp
  return (
    <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258] animate-pulse">
      <p>
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </p>
      <Image
        src={`/icon/clock-stopwatch.svg`}
        width={20}
        height={20}
        alt="Thời gian"
        className="w-5 h-5 animate-spin"
        style={{ animationDuration: "4s" }}
      />
    </div>
  );
}
