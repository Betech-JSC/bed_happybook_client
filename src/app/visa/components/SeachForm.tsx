"use client";
import Image from "next/image";
import VisaStyle from "@/styles/visaService.module.scss";
import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useId,
} from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { VisaApi } from "@/api/Visa";
import { debounce } from "lodash";

type FilterOption = { value: string; label: string };
type FilterGroup = { label: string; name: string; option: FilterOption[] };

export default function SearchForm({
  optionsFilter,
}: {
  optionsFilter: FilterGroup[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [visaTypeOptions, setVisaTypeOptions] = useState<FilterOption[]>(
    optionsFilter?.[0]?.option ?? []
  );
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    FilterOption[]
  >(optionsFilter?.[1]?.option ?? []);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const initialDestinations = useMemo(
    () => optionsFilter?.[1]?.option ?? [],
    [optionsFilter]
  );

  const fetchFilteredOptions = useCallback(
    async (keyword: string) => {
      if (!keyword?.trim()) {
        setVisaTypeOptions(optionsFilter?.[0]?.option ?? []);
        setDestinationSuggestions(initialDestinations);
        return;
      }
      setIsLoadingOptions(true);
      try {
        const res = (await VisaApi.getOptionsFilter({
          text: keyword.trim(),
        })) as any;
        const data = res?.payload?.data ?? [];
        const visaTypes = data?.[0]?.option ?? [];
        const destinations = data?.[1]?.option ?? [];
        setVisaTypeOptions(visaTypes);
        setDestinationSuggestions(destinations);
      } catch {
        setVisaTypeOptions(optionsFilter?.[0]?.option ?? []);
        setDestinationSuggestions(initialDestinations);
      } finally {
        setIsLoadingOptions(false);
      }
    },
    [optionsFilter, initialDestinations]
  );

  const debouncedFetch = useMemo(
    () => debounce((keyword: string) => fetchFilteredOptions(keyword), 350),
    [fetchFilteredOptions]
  );

  useEffect(() => {
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  useEffect(() => {
    debouncedFetch(formData.text ?? "");
  }, [formData.text, debouncedFetch]);

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const selected = formData["loai_visa[]"];
    if (selected && !visaTypeOptions.some((o) => o.value === selected)) {
      setFormData((prev) => ({ ...prev, "loai_visa[]": "" }));
    }
  }, [visaTypeOptions, formData["loai_visa[]"]]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.text) params.set("text", formData.text);
    if (formData["loai_visa[]"])
      params.set("loai_visa[]", formData["loai_visa[]"]);
    router.push(`/visa/tim-kiem?${params.toString()}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "text") {
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    }
  };

  const selectSuggestion = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, text: value }));
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !showSuggestions ||
      isLoadingOptions ||
      destinationSuggestions.length === 0
    ) {
      if (e.key === "Escape") setShowSuggestions(false);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) =>
          i < destinationSuggestions.length - 1 ? i + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) =>
          i > 0 ? i - 1 : destinationSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(destinationSuggestions[highlightedIndex].value);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const hasSuggestions =
    showSuggestions && destinationSuggestions.length > 0 && !isLoadingOptions;

  return (
    <form
      className="mt-4 md:mt-6 flex flex-col md:flex-row md:space-x-2 space-y-3 items-end justify-between"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full md:w-1/2">
        <div className="absolute left-4 top-1/2 translate-y-1/4 z-10">
          <Image
            src="/icon/place.svg"
            alt="Icon"
            className="h-10"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </div>
        <label htmlFor="searchInput" className="font-medium block">
          {t("theo_dia_danh_diem_den")}
        </label>
        <input
          ref={inputRef}
          type="text"
          id="searchInput"
          value={formData.text ?? ""}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          name="text"
          placeholder={t("tim_theo_diem_den_hoat_dong")}
          className={`mt-2 w-full ${VisaStyle.input} h-12 indent-10 relative z-[1]`}
          autoComplete="off"
          role="combobox"
          aria-expanded={hasSuggestions}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${listboxId}-item-${highlightedIndex}`
              : undefined
          }
        />
        <div className="absolute left-0 right-0 top-full z-20" ref={dropdownRef}>
          {showSuggestions && (
            <ul
              id={listboxId}
              role="listbox"
              className="mt-1 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
            >
              {isLoadingOptions ? (
                <li className="px-4 py-3 text-gray-500 text-sm flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {t("dang_tai_du_lieu") || "Đang tải..."}
                </li>
              ) : destinationSuggestions.length === 0 ? (
                <li className="px-4 py-3 text-gray-500 text-sm">
                  {t("khong_tim_thay_du_lieu_phu_hop") ||
                    "Không tìm thấy gợi ý phù hợp"}
                </li>
              ) : (
                destinationSuggestions.map((opt, idx) => (
                  <li
                    key={`${opt.value}-${idx}`}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    id={`${listboxId}-item-${idx}`}
                    role="option"
                    aria-selected={highlightedIndex === idx}
                    className={`cursor-pointer px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                      highlightedIndex === idx
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => selectSuggestion(opt.value)}
                  >
                    <Image
                      src="/icon/place.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="opacity-60 flex-shrink-0"
                    />
                    {opt.label}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="w-full md:w-[30%]">
        <label htmlFor="typeVisa" className="font-medium block">
          {t("loai_visa")}
        </label>
        <div
          className="mt-2 border border-gray-300 rounded-lg h-12"
          style={{
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          }}
        >
          <select
            id="typeVisa"
            className={`px-3 py-3 w-[90%] outline-none rounded-lg h-full ${VisaStyle.select_custom}`}
            name="loai_visa[]"
            onChange={handleChange}
            value={formData["loai_visa[]"] ?? ""}
            disabled={isLoadingOptions}
          >
            <option value="" hidden>
              {isLoadingOptions ? "..." : t("chon_loai_visa")}
            </option>
            {visaTypeOptions.map((option: FilterOption, index: number) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full md:w-1/5 text-center border rounded-lg px-2 h-12 bg-primary hover:bg-orange-600 duration-300">
        <button
          type="submit"
          className="ml-1 inline-flex items-center space-x-2 h-12 text-white w-full justify-center"
        >
          <Image
            src="/icon/search.svg"
            alt="Search icon"
            className="h-10 mr-1"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
          <span>{t("tim_kiem")}</span>
        </button>
      </div>
    </form>
  );
}
