"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import OrderRow from "./OrderRow";
import { formatCurrency } from "@/lib/formatters";

export default function OrderHistoryOverview({
  data,
}: {
  data: any[];
}) {
  const { t } = useTranslation();

  const renderMoney = (value: number, currencyCode?: string) => {
    const locale = currencyCode === "USD" ? "en" : "vi";
    return formatCurrency(Number(value || 0), locale);
  };

  return (
    <section className="w-full">
      <p className="mb-6 text-xl md:text-2xl font-semibold">Tổng đơn hàng</p>

      {!data?.length ? (
        <div className="text-center">
          <p data-translate="true">Bạn chưa có đơn hàng nào trên hệ thống...</p>
          <Link href="/" className="block mt-2 text-blue-700">
            {t("dat_ngay")}
          </Link>
        </div>
      ) : (
        <>
          {data.map((item) => {
            const totalPrice = Number(item?.total_price ?? 0);
            const totalDiscount = Number(item?.total_discount ?? 0);
            const finalTotal = Math.max(totalPrice - totalDiscount, 0);
            const createdAt = item?.created_at
              ? parseISO(item.created_at)
              : new Date();

            return (
              <section
                key={`${item?.source_type ?? "order"}-${item?.source_id ?? item?.order_code}`}
                className="mb-8 last:mb-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
              >
                <div className="bg-[#233b5d] text-white px-4 py-3 md:py-4 flex items-center justify-between gap-3">
                  <p className="text-base md:text-lg font-semibold">
                    {`${t("ngay_dat")} ${format(createdAt, "HH:mm dd-MM-yyyy")}`}
                  </p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm font-medium">
                    {item?.source_label}
                  </span>
                </div>
                <div>
                  <OrderRow
                    label={`${t("san_pham")}`}
                    value={item?.display_label || item?.product_name || item?.order_code}
                  />
                  <OrderRow
                    label={t("ma_don_hang")}
                    value={item?.order_code}
                  />
                  <OrderRow
                    label={`${t("tong_gia")}`}
                    value={renderMoney(totalPrice, item?.currency_code)}
                  />
                  {totalDiscount > 0 && (
                    <OrderRow
                      label={`${t("gia_giam")}`}
                      value={renderMoney(totalDiscount, item?.currency_code)}
                    />
                  )}
                  <OrderRow
                    label={t("tong_cong")}
                    value={renderMoney(finalTotal, item?.currency_code)}
                  />
                  {item?.detail_path && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <Link
                        href={item.detail_path}
                        className="inline-flex rounded-full bg-primary px-4 py-2 text-white text-sm font-medium hover:opacity-90"
                      >
                        Xem theo loại
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </>
      )}
    </section>
  );
}
