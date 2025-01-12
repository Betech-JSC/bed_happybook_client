// components/CounterGroup.tsx
"use client";

interface CounterGroupProps {
  formData: {
    adt: number;
    chd: number;
    inf: number;
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
      key: "adt",
      ageRange: "> 12 tuổi",
      value: formData.adt,
    },
    { label: "Trẻ em", key: "chd", ageRange: "2-12 tuổi", value: formData.chd },
    { label: "Em bé", key: "inf", ageRange: "< 2 tuổi", value: formData.inf },
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
