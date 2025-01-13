// components/CounterGroup.tsx
"use client";
import { toast } from "react-hot-toast";

interface CounterGroupProps {
  formData: {
    adt: number;
    chd: number;
    inf: number;
    room: number;
  };
  totalGuests: number;
  totalRooms: number;
  onRoomsChange: (key: string, value: number) => void;
  onGuestsChange: (key: string, value: number) => void;
}

const CounterGroup: React.FC<CounterGroupProps> = ({
  formData,
  totalGuests,
  totalRooms,
  onRoomsChange,
  onGuestsChange,
}) => {
  const counters = [
    {
      label: "Người lớn",
      key: "adt",
      ageRange: "> 12 tuổi",
      value: formData.adt,
    },
    { label: "Trẻ em", key: "chd", ageRange: "2-12 tuổi", value: formData.chd },
    { label: "Em bé", key: "inf", ageRange: "< 2 tuổi", value: formData.inf },
  ];
  let activeToastId: string | null = null;

  const showToast = (message: string) => {
    if (activeToastId) {
      toast.dismiss(activeToastId);
    }

    activeToastId = toast(message, {
      id: "hotel-unique-toast",
      duration: 2000,
      className: "text-center leading-6",
      style: {
        marginTop: "160px",
        maxWidth: "550px",
      },
    });

    setTimeout(() => {
      activeToastId = null;
    }, 2000);
  };
  const handleIncrement = (key: string, value: number) => {
    if (key === "room" && totalRooms >= formData.adt) {
      showToast("Số phòng không thể nhiều hơn số khách người lớn");
    } else {
      if (totalGuests < 30) {
        onGuestsChange(key, value + 1);
      }
      if (totalRooms < formData.adt) {
        onRoomsChange(key, value + 1);
      }
    }
  };

  const handleDecrement = (key: string, value: number) => {
    if (key === "adt" && formData.adt <= totalRooms) {
      showToast("Số phòng không thể nhiều hơn số khách người lớn");
    } else {
      if (value > 0) {
        onGuestsChange(key, value - 1);
      }
      if (totalRooms > 1) {
        onRoomsChange(key, value - 1);
      }
    }
  };

  return (
    <div>
      {counters.map((counter, index) => (
        <div key={index} className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium">{counter.label}</div>
            <div className="text-sm text-gray-500">
              {counter.ageRange ?? ""}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleDecrement(counter.key, counter.value)}
              className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${
                (counter.key == "adt" && counter.value <= 1) ||
                counter.value === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={
                (counter.key === "adt" && counter.value <= 1) ||
                counter.value === 0
              }
            >
              -
            </button>
            <span className="text-lg font-semibold w-7 text-center">
              {" "}
              {counter.value}
            </span>
            <button
              type="button"
              onClick={() => handleIncrement(counter.key, counter.value)}
              className={`w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center ${
                totalGuests >= 30 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={totalGuests >= 30}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-medium">Phòng</div>
          <div className="text-sm text-gray-500"></div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleDecrement("room", totalRooms)}
            className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${
              totalRooms <= 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={totalRooms <= 1}
          >
            -
          </button>
          <span className="text-lg font-semibold w-7 text-center">
            {totalRooms}
          </span>
          <button
            type="button"
            onClick={() => handleIncrement("room", totalRooms)}
            className={`w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center ${
              totalRooms >= formData.adt ? " opacity-50" : ""
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounterGroup;
