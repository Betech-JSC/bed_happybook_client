"use client";
import { FlightApi } from "@/api/Flight";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleSessionStorage } from "@/utils/Helper";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { useTranslation } from "@/hooks/useTranslation";
import FlightInternational1GDetail from "./Detail";
import Flight1GDetailPopup from "./FlightDetailPopup";
import PriceDropdown from "../PriceDropdown";

const INITIAL_LIMIT = 5;

export default function ListFlights1GInternaltion({
  airportsData,
  flightsData,
  from,
  to,
  returnDate,
  departDate,
  flightSession,
  isRoundTrip,
  totalPassengers,
  selectedFareDataId,
  handleSelectDepartFlight,
  handleSelectReturnFlight,
  handleCheckout,
  isCheckOut,
  filters,
}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);

  const handleShowPopupFlightDetail = (
    flight: any,
    indexFareOption: number,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    setShowDetail(true);
    setFlightDetail([flight]);
    setTabsFlightDetail(tabs);
  };

  const handleClosePopupFlightDetail = useCallback(() => {
    setShowDetail(false);
    setFlightDetail([]);
    setTabsFlightDetail([]);
  }, []);
  return (
    <Fragment>
      <div className="my-6">
        <Fragment>
          <div
            className={`bg-white rounded-2xl mb-8 border-2 ${selectedFareDataId === flightsData.hpb_id
              ? "border-[#efad02]"
              : "border-transparent"
              }`}
          >
            {flightsData?.journeys?.map((journey: any, leg: number) => {
              return (
                <div
                  className={`pb-2 bg-[#FCFCFD] rounded-t-2xl ${leg ? "mt-4" : ""
                    }`}
                  key={leg}
                >
                  <div className="flex items-start flex-col-reverse md:flex-row gap-4 justify-between py-4 px-8 rounded-t-2xl bg-blue-50">
                    <div className="flex space-x-4 items-center">
                      <div className="inline-flex items-center justify-center">
                        <Image
                          src="/icon/AirplaneTiltBlue.svg"
                          width={32}
                          height={32}
                          alt="Icon"
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-18 ${leg === 0 ? "text-blue-500" : "text-orange-500"
                            }`}
                        >
                          {leg === 0 ? t("chuyen_di") : t("chuyen_ve")}
                        </h3>

                        <div className="text-sm">
                          <span>
                            {totalPassengers} {t("khach")} -{" "}
                          </span>
                          {leg === 0
                            ? departDate
                              ? pareseDateFromString(
                                departDate,
                                "ddMMyyyy",
                                "dd/MM"
                              )
                              : ""
                            : returnDate
                              ? pareseDateFromString(
                                returnDate,
                                "ddMMyyyy",
                                "dd/MM"
                              )
                              : ""}
                        </div>
                      </div>
                    </div>
                    {leg === 0 && (
                      <div>
                        <PriceDropdown
                          totalPrice={flightsData.totalPrice}
                          totalPriceAdt={flightsData.totalAdult}
                          totalPriceChd={flightsData.totalChild}
                          totalPriceInf={flightsData.totalInfant}
                          numberAdt={flightsData?.numberAdt}
                          numberChd={flightsData?.numberChd}
                          numberInf={flightsData?.numberInf}
                        />
                      </div>
                    )}
                  </div>
                  <FlightInternational1GDetail
                    journey={journey}
                    onSelectFlight={
                      leg ? handleSelectReturnFlight : handleSelectDepartFlight
                    }
                    setFlightDetail={handleShowPopupFlightDetail}
                    fareData={flightsData}
                    selectedFareDataId={selectedFareDataId}
                  />
                </div>
              );
            })}

            <div className="flex justify-end px-4 py-2 items-end">
              {/* <div>
                {flightsData?.numberAdt > 1 && (
                  <p className="text-sm text-gray-700 font-semibold mb-2">
                    {t("nguoi_lon")}:{" "}
                    {flightsData?.totalAdult?.toLocaleString("vi-VN")}
                    {" đ "}x {flightsData?.numberAdt}{" "}
                  </p>
                )}
                {flightsData?.numberChd >= 1 && (
                  <p className="text-sm text-gray-700 font-semibold mb-2">
                    {t("tre_em")}:{" "}
                    {flightsData?.totalChild?.toLocaleString("vi-VN")}
                    {" đ "}x {flightsData?.numberChd}{" "}
                  </p>
                )}
                {flightsData?.numberInf >= 1 && (
                  <p className="text-sm text-gray-700 font-semibold mb-2">
                    {t("em_be")}:{" "}
                    {flightsData?.totalInfant?.toLocaleString("vi-VN")}
                    {" đ "}x {flightsData?.numberInf}{" "}
                  </p>
                )}
                <div>
                  <span className="font-medium">
                    {t("tong_tien_thanh_toan")}:
                  </span>{" "}
                  <span className="text-2xl font-bold text-primary">
                    {flightsData?.totalPrice?.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div> */}
              <button
                className={`text-center w-36 h-11 mt-5 md:mt-3 bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300 ${!isCheckOut || selectedFareDataId !== flightsData.hpb_id
                  ? "disabled:bg-gray-200 disabled:cursor-not-allowed"
                  : ""
                  }`}
                onClick={() => {
                  handleCheckout();
                }}
                disabled={
                  !isCheckOut || !selectedFareDataId === flightsData.hpb_id
                }
              >
                <span>{t("chon")}</span>
              </button>
            </div>
          </div>
        </Fragment>
      </div>
      <Flight1GDetailPopup
        airports={airportsData}
        tabs={tabsFlightDetail}
        flights={flightDetail}
        isOpen={showDetail}
        onClose={handleClosePopupFlightDetail}
        isLoadingFareRules={false}
      />
    </Fragment>
  );
}
