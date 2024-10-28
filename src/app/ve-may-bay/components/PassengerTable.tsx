import { PassengerType } from "@/types/flight";
import React from "react";
interface Props {
  passengers: PassengerType[];
}
export default function PassengerTable({ passengers }: Props) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-[#FEF8F5]">
            <th className="border-b border-r text-primary text-left font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
              Hành khách
            </th>
            <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
              Số người
            </th>
            <th className="border-b border-r text-primary text-right font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
              Giá vé
            </th>
            <th className="border-b border-r text-primary text-right font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
              Tổng giá vé
            </th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                {passenger.title}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-center">
                {passenger.quantity}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-right">
                {passenger.price.toLocaleString("vi-VN")} {passenger.currency}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-right">
                {passenger.totalPrice.toLocaleString("vi-VN")}{" "}
                {passenger.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
