"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import OrderInsurance from "./OrderInsurance";
import { formatCurrency } from "@/lib/formatters";
import OrderYacht from "./OrderYacht";
import OrderHotel from "./OrderHotel";
import OrderEsim from "./OrderEsim";
import OrderBusinessLounge from "./OrderBusinessLounge";
import DisplayPrice from "@/components/base/DisplayPrice";
import OrderRow from "./OrderRow";

export default function OrderHistory({
  title,
  product,
  data,
}: {
  title?: string;
  product: any;
  data: any[];
}) {
  const { t } = useTranslation();
  return (
    <section className="w-full">
      <p className="mb-6 text-xl md:text-2xl font-semibold">{title}</p>

      {!data.length ? (
        <div className="text-center">
          <p data-translate="true">Bạn chưa đặt hàng trên hệ thống...</p>
          <Link href={product?.page} className="block mt-2 text-blue-700">
            {t("dat_ngay")}
          </Link>
        </div>
      ) : (
        <>
          {data.map((item) => {
            const esimCurrencyLocale = item?.currency === "USD" ? "en" : "vi";
            const detailMap: any = {
              insurance: <OrderInsurance order={item} />,
              yacht: <OrderYacht order={item} />,
              ticket: <OrderYacht order={item} />,
              "fast-track": <OrderYacht order={item} />,
              "business-lounge": <OrderBusinessLounge order={item} />,
              hotel: <OrderHotel order={item} />,
              esim: <OrderEsim order={item} />,
            };
            return (
              <section
                key={item.id}
                className="mb-8 last:mb-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white"
              >
                <div className="bg-[#233b5d] text-white px-4 py-3 md:py-4">
                  <p className="text-base md:text-lg font-semibold">
                    {`${t("ngay_dat")} ${format(
                      parseISO(item.created_at),
                      "HH:mm dd-MM-yyyy"
                    )}`}
                  </p>
                </div>
                <div>
                  {product?.type === "insurance" ? (
                    <OrderRow
                      label={t("goi")}
                      value={item?.insurance_package?.name}
                    />
                  ) : (
                    <OrderRow
                      label={t("san_pham")}
                      value={
                        product?.type === "esim"
                          ? item?.order_code
                          : item.product_name
                      }
                    />
                  )}
                  {detailMap[product.type] ?? null}
                  <OrderRow
                    label={`${t("tong_gia")}`}
                    value={
                      product?.type === "insurance" ? (
                        formatCurrency(
                          item.total_price,
                          item?.insurance_package?.currency === "VND"
                            ? "vi"
                            : "en"
                        )
                      ) : product?.type === "esim" ? (
                        formatCurrency(item.total_amount, esimCurrencyLocale)
                      ) : (
                        <DisplayPrice
                          price={item.total_price}
                          currency={item?.product?.currency}
                          className="text-black font-normal lg:text-base"
                        />
                      )
                    }
                  />
                  {product?.type !== "esim" && (
                    <OrderRow
                      label={`${t("gia_giam")}`}
                      value={
                        product?.type === "insurance"
                          ? item.total_discount > 0 &&
                          formatCurrency(
                            item.total_discount,
                            item?.insurance_package?.currency === "VND"
                              ? "vi"
                              : "en"
                          )
                          : item.total_discount > 0 && (
                            <DisplayPrice
                              price={item.total_discount}
                              currency={item?.product?.currency}
                              className="text-black font-normal lg:text-base"
                            />
                          )
                      }
                    />
                  )}
                  <OrderRow
                    label={t("tong_cong")}
                    value={
                      product?.type === "insurance" ? (
                        formatCurrency(
                          item.total_price,
                          item?.insurance_package?.currency === "VND"
                            ? "vi"
                            : "en"
                        )
                      ) : product?.type === "esim" ? (
                        formatCurrency(item.total_amount, esimCurrencyLocale)
                      ) : (
                        <DisplayPrice
                          price={item.total_price - item.total_discount}
                          currency={item?.product?.currency}
                        />
                      )
                    }
                  />
                </div>
              </section>
            );
          })}
        </>
      )}
    </section>
  );
}
