"use client";
import Image from "next/image";
import React, { Fragment } from "react";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTimeZone,
} from "@/lib/formatters";
import DisplayImage from "@/components/base/DisplayImage";
import _, { isEmpty } from "lodash";
import { useTranslation } from "@/hooks/useTranslation";
import { isFlightDepartureTooClose } from "@/utils/flightDepartureCheck";
import FlightInfo from "@/components/FlightInfo";

const FlightInternationDetail = ({
  FareData,
  onSelectFlight,
  selectedFlight,
  setFlightDetail,
  flightLeg,
  HPB_ID,
  airports,
  isCheapest,
}: any) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = React.useState<boolean>(false);

  if (selectedFlight) {
    FareData = selectedFlight;
  }

  let flight = FareData ?? null;

  const isTooClose = flight ? isFlightDepartureTooClose(flight.departure?.at) : false;

  const handleSelectFlight = (
    flightSelected: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSelectFlight(_.cloneDeep(flightSelected), HPB_ID, e);
  };
  const startOperating = !isEmpty(flight.segments?.[0]?.operating)
    ? flight.segments?.[0]?.operating
    : flight.airLineCode;
  return (
    <Fragment>
      <div className="h-fit p-2 pb-0">
        {isCheapest && (
          <div className="mb-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
            {t("re_nhat")}
          </div>
        )}
        <div className="grid grid-cols-8 mb-2 last:mb-0 items-center justify-between rounded-lg bg-white p-2 md:py-2 md:px-4 border border-gray-200">
          <div className="col-span-2">
            <div className="flex flex-row items-center gap-2 md:gap-4 text-left">
              <DisplayImage
                imagePath={`assets/images/airline/${startOperating.toLowerCase()}.gif`}
                width={80}
                height={24}
                alt={startOperating}
                classStyle={"max-w-16 md:max-w-20 max-h-10"}
              />
              <div>
                <h3 className="text-xs md:text-18 font-semibold mb-1">
                  {flight.airline}
                </h3>
                <p className="text-[10px] md:text-sm text-gray-500 break-words">
                  {flight?.flightNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-4 text-center flex justify-between">
            <div className="flex items-center justify-between gap-1 md:gap-4 w-full pl-1 md:px-6">
              <div className="flex flex-col items-center">
                <span className="text-xs md:text-lg font-semibold">
                  {formatTimeZone(
                    flight.departure.at,
                    flight.departure.timezone
                  )}
                </span>
                <span className="bg-gray-100 px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-[10px] md:text-sm">
                  {flight.departure.IATACode}
                </span>
              </div>

              <div className="flex items-center w-full space-x-1 md:space-x-3">
                <Image
                  src="/icon/fa-solid_plane.svg"
                  width={20}
                  height={20}
                  alt="Máy bay"
                  className="w-3 h-3 md:w-5 md:h-5 block"
                />
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] md:text-sm text-gray-700 mb-1 md:mb-2">
                    {flight.duration
                      ? formatNumberToHoursAndMinutesFlight(flight.duration)
                      : formatNumberToHoursAndMinutesFlight(
                        flight.segments[0].duration ?? 0
                      )}
                  </span>
                  <div className="relative flex items-center w-full">
                    <div className="flex-grow h-px bg-gray-700"></div>
                    <div className="flex-shrink-0 w-2 h-2 md:w-4 md:h-4 bg-white border md:border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                  </div>
                  <span className="text-[10px] md:text-sm text-gray-700 mt-1 md:mt-2">
                    {flight.legs
                      ? `${flight.legs} ${t("diem_dung")}`
                      : t("bay_thang")}
                  </span>
                </div>
                <Image
                  src="/icon/map-pinned.svg"
                  width={20}
                  height={20}
                  alt="Điểm đến"
                  className="w-3 h-3 md:w-5 md:h-5 block"
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs md:text-lg font-semibold">
                  {formatTimeZone(flight.arrival.at, flight.arrival.timezone)}
                </span>
                <span className="bg-gray-100 px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-[10px] md:text-sm">
                  {flight.arrival.IATACode}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 w-full text-center flex flex-col items-center justify-center gap-1 md:gap-2">
            <div>
              <input
                name={`flight[${flightLeg}]`}
                checked={selectedFlight?.flightCode === flight.flightCode}
                onClick={(e) => {
                  if (isTooClose && selectedFlight?.flightCode !== flight.flightCode) {
                    e.preventDefault();
                    setShowWarningModal(true);
                  }
                }}
                onChange={(e) => {
                  if (!isTooClose) {
                    handleSelectFlight(flight, e);
                  }
                }}
                type="radio"
                className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
              />
            </div>
            <button
              className="inline-block text-blue-700 border-b border-blue-700 font-normal text-[10px] md:text-base"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? t("thu_gon") : t("xem_chi_tiet")}
            </button>
          </div>
          {isTooClose && (
            <div className="col-span-full mt-2 flex justify-start">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                ⚠️ {t("khoi_hanh_qua_gan_duoi_4_h") || "Khởi hành quá gần (dưới 4h)"}
              </span>
            </div>
          )}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              } col-span-full w-full`}
          >
            <div className="overflow-hidden">
              <div className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                <div className="mt-4">
                  <FlightInfo flight={flight} airports={airports} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform scale-100 transition-all duration-300">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <span className="p-2 bg-amber-50 rounded-xl text-xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-900">
                {t("canh_bao_gio_bay_gan") || "Cảnh báo giờ bay gần"}
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {t("chuyen_bay_nay_se_khoi_hanh_duoi_4_tieng_tinh_tu_hien_tai_vui_long_dam_bao_ban_kip_thoi_gian_di_chuyen_ra_san_bay_va_lam_thu_tuc") ||
                `Chuyến bay này sẽ khởi hành dưới 4 tiếng tính từ hiện tại. Vui lòng đảm bảo bạn kịp thời gian di chuyển ra sân bay và làm thủ tục.`}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                {t("quay_lai") || "Quay lại"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectFlight(_.cloneDeep(flight), HPB_ID, { target: { checked: true } } as any);
                  setShowWarningModal(false);
                }}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm animate-pulse"
              >
                {t("dong_y_tiep_tuc") || "Đồng ý tiếp tục"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FlightInternationDetail;
