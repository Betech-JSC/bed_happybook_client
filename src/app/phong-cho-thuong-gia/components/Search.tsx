"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import { translatePage } from "@/utils/translateDom";
import DisplayPrice from "@/components/base/DisplayPrice";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import LoungeFilter, { FilterGroup } from "./LoungeFilter";

type optionFilterType = FilterGroup;

const GROUP_KEYS = ["country", "city", "airport"] as const;
type GroupKey = (typeof GROUP_KEYS)[number];
const KIND_LABEL: Record<GroupKey, string> = {
  country: "Quốc gia",
  city: "Thành phố",
  airport: "Sân bay",
};

export default function Search({
  optionsFilter,
  initialItems = [],
  initialLastPage = 1,
  initialTotal = 0,
  pageSize = 12,
}: {
  optionsFilter: optionFilterType[];
  categoryDefault?: number;
  initialItems?: any[];
  initialLastPage?: number;
  initialTotal?: number;
  pageSize?: number;
}) {
  const { t } = useTranslation();

  const [groups, setGroups] = useState<FilterGroup[]>(
    (optionsFilter || []).filter((g) => GROUP_KEYS.includes(g.name as GroupKey))
  );
  const [sel, setSel] = useState<Record<string, string[]>>({
    country: [],
    city: [],
    airport: [],
  });
  const [keyword, setKeyword] = useState("");
  const [dkeyword, setDkeyword] = useState("");
  const [sortKey, setSortKey] = useState("price|asc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<any[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [isLastPage, setIsLastPage] = useState(initialLastPage <= 1);
  const [loading, setLoading] = useState(false);

  // bỏ lần load đầu (đã có SSR cho trang 1)
  const skipInitial = useRef(initialItems.length > 0);

  // ---- build query ----
  const baseFilterObj = useCallback(() => {
    const q: Record<string, any> = {};
    GROUP_KEYS.forEach((k) => {
      if (sel[k]?.length) q[`${k}[]`] = sel[k];
    });
    if (dkeyword) q.keyword = dkeyword;
    return q;
  }, [sel, dkeyword]);

  const filterKey = useMemo(
    () => JSON.stringify({ sel, dkeyword, sortKey }),
    [sel, dkeyword, sortKey]
  );

  // ---- tải options (cascading) khi đổi filter/từ khoá ----
  const loadOptions = useCallback(async () => {
    try {
      const res = await ProductBusinessLoungeApi.getOptionsFilter(
        `${buildSearch(baseFilterObj())}`
      );
      const gs: FilterGroup[] = (res?.payload?.data ?? []).filter((g: any) =>
        GROUP_KEYS.includes(g.name)
      );
      setGroups(gs);
      // prune lựa chọn con không còn khả dụng (cascade)
      setSel((prev) => {
        let changed = false;
        const next: Record<string, string[]> = { ...prev };
        gs.forEach((g) => {
          const valid = new Set(g.option.map((o) => o.value));
          const kept = (prev[g.name] ?? []).filter((v) => valid.has(v));
          if (kept.length !== (prev[g.name] ?? []).length) {
            next[g.name] = kept;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    } catch (e) {
      // giữ groups cũ nếu lỗi
    }
  }, [baseFilterObj]);

  // ---- tải kết quả ----
  const loadResults = useCallback(
    async (pageToLoad: number, append: boolean) => {
      try {
        setLoading(true);
        const [sort, order] = sortKey.split("|");
        const q = {
          ...baseFilterObj(),
          page: pageToLoad,
          per_page: pageSize,
          sort,
          order,
        };
        const res = await ProductBusinessLoungeApi.search(`${buildSearch(q)}`);
        const result = res?.payload?.data;
        const items: any[] = result?.items ?? [];
        setData((prev) => {
          const combined = append ? [...prev, ...items] : items;
          return Array.from(new Map(combined.map((it: any) => [it.id, it])).values());
        });
        setTotal(result?.total ?? 0);
        setIsLastPage((result?.last_page ?? 1) <= pageToLoad);
        translatePage("#wrapper-search-lounge", 10);
      } catch (e) {
        console.log("Error search lounge: " + e);
      } finally {
        setLoading(false);
      }
    },
    [baseFilterObj, sortKey, pageSize]
  );

  // debounce keyword
  useEffect(() => {
    const id = setTimeout(() => setDkeyword(keyword.trim()), 400);
    return () => clearTimeout(id);
  }, [keyword]);

  // đổi filter/từ khoá/sort -> reset trang 1 + tải lại options & kết quả
  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }
    setPage(1);
    loadResults(1, false);
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // lần đầu vẫn nạp options cascading (SSR chỉ seed kết quả + options gốc)
  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (group: string, value: string) => {
    setSel((prev) => {
      const cur = prev[group] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [group]: next };
    });
  };
  const clearAll = () => setSel({ country: [], city: [], airport: [] });

  // infinite scroll
  const loadMore = useCallback(() => {
    if (loading || isLastPage) return;
    const next = page + 1;
    setPage(next);
    loadResults(next, true);
  }, [loading, isLastPage, page, loadResults]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "600px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [loadMore]);

  // chips
  const chips = GROUP_KEYS.flatMap((k) =>
    (sel[k] ?? []).map((v) => ({ group: k, value: v }))
  );

  return (
    <div id="wrapper-search-lounge" className="flex flex-col lg:flex-row mt-6 md:gap-6 items-start pb-8">
      <aside className="w-full lg:w-3/12 lg:sticky lg:top-4">
        <LoungeFilter groups={groups} selected={sel} onToggle={toggle} onClear={clearAll} />
      </aside>

      <div className="w-full lg:w-9/12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className="text-32 font-bold">
            {t("phong_cho_thuong_gia")}
            {total > 0 && <span className="text-base font-normal text-gray-500 ml-2">({total})</span>}
          </h1>
          <div className="hidden lg:flex my-4 md:my-0 space-x-3 items-center">
            <span>{t("sap_xep")}</span>
            <div className="w-auto min-w-[180px] bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => setSortKey(e.target.value)}
                defaultValue={"price|asc"}
              >
                <option value="id|desc">{t("moi_nhat")}</option>
                <option value="id|asc">{t("cu_nhat")}</option>
                <option value="price|asc">{t("gia_tu_thap_den_cao")}</option>
                <option value="price|desc">{t("gia_tu_cao_xuong_thap")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* tìm kiếm tổng */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo quốc gia, thành phố/tỉnh, tên sân bay hoặc tên phòng chờ…"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 stroke-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* chips bộ lọc đang chọn */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {chips.map((c) => (
              <span
                key={c.group + c.value}
                className="inline-flex items-center gap-1.5 bg-[#fff1ea] text-[#F27145] border border-[#f9d6c6] text-[13px] font-semibold pl-3 pr-2 py-1.5 rounded-full"
              >
                <span className="text-gray-400 font-medium">{KIND_LABEL[c.group as GroupKey]}:</span>
                {c.value}
                <button onClick={() => toggle(c.group, c.value)} className="hover:text-[#c23c0e]" aria-label="Bỏ lọc">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mb-4">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              {data.map((item: any, index: number) => {
                const bl = item.business_lounge || {};
                const loc = [bl.airport_name, [bl.city, bl.country].filter(Boolean).join(", ")]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <div key={item.id ?? index} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full relative overflow-hidden">
                      <Link href={`/phong-cho-thuong-gia/${item.slug}`}>
                        <Image
                          className="hover:scale-105 ease-in duration-300 cursor-pointer w-full h-[200px] object-cover bg-gray-100"
                          src={item.image_url && item.image_location ? `${item.image_url}/${item.image_location}` : "/default-image.png"}
                          alt={renderTextContent(item.name) || "Phòng chờ thương gia"}
                          width={360}
                          height={240}
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
                          priority={index < 3}
                          loading={index < 3 ? undefined : "lazy"}
                          unoptimized
                        />
                        {bl.iata_code && (
                          <span className="absolute top-3 left-3 bg-black/55 text-white text-[12px] font-bold tracking-wide px-2.5 py-1 rounded-md backdrop-blur-sm">
                            {bl.iata_code}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="py-3.5 px-4">
                      <Link href={`/phong-cho-thuong-gia/${item.slug}`} className="block text-[15.5px] font-bold leading-snug line-clamp-2 min-h-[42px]" data-translate="true">
                        {renderTextContent(item.name)}
                      </Link>
                      {loc && (
                        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mt-1.5 mb-3" data-translate="true">
                          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="line-clamp-1">{loc}</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2.5">
                        {item.discount_price > 0 && item.price > 0 ? (
                          <>
                            <DisplayPrice price={item.price} currency={item?.currency} className="!text-gray-400 !line-through !font-normal !text-[13px]" />
                            <DisplayPrice price={item.price - item.discount_price} currency={item?.currency} className="!text-[#F27145] !font-extrabold !text-lg" />
                          </>
                        ) : (
                          <DisplayPrice price={item.min_price} textPrefix="Giá từ" currency={item?.currency} className="!text-[#F27145] !font-extrabold !text-lg" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center">
              {loading ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18">Loading...</span>
                </>
              ) : (
                <span className="text-18">{t("khong_tim_thay_du_lieu_phu_hop")}</span>
              )}
            </div>
          )}
        </div>

        {data.length > 0 && !isLastPage && (
          <div ref={sentinelRef} className="mt-4 flex justify-center">
            <button onClick={loadMore} disabled={loading} className="flex group w-40 py-3 rounded-lg px-4 bg-white mt-2 space-x-2 border duration-300 text__default_hover justify-center items-center hover:border-primary">
              {loading ? (
                <span className="loader_spiner"></span>
              ) : (
                <>
                  <span>{t("xem_them")}</span>
                  <svg className="group-hover:stroke-primary stroke-gray-700 duration-300" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
