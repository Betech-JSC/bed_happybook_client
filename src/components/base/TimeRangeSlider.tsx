import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Fragment, useEffect, useRef, useState } from "react";

interface TimeRangeSliderProps extends React.ComponentProps<typeof Slider> {
  defaultValue?: [number, number];
  onFinalChange?: (range: [number, number]) => void;
}

export default function TimeRangeSlider({
  defaultValue = [0, 24],
  onFinalChange,
  ...props
}: TimeRangeSliderProps) {
  const [range, setRange] = useState<[number, number]>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const finalValueRef = useRef<[number, number]>(range);
  const startPercent = (range[0] / 24) * 100;
  const endPercent = (range[1] / 24) * 100;
  const deltaHour = Math.abs(range[0] - range[1]);
  const offset = deltaHour < 6 ? 12 : 0;
  useEffect(() => {
    const handleRelease = () => {
      if (isDragging) {
        setIsDragging(false);
        onFinalChange?.(finalValueRef.current);
      }
    };

    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("touchend", handleRelease);

    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [isDragging, onFinalChange]);

  const handleChange = (val: number | number[]) => {
    const [start, end] = val as [number, number];

    if (end - start < 2) return;

    setRange([start, end]);

    finalValueRef.current = [start, end];

    if (!isDragging) setIsDragging(true);
  };

  const formatHour = (val: number) => `${val.toString().padStart(2, "0")}:00`;

  return (
    <Fragment>
      <Slider
        range
        min={0}
        max={24}
        step={1}
        value={range}
        onChange={handleChange}
        {...props}
      />
      <div className="relative mt-4">
        <div className="relative h-6">
          <div
            className="absolute text-sm -top-1"
            style={{
              left: `${startPercent}%`,
              transform: `translateX(-50%) translateX(-${offset}px)`,
            }}
          >
            {formatHour(range[0])}
          </div>
          <div
            className="absolute text-sm -top-1"
            style={{
              left: `${endPercent}%`,
              transform: `translateX(-50%) translateX(${offset}px)`,
            }}
          >
            {formatHour(range[1])}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
