"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import { translatePage } from "@/utils/translateDom";
import DisplayPrice from "@/components/base/DisplayPrice";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import { useWelcomeDiscount } from "@/hooks/useWelcomeDiscount";
import LoungeFilter, { FilterGroup } from "./LoungeFilter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type optionFilterType = FilterGroup;

// Dải số trang: luôn có trang 1; cửa sổ quanh trang hiện tại; luôn có ~2 trang cuối; "…" cho khoảng trống.
function getPageRange(current: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(2); // 2 trang đầu
  pages.add(totalPages);
  pages.add(totalPages - 1); // 2 trang cuối
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}

const GROUP_KEYS = ["country", "city", "airport"] as const;
type GroupKey = (typeof GROUP_KEYS)[number];
// KIND_LABEL dùng t() nên phải tính bên trong component — xem useMemo bên dưới

export default function Search({
  optionsFilter,
  initialItems = [],
  initialLastPage = 1,
  initialTotal = 0,
  pageSize = 12,
  initialSel = {},
}: {
  optionsFilter: optionFilterType[];
  categoryDefault?: number;
  initialItems?: any[];
  initialLastPage?: number;
  initialTotal?: number;
  pageSize?: number;
  initialSel?: Partial<Record<GroupKey, string[]>>;
}) {
  const { t } = useTranslation();
  const welcomeDiscount = useWelcomeDiscount("business-lounge");

  const KIND_LABEL: Record<GroupKey, string> = useMemo(() => ({
    country: t("quoc_gia"),
    city: t("thanh_pho"),
    airport: t("san_bay"),
  }), [t]);

  const [groups, setGroups] = useState<FilterGroup[]>(
    (optionsFilter || []).filter((g) => GROUP_KEYS.includes(g.name as GroupKey))
  );
  const [sel, setSel] = useState<Record<string, string[]>>({
    country: initialSel.country ?? [],
    city: initialSel.city ?? [],
    airport: initialSel.airport ?? [],
  });
  const [keyword, setKeyword] = useState("");
  const [dkeyword, setDkeyword] = useState("");
  const [sortKey, setSortKey] = useState("price|asc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<any[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [lastPage, setLastPage] = useState(Math.max(1, initialLastPage));
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
      translatePage("#wrapper-search-lounge", 10);
    } catch (e) {
      // giữ groups cũ nếu lỗi
    }
  }, [baseFilterObj]);

  // ---- tải kết quả (phân trang: luôn thay thế danh sách) ----
  const loadResults = useCallback(
    async (pageToLoad: number) => {
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
        setData(
          Array.from(new Map(items.map((it: any) => [it.id, it])).values())
        );
        setTotal(result?.total ?? 0);
        setLastPage(Math.max(1, result?.last_page ?? 1));
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
    loadResults(1);
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

  // chuyển trang
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const goToPage = useCallback(
    (p: number) => {
      if (loading || p < 1 || p > lastPage || p === page) return;
      setPage(p);
      loadResults(p);
      // cuộn về đầu danh sách để xem từ trên xuống
      wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [loading, lastPage, page, loadResults]
  );

  const pageItems = getPageRange(page, lastPage);

  // chips
  const chips = GROUP_KEYS.flatMap((k) =>
    (sel[k] ?? []).map((v) => ({ group: k, value: v }))
  );

  return (
    <div ref={wrapperRef} id="wrapper-search-lounge" className="flex flex-col lg:flex-row mt-6 md:gap-6 items-start pb-8">
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
            placeholder={t("tim_theo_quoc_gia_thanh_pho_tinh_ten_san_bay_hoac_ten_phong_cho")}
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
                <button onClick={() => toggle(c.group, c.value)} className="hover:text-[#c23c0e]" aria-label={t("bo_loc")}>
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
                  <div key={item.id} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-150 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-full relative overflow-hidden">
                      <Link href={`/phong-cho-thuong-gia/${item.slug}`}>
                        <Image
                          className="hover:scale-105 ease-in duration-300 cursor-pointer w-full h-[200px] object-cover bg-gray-100"
                          src={item.image_url && item.image_location ? `${item.image_url}/${item.image_location}` : "/default-image.png"}
                          alt={renderTextContent(item.name) || t("phong_cho_thuong_gia")}
                          width={360}
                          height={240}
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
                          priority={index < 3}
                          loading={index < 3 ? undefined : "lazy"}
                          unoptimized
                        />
                        {(bl.iata_code || (item.discount_price > 0 && item.price > 0)) && (
                          <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                            {bl.iata_code && (
                              <span className="bg-black/55 text-white text-[12px] font-bold tracking-wide px-2.5 py-1 rounded-md backdrop-blur-sm">
                                {bl.iata_code}
                              </span>
                            )}
                            {item.discount_price > 0 && item.price > 0 && (
                              <span className="bg-[#F27145] text-white text-[12px] font-bold px-2 py-1 rounded-md shadow-sm" data-translate="true">
                                {t("giam")} {Math.round((item.discount_price / item.price) * 100)}%
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="py-3.5 px-4 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/phong-cho-thuong-gia/${item.slug}`} className="block text-[15.5px] font-bold leading-snug line-clamp-2 min-h-[42px]" data-translate="true">
                          {renderTextContent(item.name)}
                        </Link>
                        {loc && (
                          <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mt-1.5 mb-3">
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="line-clamp-1" data-translate="true">{loc}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline justify-end gap-2.5 mt-auto">
                        {(() => {
                          // Welcome discount (chiến dịch của master) ưu tiên trước discount_price
                          if (welcomeDiscount) {
                            const wsale =
                              welcomeDiscount.type === "amount"
                                ? Math.max(0, item.min_price - (item?.currency?.code?.toUpperCase() === "USD" ? (welcomeDiscount.valueUsd ?? 2) : welcomeDiscount.value))
                                : Math.max(0, item.min_price * (1 - welcomeDiscount.value / 100));
                            return (
                              <>
                                <DisplayPrice price={item.min_price} currency={item?.currency} className="!text-gray-400 !line-through !font-normal !text-[13px]" />
                                <DisplayPrice price={wsale} currency={item?.currency} className="!text-[#F27145] !font-extrabold !text-lg" />
                              </>
                            );
                          }
                          const sale =
                            item.discount_price > 0 && item.price > 0
                              ? item.price - item.discount_price
                              : item.min_price || item.price || 0;
                          const original =
                            item.discount_price > 0 && item.price > 0
                              ? item.price
                              : item.price > sale
                              ? item.price
                              : 0;
                          return (
                            <>
                              {original > sale && (
                                <DisplayPrice price={original} currency={item?.currency} className="!text-gray-400 !line-through !font-normal !text-[13px]" />
                              )}
                              <DisplayPrice price={sale} currency={item?.currency} className="!text-[#F27145] !font-extrabold !text-lg" />
                            </>
                          );
                        })()}
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

        {data.length > 0 && lastPage > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>

              {pageItems.map((it, idx) =>
                it === "ellipsis" ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={it}>
                    <PaginationLink
                      isActive={it === page}
                      onClick={() => goToPage(it)}
                    >
                      {it}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(page + 1)}
                  aria-disabled={page >= lastPage}
                  className={page >= lastPage ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
