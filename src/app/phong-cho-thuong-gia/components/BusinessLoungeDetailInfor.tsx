"use client";


import Image from "next/image";
import { renderTextContent } from "@/utils/Helper";
import Link from "next/link";
import DisplayPrice from "@/components/base/DisplayPrice";
import { cloneDeep, isEmpty } from "lodash";
import TicketOptionContent from "./TicketOptionContent";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format, parse } from "date-fns";


import { useLanguage } from "@/contexts/LanguageContext";
import ProductGallery from "@/components/product/components/ProductGallery";

export default function BusinessLoungeDetailInfor({ product }: any) {
  const today = new Date();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [departDate, setDepartDate] = useState<Date>(today);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>(product);
  const isBusinessLounge = !!product?.business_lounge?.is_business_lounge;

  // Lưu ý "Phụ phí trẻ em" trích từ mô tả — dùng CHUNG logic với checkout
  // (đa ngôn ngữ VI/EN, linh hoạt markup CKEditor).
  const childPolicy = useMemo(() => {
    const desc = (product?.business_lounge?.description || "") + "\n" + (product?.business_lounge?.note || "");
    if (!desc) return "";

    const matches: string[] = [];
    const elementRegex = /<li[^>]*>([\s\S]*?)<\/li>|<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    const childKeywords = /trẻ\s+em|trẻ\s+nhỏ|trẻ\s+sơ\s+sinh|em\s+bé|child|children|infant/i;
    
    while ((match = elementRegex.exec(desc)) !== null) {
      const content = match[1] || match[2] || "";
      if (childKeywords.test(content)) {
        const cleanContent = content
          .replace(/<\/?(?:strong|b|span|a)[^>]*>/gi, "")
          .trim();
        if (cleanContent) {
          matches.push(cleanContent);
        }
      }
    }

    if (matches.length > 0) {
      return matches.join("<br/>");
    }

    const labels =
      "Phụ phí trẻ em|Children(?:'s)? surcharge|Child(?:ren)? (?:surcharge|policy|fee)";
    const block = desc.match(
      new RegExp(`(?:${labels})[\\s\\S]*?(?:</li>|</p>|$)`, "i"),
    );
    if (!block) return "";
    return block[0]
      .replace(/<\/?(?:li|p|strong|b|span)[^>]*>/gi, "")
      .replace(new RegExp(`^\\s*(?:${labels})\\s*:?\\s*`, "i"), "")
      .trim();
  }, [product]);

  const dayMap: Record<string, string> = {
    monday: t("thu_hai"),
    tuesday: t("thu_ba"),
    wednesday: t("thu_tu"),
    thursday: t("thu_nam"),
    friday: t("thu_sau"),
    saturday: t("thu_bay"),
    sunday: t("chu_nhat"),
  };
  const daysOpeningRaw = product?.business_lounge?.opening_days;
  const daysOpening = Array.isArray(daysOpeningRaw)
    ? daysOpeningRaw
    : typeof daysOpeningRaw === "string"
      ? JSON.parse(daysOpeningRaw)
      : [];
  const isFullWeek = daysOpening.length === 7;
  const displayDaysOpening = isFullWeek
    ? t("moi_ngay")
    : daysOpening
      .map((day: any) => dayMap[day])
      .filter(Boolean)
      .join(", ");
  let displayTimeOpening = product?.business_lounge?.opening_time;
  try {
    if (displayTimeOpening && displayTimeOpening.includes(":")) {
      const parsedTimeOpening = parse(displayTimeOpening, "HH:mm:ss", new Date());
      if (!isNaN(parsedTimeOpening.getTime())) {
        displayTimeOpening = format(parsedTimeOpening, "HH:mm");
      }
    }
  } catch (error) {
  }

  const getMaxPricesPerOption = useCallback(() => {
    const dayName = format(departDate, "EEEE").toLowerCase();
    const clonedProduct = cloneDeep(product);

    clonedProduct.business_lounge?.options.forEach((option: any) => {
      const validPrices = option.prices.filter(
        (p: any) => Array.isArray(p.days) && p.days.includes(dayName)
      );

      const grouped: Record<number, any[]> = {};

      validPrices.forEach((p: any) => {
        const typeId = p.product_business_lounge_type_id;
        if (!grouped[typeId]) grouped[typeId] = [];
        grouped[typeId].push(p);
      });

      const maxPrices = Object.values(grouped).map((items) =>
        items.reduce((maxItem, curr) =>
          Number(curr.price) > Number(maxItem.price) ? curr : maxItem
        )
      );
      option.prices = maxPrices;
    });

    return clonedProduct;
  }, [departDate, product]);

  useEffect(() => {
    setDetail(getMaxPricesPerOption());
  }, [departDate, getMaxPricesPerOption]);

  useEffect(() => {
    setIsMounted(true);
    setDepartDate(new Date());
  }, []);
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 items-start mt-6 pb-12">
      {/* Main content - gallery + packages (left on desktop, below sidebar on mobile) */}
      <div className="w-full lg:w-8/12 order-2 lg:order-1">
        <ProductGallery product={detail} />
        <div id="cac-goi-dich-vu" className="mt-4">
          <div className={`bg-white rounded-2xl p-6`}>
            {detail?.business_lounge?.options?.length > 0 ? (
              detail?.business_lounge?.options.map((option: any) => (
                <div
                  key={option.id}
                  className="mb-6 last:mb-0 py-2 px-4 border border-gray-300 rounded-2xl"
                >
                  <div className="border-b py-5">
                    <div className="flex gap-2 md:gap-3 flex-col md:flex-row justify-between items-start">
                      <p
                        className="text-blue-700 text-18 font-semibold"
                        data-translate="true"
                      >
                        {option?.name}
                      </p>

                    </div>
                    <TicketOptionContent content={option?.description} />
                  </div>
                  {isMounted &&
                    option.prices.map((ticket: any) => (
                      <div
                        key={ticket.id}
                        className="flex space-x-2 justify-between items-start py-4 border-b last:border-none"
                      >
                        <div>
                          <div
                            className="font-semibold text-base"
                            data-translate="true"
                          >
                            {renderTextContent(ticket?.type?.name)}
                          </div>
                          <div
                            className="text-sm text-gray-500 mt-1"
                            data-translate="true"
                          >
                            {!isEmpty(ticket?.type?.description)
                              ? renderTextContent(ticket?.type?.description)
                              : ""}
                          </div>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            {(() => {
                              const hasDiscount =
                                product?.discount_price > 0 && product?.price > 0;
                              if (hasDiscount) {
                                const discountRatio = product.discount_price / product.price;
                                const sale = ticket.price * (1 - discountRatio);
                                const original = ticket.price;
                                return (
                                  <div className="flex items-baseline justify-end gap-2.5">
                                    {original > sale && (
                                      <DisplayPrice
                                        price={original}
                                        currency={product?.currency}
                                        className="!text-gray-400 !line-through !font-normal !text-[13px]"
                                      />
                                    )}
                                    <DisplayPrice
                                      price={sale}
                                      currency={product?.currency}
                                      className="!text-[#F27145] !font-extrabold !text-lg"
                                    />
                                  </div>
                                );
                              }
                              return (
                                <DisplayPrice
                                  className={`!text-base mr-4 text-black !font-normal`}
                                  price={ticket.price}
                                  currency={product?.currency}
                                />
                              );
                            })()}

                            <p className="text-sm text-gray-500 mt-1 text-end">
                              {t("gia")} / {t("khach")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* Child Policy Note */}
                  {childPolicy && (
                    <div className="mt-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block mb-0.5">
                          {t("chinh_sach_tre_em") !== "chinh_sach_tre_em"
                            ? t("chinh_sach_tre_em")
                            : (language === "vi" ? "Chính sách trẻ em:" : "Child Policy:")}
                        </span>
                        <span className="text-gray-700 leading-relaxed" data-translate="true" dangerouslySetInnerHTML={{ __html: childPolicy }} />
                      </div>
                    </div>
                  )}
                  {/* Additional Fees Section - Hiển thị phụ phí từ bảng product_business_lounge_additional_fees */}
                  {!isBusinessLounge && detail?.additional_fees?.length > 0 && (
                    <div className="mt-4 pt-4">
                      <h3 className="text-base font-semibold mb-3" data-translate="true">
                        Phụ phí thêm
                      </h3>
                      {detail.additional_fees.map((fee: any) => (
                        <div
                          key={fee.id}
                          className="flex justify-between items-center py-2 last:border-none"
                        >
                          <div>
                            <div
                              className="font-medium text-sm"
                              data-translate="true"
                            >
                              {renderTextContent(fee.name)}
                            </div>
                            {fee.description && (
                              <div
                                className="text-xs text-gray-500 mt-1"
                                data-translate="true"
                                dangerouslySetInnerHTML={{ __html: fee.description }}
                              >

                              </div>
                            )}
                          </div>
                          <DisplayPrice
                            className="!text-sm text-black !font-medium"
                            price={fee.price}
                            currency={product?.currency}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {option.prices?.length > 0 && (
                    <div className="mt-6 mb-2 lg:hidden">
                      <Link
                        href={`/phong-cho-thuong-gia/checkout/${detail?.slug}?option=${option.id
                          }&departDate=${format(departDate, "yyyy-MM-dd")}`}
                        className="w-full bg-[#F27145] hover:bg-[#E06138] text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span data-translate="true">Đặt ngay</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>{t("thong_tin_dang_cap_nhat")}</p>
            )}
          </div>
        </div>
        {product?.business_lounge?.description && (
          <div className="mt-4">
            <div className={`bg-white rounded-2xl p-6`}>
              <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold mb-4">
                {t("chi_tiet_dia_diem")}
              </h2>
              <div className="ckeditor_container">
                <div
                  data-translate="true"
                  className="cke_editable text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: renderTextContent(product?.business_lounge?.description),
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - top on mobile, right side on desktop */}
      <div className="w-full lg:w-4/12 order-1 lg:order-2">
        <div className="p-6 flex flex-col justify-between rounded-2xl bg-white lg:sticky lg:top-36">
          <div>
            <h1
              className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
              data-translate="true"
            >
              {renderTextContent(product?.name)}
            </h1>

            <div className="flex space-x-2 mt-6 items-center">
              <Image
                className="w-4 h-4"
                src="/icon/clock.svg"
                alt={t("thoi_gian")}
                width={18}
                height={18}
              />
              <span data-translate="true">
                Mở {displayTimeOpening ?? ""} | {displayDaysOpening ?? ""}
              </span>
            </div>

            <div className="flex space-x-2 mt-3 items-center">
              <Image
                className="w-4 h-4"
                src="/icon/marker-pin-01.svg"
                alt={t("dia_chi")}
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.business_lounge?.address)}
              </span>
            </div>
          </div>

          {/* Desktop: Price + Book CTA - only visible on lg+ */}
          {isMounted && detail?.business_lounge?.options?.length > 0 && (() => {
            const firstOption = detail.business_lounge.options[0];
            const firstTicket = firstOption?.prices?.[0];
            if (!firstTicket) return null;
            const hasDiscount = product?.discount_price > 0 && product?.price > 0;
            const discountRatio = hasDiscount ? product.discount_price / product.price : 0;
            const salePrice = hasDiscount ? firstTicket.price * (1 - discountRatio) : firstTicket.price;
            const originalPrice = firstTicket.price;
            return (
              <div className="hidden lg:block mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-gray-500 font-medium">{t("gia")} / {t("khach")}</span>
                  <div className="text-right">
                    {hasDiscount && originalPrice > salePrice && (
                      <DisplayPrice
                        price={originalPrice}
                        currency={product?.currency}
                        className="!text-gray-400 !line-through !font-normal !text-[13px]"
                      />
                    )}
                    <DisplayPrice
                      price={salePrice}
                      currency={product?.currency}
                      className="!text-[#F27145] !font-extrabold !text-2xl"
                    />
                  </div>
                </div>
                <Link
                  href={`/phong-cho-thuong-gia/checkout/${detail?.slug}?option=${firstOption.id}&departDate=${format(departDate, "yyyy-MM-dd")}`}
                  className="mt-4 w-full bg-[#F27145] hover:bg-[#E06138] text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-all shadow-md shadow-[#F27145]/20 flex items-center justify-center gap-2"
                >
                  <span data-translate="true">Đặt ngay</span>
                </Link>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}
