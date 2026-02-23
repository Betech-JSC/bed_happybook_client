"use client";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";
import Schedule from "./Schedule";
import Image from "next/image";
import { renderTextContent } from "@/utils/Helper";
import Link from "next/link";
import DisplayPrice from "@/components/base/DisplayPrice";
import { cloneDeep, isEmpty } from "lodash";
import TicketOptionContent from "./TicketOptionContent";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format, parse } from "date-fns";
import SmoothScrollLink from "@/components/base/SmoothScrollLink";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import ProductGallery from "@/components/product/components/ProductGallery";

export default function FastTrackDetailInfor({ product }: any) {
  const today = new Date();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [departDate, setDepartDate] = useState<Date>(today);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>(product);
  const dayMap: Record<string, string> = {
    monday: "Thứ Hai",
    tuesday: "Ba",
    wednesday: "Tư",
    thursday: "Năm",
    friday: "Sáu",
    saturday: "Bảy",
    sunday: "Chủ nhật",
  };
  const daysOpeningRaw = product?.fast_track?.opening_days;
  const daysOpening = Array.isArray(daysOpeningRaw)
    ? daysOpeningRaw
    : typeof daysOpeningRaw === "string"
      ? JSON.parse(daysOpeningRaw)
      : [];
  const isFullWeek = daysOpening.length === 7;
  const displayDaysOpening = isFullWeek
    ? "Mỗi ngày"
    : daysOpening
      .map((day: any) => dayMap[day])
      .filter(Boolean)
      .join(", ");
  const parsedTimeOpening = parse(
    product?.fast_track?.opening_time,
    "HH:mm:ss",
    new Date()
  );
  const displayTimeOpening = format(parsedTimeOpening, "HH:mm");

  const getMaxPricesPerOption = useCallback(() => {
    const dayName = format(departDate, "EEEE").toLowerCase();
    const clonedProduct = cloneDeep(product);

    clonedProduct.fast_track?.options.forEach((option: any) => {
      const validPrices = option.prices.filter(
        (p: any) => Array.isArray(p.days) && p.days.includes(dayName)
      );

      const grouped: Record<number, any[]> = {};

      validPrices.forEach((p: any) => {
        const typeId = p.product_fast_track_type_id;
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
  }, []);
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6 pb-12">
      <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
        <ProductGallery product={detail} />
        <div id="cac-goi-dich-vu" className="mt-4">
          <div className={`bg-white rounded-2xl p-6`}>
            <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              {t("cac_goi_dich_vu")}
            </h2>
            <div className="mt-6">
              {detail?.fast_track?.options?.length > 0 ? (
                detail?.fast_track?.options.map((option: any) => (
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
                        {departDate && (
                          <div className="w-32 flex-shrink-0">
                            <span>Ngày </span>
                            <span>{format(departDate, "dd/MM/yyyy")}</span>
                          </div>
                        )}
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
                              <DisplayPrice
                                className={`!text-base mr-4 text-black !font-normal`}
                                price={ticket.price}
                                currency={product?.currency}
                              />

                              <p className="text-sm text-gray-500 mt-1">
                                {t("gia")} / {t("khach")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {/* Additional Fees Section - Hiển thị phụ phí từ bảng product_fast_track_additional_fees */}
                    {detail?.additional_fees?.length > 0 && (
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
                      <div className="text-end mt-6 mb-2">
                        <Link
                          href={`/fast-track/checkout/${detail?.slug}?option=${option.id
                            }&departDate=${format(departDate, "yyyy-MM-dd")}`}
                          className="bg-blue-600 w-[110px] text__default_hover p-[10px] text-white rounded-lg inline-flex items-center justify-center"
                        >
                          {t("chon")}
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
        </div>
        <div className="mt-4">
          <div className={`bg-white rounded-2xl p-6`}>
            <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              {t("chi_tiet_dia_diem")}
            </h2>
            <div className="ckeditor_container">
              <div
                data-translate="true"
                className="cke_editable"
                dangerouslySetInnerHTML={{
                  __html: renderTextContent(product?.fast_track?.description),
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-4/12">
        <div className="mt-4 p-6 lg:mt-0 flex flex-col justify-between rounded-2xl bg-white">
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
                alt="Thời gian"
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
                alt="Địa chỉ"
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.fast_track?.address)}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <SmoothScrollLink targetId="cac-goi-dich-vu" offset={-100}>
              <button
                type="button"
                className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
              >
                <span className="mx-auto text-base font-medium">
                  {t("chon_cac_goi_dich_vu")}
                </span>
              </button>
            </SmoothScrollLink>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-3">
          <p className="font-semibold">{t("ngay_di")}</p>
          <div className="flex h-12 items-center border rounded-lg px-2 mt-2">
            <Image
              src="/icon/calendar.svg"
              alt="Lịch trình"
              className="h-10"
              width={18}
              height={18}
            />
            <div className="w-full [&>div]:w-full">
              <DatePicker
                selected={departDate}
                onChange={(date) => setDepartDate(date ? date : today)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
                popperPlacement="bottom-start"
                minDate={today}
                locale={language === "vi" ? vi : enUS}
                onFocus={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                className="z-20 pl-3 w-full outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Schedule schedule={detail?.schedule ?? []} />
        </div>
        <div className="mt-3 bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold">
            {t("luu_y")}
          </h2>
          <div className="mt-4">
            <DisplayContentEditor content={detail?.yacht?.note} />
          </div>
        </div>
      </div>
    </div>
  );
}
