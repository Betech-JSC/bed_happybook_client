"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CountDownCheckOut({
  timeCountDown,
  handleTicketPaymentTimeout,
}: {
  timeCountDown: Date | string;
  handleTicketPaymentTimeout: () => void;
}) {
  const expiredNotifiedRef = useRef(false);

  const calculateTimeLeft = useCallback((targetTime: Date) => {
    const difference = +targetTime - +new Date();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true as const };
    }
    return {
      hours: Math.floor((difference / 1000 / 60 / 60) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false as const,
    };
  }, []);

  const [targetTime] = useState(() => new Date(timeCountDown));
  const [timeLeft, setTimeLeft] = useState(() => {
    const next = calculateTimeLeft(new Date(timeCountDown));
    return {
      hours: next.hours,
      minutes: next.minutes,
      seconds: next.seconds,
    };
  });

  useEffect(() => {
    const tick = () => {
      const next = calculateTimeLeft(targetTime);
      setTimeLeft({
        hours: next.hours,
        minutes: next.minutes,
        seconds: next.seconds,
      });
      if (next.expired && !expiredNotifiedRef.current) {
        expiredNotifiedRef.current = true;
        handleTicketPaymentTimeout();
      }
    };

    tick();
    const timerCheckOut = setInterval(tick, 1000);
    return () => clearInterval(timerCheckOut);
  }, [targetTime, calculateTimeLeft, handleTicketPaymentTimeout]);

  return (
    <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
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
        className="w-5 h-5"
      />
    </div>
  );
}
