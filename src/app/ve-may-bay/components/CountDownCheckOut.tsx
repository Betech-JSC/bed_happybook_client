"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function CountDownCheckOut({
  timeCountDown,
  handleTicketPaymentTimeout,
}: {
  timeCountDown: Date;
  handleTicketPaymentTimeout: () => void;
}) {
  const calculateTimeLeft = useCallback(
    (targetTime: Date) => {
      const difference = +targetTime - +new Date();
      let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / 1000 / 60 / 60) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        handleTicketPaymentTimeout();
      }
      return timeLeft;
    },
    [handleTicketPaymentTimeout]
  );

  const [targetTime] = useState(new Date(timeCountDown));
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  useEffect(() => {
    const timerCheckOut = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    return () => clearInterval(timerCheckOut);
  }, [targetTime, calculateTimeLeft]);

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
