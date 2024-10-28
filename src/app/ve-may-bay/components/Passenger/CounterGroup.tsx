// components/CounterGroup.tsx
"use client";

import { useState, useEffect } from "react";

interface Counter {
  label: string;
  key: string;
  ageRange: string;
  value: number;
}

interface CounterGroupProps {
  formData: {
    from: string | null;
    to: string | null;
    departureDate: Date | null;
    Adt: number;
    Chd: number;
    Inf: number;
  };
  totalGuests: number;
  onGuestsChange: (key: string, value: number) => void;
}

const CounterGroup: React.FC<CounterGroupProps> = ({
  formData,
  totalGuests,
  onGuestsChange,
}) => {
  const counters = [
    {
      label: "Người lớn",
      key: "Adt",
      ageRange: "> 12 tuổi",
      value: formData.Adt,
    },
    { label: "Trẻ em", key: "Chd", ageRange: "2-12 tuổi", value: formData.Chd },
    { label: "Em bé", key: "Inf", ageRange: "< 2 tuổi", value: formData.Inf },
  ];

  const handleIncrement = (key: string, value: number) => {
    if (totalGuests < 9) {
      onGuestsChange(key, value + 1);
    }
  };

  const handleDecrement = (key: string, value: number) => {
    if (value > 0) {
      onGuestsChange(key, value - 1);
    }
  };

  return (
    <div>
      {counters.map((counter, index) => (
        <div key={index} className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium">{counter.label}</div>
            <div className="text-sm text-gray-500">{counter.ageRange}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrement(counter.key, counter.value)}
              className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${
                (counter.key == "Adt" && counter.value <= 1) ||
                counter.value === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={
                (counter.key === "Adt" && counter.value <= 1) ||
                counter.value === 0
              }
            >
              -
            </button>
            <span className="text-lg font-semibold">{counter.value}</span>
            <button
              onClick={() => handleIncrement(counter.key, counter.value)}
              className={`w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center ${
                totalGuests >= 9 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={totalGuests >= 9}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterGroup;
