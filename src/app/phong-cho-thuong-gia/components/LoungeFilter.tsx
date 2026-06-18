"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export type FilterOption = { value: string; label: string; count?: number };
export type FilterGroup = { name: string; label: string; option: FilterOption[] };

const LIMIT = 6;

function GroupIcon({ name }: { name: string }) {
  const cls = "w-[15px] h-[15px] text-gray-500 shrink-0";
  if (name === "country")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    );
  if (name === "city")
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.5 4.2-2.4 2.4-2-.5-1 1 3 1.8 1.8 3 1-1-.5-2 2.4-2.4 4.2 3.5a.5.5 0 0 0 .8-.5z" />
    </svg>
  );
}

function FilterGroupView({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [mini, setMini] = useState("");
  const [expand, setExpand] = useState(false);

  const norm = (s: string) => (s || "").toLowerCase();
  let opts = group.option || [];
  if (mini.trim()) opts = opts.filter((o) => norm(o.label).includes(norm(mini.trim())));
  // Đưa mục ĐÃ CHỌN lên đầu để luôn nhìn thấy (pre-fill từ widget trang chủ: sân bay
  // được chọn có thể nằm dưới fold LIMIT trong danh sách dài 600+ mục). sort ổn định.
  const ordered = [...opts].sort(
    (a, b) =>
      (selected.includes(b.value) ? 1 : 0) - (selected.includes(a.value) ? 1 : 0)
  );
  const shown = expand ? ordered : ordered.slice(0, LIMIT);

  const groupLabel =
    group.name === "country"
      ? t("quoc_gia")
      : group.name === "city"
      ? t("thanh_pho")
      : group.name === "airport"
      ? t("san_bay")
      : group.label;

  return (
    <div className="border-t border-gray-100 first:border-t-0 px-4 py-3.5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-gray-800 mb-2.5">
        <GroupIcon name={group.name} />
        {/* groupLabel đã được t() bản địa hoá — KHÔNG gắn data-translate để
            translatePage không dịch chồng (vd "Country" -> "chicken"). */}
        <span>{groupLabel}</span>
      </div>

      {/* mini-search trong nhóm */}
      <div className="relative mb-2.5">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={mini}
          onChange={(e) => setMini(e.target.value)}
          placeholder={`${t("tim_kiem")} ${groupLabel.toLowerCase()}…`}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-2.5 text-[13px] outline-none focus:border-primary focus:bg-white"
        />
      </div>

      <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto -mx-1.5 px-1.5">
        {shown.length === 0 && <div className="text-[12.5px] text-gray-400 px-1.5 py-1.5">{t("khong_tim_thay")}</div>}
        {shown.map((o) => {
          const checked = selected.includes(o.value);
          return (
            <label
              key={o.value}
              className={`flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 cursor-pointer text-[13.5px] hover:bg-gray-50 ${checked ? "text-gray-900" : "text-gray-600"}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(o.value)}
                className="w-4 h-4 shrink-0 accent-[#F27145] cursor-pointer"
              />
              <span className="flex-1 text-gray-800" data-translate="true">{o.label}</span>
              {typeof o.count === "number" && <span className="text-[12.5px] text-gray-400">{o.count}</span>}
            </label>
          );
        })}
      </div>

      {opts.length > LIMIT && (
        <button
          onClick={() => setExpand((v) => !v)}
          className="flex items-center gap-1.5 text-[13px] text-blue-600 hover:underline pt-2 px-1.5"
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${expand ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expand ? t("thu_gon") : `${t("xem_them")} (${opts.length - LIMIT})`}
        </button>
      )}
    </div>
  );
}

export default function LoungeFilter({
  groups,
  selected,
  onToggle,
  onClear,
}: {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onToggle: (group: string, value: string) => void;
  onClear: () => void;
}) {
  const hasAny = Object.values(selected).some((arr) => arr.length > 0);
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-[15px] font-bold">{t("bo_loc")}</h2>
        {hasAny && (
           <button onClick={onClear} className="text-[12.5px] text-blue-600 hover:underline">
            {t("xoa_tat_ca")}
          </button>
        )}
      </div>
      {groups.map((g) => (
        <FilterGroupView
          key={g.name}
          group={g}
          selected={selected[g.name] ?? []}
          onToggle={(v) => onToggle(g.name, v)}
        />
      ))}
    </div>
  );
}
