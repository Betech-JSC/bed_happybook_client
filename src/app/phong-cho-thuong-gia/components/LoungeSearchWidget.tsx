"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { PlaneTakeoff, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { translateText } from "@/utils/translateApi";
import Image from "next/image";

type AirportOpt = { label: string; value: string };

function GuestRow({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold leading-none flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="−"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={btn}
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label="+"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={btn}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function LoungeSearchWidget() {
  const router = useRouter();
  const { language } = useLanguage();
  const { t, lang } = useTranslation();
  const today = new Date();

  const [airports, setAirports] = useState<AirportOpt[]>([]);
  const [airport, setAirport] = useState<AirportOpt | null>(null);
  const [date, setDate] = useState<Date | null>(today);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestOpen, setGuestOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const guestRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    ProductBusinessLoungeApi.getOptionsFilter()
      .then(async (res) => {
        const groups: any[] = res?.payload?.data ?? [];
        const g = groups.find((x) => x.name === "airport");
        if (!g) return;
        const raw = (g.option || []).map((o: any) => ({
          name: o.label || o.value,
          value: o.value,
          count: o.count,
        }));
        // Dịch tên sân bay sang EN ngay khi build options: react-select render
        // option trong portal nên translatePage/data-translate không quét được.
        let names: string[] = raw.map((r: any) => r.name);
        if (lang === "en" && names.length) {
          try {
            const translated = await translateText(names, "en");
            if (translated?.length === names.length) names = translated;
          } catch {}
        }
        if (cancelled) return;
        const unit = lang === "en" ? "lounges" : "phòng";
        setAirports(
          raw.map((r: any, i: number) => ({
            label: `${names[i]}${r.count ? ` · ${r.count} ${unit}` : ""}`,
            value: r.value,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // đóng popover số khách khi click ra ngoài
  useEffect(() => {
    if (!guestOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [guestOpen]);

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (airport) p.append("airport[]", airport.value);
    if (date) p.set("departDate", format(date, "yyyy-MM-dd"));
    p.set("adults", String(adults));
    if (children > 0) p.set("children", String(children));
    router.push(`/phong-cho-thuong-gia${p.toString() ? "?" + p.toString() : ""}`);
  };

  if (!mounted) return null;

  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const fieldCls =
    "flex h-12 items-center gap-2.5 border border-gray-200 rounded-xl px-3 bg-white focus-within:border-[#F27145] transition-colors";

  const guestSummary = `${adults} ${t("nguoi_lon")}${
    children > 0 ? `, ${children} ${t("tre_em")}` : ""
  }`;

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-end mt-2">
      {/* Sân bay */}
      <div className="w-full lg:flex-1 min-w-0">
        <label className={labelCls}>{t("san_bay_khoi_hanh")}</label>
        <div className={fieldCls}>
          <Image
            src="/icon/waiting-room-icon.svg"
            alt="Lounge"
            width={16}
            height={16}
            className="w-4 h-4 shrink-0 opacity-40"
          />
          <Select
            options={airports}
            value={airport}
            onChange={(opt) => setAirport(opt)}
            placeholder={t("tim_hoac_chon_san_bay")}
            isSearchable
            className="w-full min-w-0 text-sm"
            classNamePrefix="lsw"
            noOptionsMessage={() => t("khong_tim_thay_san_bay")}
            formatOptionLabel={(o: any) => {
              const parts = o.label.split(" · ");
              const airportName = parts[0];
              const countPart = parts[1] || "";
              return (
                <span className="flex items-center justify-between w-full">
                  <span>{airportName}</span>
                  {countPart && (
                    <span className="text-gray-400 text-xs ml-2 shrink-0">
                      {` · ${countPart}`}
                    </span>
                  )}
                </span>
              );
            }}
            styles={{
              container: (b) => ({ ...b, minWidth: 0 }),
              control: (b) => ({
                ...b,
                border: "none",
                boxShadow: "none",
                background: "transparent",
                minHeight: "unset",
                minWidth: 0,
                flexWrap: "nowrap",
                cursor: "pointer",
              }),
              valueContainer: (b) => ({
                ...b,
                flexWrap: "nowrap",
                overflow: "hidden",
                padding: 0,
              }),
              singleValue: (b) => ({
                ...b,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }),
              indicatorsContainer: () => ({ display: "none" }),
              menu: (b) => ({ ...b, zIndex: 50 }),
              option: (b, state) => ({
                ...b,
                fontSize: "13px",
                backgroundColor: state.isFocused ? "#fff7f5" : "white",
                color: "#111827",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      {/* Ngày */}
      <div className="w-full lg:w-44 shrink-0">
        <label className={labelCls}>{t("ngay_den_san_bay")}</label>
        <div className={fieldCls}>
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="dd/MM/yyyy"
            minDate={today}
            locale={language === "vi" ? vi : enUS}
            placeholderText={t("chon_ngay")}
            onFocus={(e) => e.target.blur()}
            onKeyDown={(e) => e.preventDefault()}
            className="w-full outline-none text-sm bg-transparent cursor-pointer"
          />
        </div>
      </div>

      {/* Số khách */}
      <div className="w-full lg:w-52 shrink-0 relative" ref={guestRef}>
        <label className={labelCls}>{t("so_khach")}</label>
        <button
          type="button"
          onClick={() => setGuestOpen((o) => !o)}
          className={`${fieldCls} w-full justify-between`}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Users className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm font-medium truncate">{guestSummary}</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
              guestOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {guestOpen && (
          <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-4">
            <GuestRow
              label={t("nguoi_lon")}
              value={adults}
              min={1}
              max={20}
              onChange={setAdults}
            />
            <GuestRow
              label={t("tre_em")}
              value={children}
              min={0}
              max={20}
              onChange={setChildren}
            />
          </div>
        )}
      </div>

      {/* Button */}
      <div className="w-full lg:w-auto shrink-0">
        <label className="block mb-1 h-5" aria-hidden />
        <button
          type="button"
          onClick={handleSearch}
          className="w-full lg:w-auto h-12 px-6 bg-[#F27145] hover:bg-[#d95f30] active:scale-95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Search className="w-4 h-4 shrink-0" />
          {t("tim_phong_cho")}
        </button>
      </div>
    </div>
  );
}
