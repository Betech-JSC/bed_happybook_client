"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { differenceInHours, format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleScrollSmooth } from "@/utils/Helper";
import { useRouter } from "next/navigation";
import { FlightApi } from "@/api/Flight";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import FlightInternationDetail from "./Detail";
import FlightInternationalDetailPopup from "./FlightDetailPopup";
import PriceDropdown from "../PriceDropdown";

export default function ListFlightsInternationalNormal({
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
  selectedDepartFlight,
  selectedReturnFlight,
  handleCheckout,
  isCheckOut,
  filters,
}: any) {
  const { t } = useTranslation();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const btnCheckoutRef = useRef<HTMLDivElement>(null);

  const handleShowPopupFlightDetail = (
    flight: any,
    tabs: { id: number; name: string }[]
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

  const departFlights = flightsData.trips.filter(
    (item: any) => item.itineraryId === 1
  );
  const returnFlights = flightsData.trips.filter(
    (item: any) => item.itineraryId === 2
  );
  if (!departFlights?.length || !returnFlights?.length) {
    return null;
  }
  const totalPriceAdt =
    (selectedDepartFlight
      ? selectedDepartFlight?.selectedTicketClass?.totalAdult
      : departFlights[0]?.selectedTicketClass?.totalAdult) +
    (selectedReturnFlight
      ? selectedReturnFlight?.selectedTicketClass?.totalAdult
      : returnFlights[0]?.selectedTicketClass?.totalAdult);

  const totalPriceChd =
    (selectedDepartFlight
      ? selectedDepartFlight?.selectedTicketClass?.totalChild
      : departFlights[0]?.selectedTicketClass?.totalChild) +
    (selectedReturnFlight
      ? selectedReturnFlight?.selectedTicketClass?.totalChild
      : returnFlights[0]?.selectedTicketClass?.totalChild);

  const totalPriceInf =
    (selectedDepartFlight
      ? selectedDepartFlight?.selectedTicketClass?.totalInfant
      : departFlights[0]?.selectedTicketClass?.totalInfant) +
    (selectedReturnFlight
      ? selectedReturnFlight?.selectedTicketClass?.totalInfant
      : returnFlights[0]?.selectedTicketClass?.totalInfant);
  return (
    <Fragment>
      <div
        className={`bg-white rounded-2xl my-6 border-2 ${selectedFareDataId === flightsData.hpb_id
            ? "border-[#efad02]"
            : "border-white border-0"
          }`}
      >
        {/* Depart flights */}
        <div className={`pb-2 bg-[#FCFCFD] rounded-t-3xl`}>
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
                <h3 className="font-bold text-blue-500 text-18">
                  {t("chuyen_di")}
                </h3>

                <div className="text-sm">
                  <span>
                    {totalPassengers} {t("khach")} -{" "}
                  </span>
                  {departDate
                    ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                    : ""}
                </div>
              </div>
            </div>
            <div>
              <PriceDropdown
                totalPrice={flightsData.totalPrice}
                totalPriceAdt={totalPriceAdt}
                totalPriceChd={totalPriceChd}
                totalPriceInf={totalPriceInf}
                numberAdt={flightsData?.numberAdt}
                numberChd={flightsData?.numberChd}
                numberInf={flightsData?.numberInf}
              />
            </div>
          </div>
          {departFlights.map((item: any, index: number) => (
            <FlightInternationDetail
              key={index}
              FareData={item}
              onSelectFlight={handleSelectDepartFlight}
              selectedFlight={null}
              setFlightDetail={handleShowPopupFlightDetail}
              filters={filters}
              totalPassengers={totalPassengers}
              flightLeg={0}
              HPB_ID={flightsData.hpb_id}
              airports={airportsData}
            />
          ))}
        </div>
        {/* Return flights */}
        <div className={`pb-2 bg-[#FCFCFD] rounded-t-2xl`}>
          <div className="flex py-4 px-8 rounded-t-2xl space-x-4 items-center bg-blue-50">
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
              <h3 className="font-bold text-orange-500 text-18">
                {t("chuyen_ve")}
              </h3>

              <div className="text-sm">
                <span>
                  {totalPassengers} {t("khach")} -{" "}
                </span>
                {returnDate
                  ? pareseDateFromString(returnDate, "ddMMyyyy", "dd/MM")
                  : ""}
              </div>
            </div>
          </div>
          {returnFlights.map((item: any, index: number) => (
            <FlightInternationDetail
              key={index}
              FareData={item}
              onSelectFlight={handleSelectReturnFlight}
              selectedFlight={null}
              setFlightDetail={handleShowPopupFlightDetail}
              filters={filters}
              totalPassengers={totalPassengers}
              flightLeg={1}
              HPB_ID={flightsData.hpb_id}
              airports={airportsData}
            />
          ))}
        </div>
        {/* Checkout */}
        <div
          className="flex justify-end px-4 py-6 items-end"
          ref={btnCheckoutRef}
        >
          <button
            className={`text-center w-36 h-11 mt-5 md:mt-3 bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300 ${!isCheckOut
                ? "disabled:bg-gray-200 disabled:cursor-not-allowed"
                : ""
              }`}
            onClick={() => {
              handleCheckout();
            }}
            disabled={isCheckOut ? false : true}
          >
            <span>{t("chon")}</span>
          </button>
        </div>
      </div>
      <FlightInternationalDetailPopup
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
