import React from "react";

const Tabs: React.FC = () => {
  const days = [
    { label: "Thứ 2", date: "26/08" },
    { label: "Thứ 3", date: "27/08" },
    { label: "Thứ 4", date: "28/08", active: true },
    { label: "Thứ 5", date: "29/08" },
    { label: "Thứ 6", date: "30/08" },
    { label: "Thứ 7", date: "31/08" },
    { label: "Chủ nhật", date: "01/09" },
  ];

  return (
    <div className="grid grid-cols-7 items-center bg-white px-3 rounded-b-2xl">
      {days.map((day, index) => (
        <div
          key={index}
          className={`flex flex-col items-center p-3 cursor-pointer border-r border-gray-200 last:border-r-0 ${
            day.active
              ? "border-b-2 border-b-primary text-primary"
              : "text-gray-700"
          }`}
        >
          <span className="font-semibold">{day.label}</span>
          <span className="text-sm mt-2">{day.date}</span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
