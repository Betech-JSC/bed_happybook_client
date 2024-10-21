import React from "react";

const PassengerTable: React.FC = () => {
  const passengers = [
    { type: "Người lớn", quantity: 1, price: "1,221,100 VND" },
    { type: "Trẻ em", quantity: 2, price: "1,221,100 VND" },
    { type: "Em bé", quantity: 1, price: "1,221,100 VND" },
  ];

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
                {passenger.type}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-center">
                {passenger.quantity}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-right">
                {passenger.price}
              </td>
              <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12 text-right">
                {passenger.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerTable;
