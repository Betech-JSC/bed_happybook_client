// components/SelectMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import CounterGroup from "./CounterGroup";
interface SelectMenuProps {
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
const SelectMenu = ({
  formData,
  totalGuests,
  onGuestsChange,
}: SelectMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative w-full">
      <div
        onClick={toggleMenu}
        className="p-3 rounded-md flex items-center gap-2 cursor-pointer"
      >
        <span>{totalGuests} </span>
        <span data-translate> hành khách</span>
      </div>

      <div
        className={`absolute top-14 left-[-10%] md:left-0 z-10 w-64 md:w-80 p-4 rounded-lg shadow-md bg-white ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <CounterGroup
          formData={formData}
          totalGuests={totalGuests}
          onGuestsChange={onGuestsChange}
        />
      </div>
    </div>
  );
};

export default SelectMenu;
