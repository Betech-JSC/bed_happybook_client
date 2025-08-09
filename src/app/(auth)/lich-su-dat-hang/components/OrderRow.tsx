"use client";
import { ReactNode } from "react";

export default function OrderRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 items-center odd:bg-gray-50 border-gray-200 border text-sm md:text-base">
      <div className="h-full content-center col-span-4 md:col-span-3 py-2 px-3 md:px-4 md:py-4 font-semibold text-gray-800 border-r border-gray-300">
        {label}
      </div>
      <div className="col-span-8 md:col-span-9 py-2 px-3 md:px-4 md:py-4 md:pl-6 text-gray-800">
        {value}
      </div>
    </div>
  );
}
