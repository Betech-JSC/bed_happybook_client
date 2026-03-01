"use client";
import { FlightApi } from "@/api/Flight";
import {
  AirportOption,
  AirportPopupSelectorProps,
  AirportsCountry,
  SearchFilghtProps,
} from "@/types/flight";
import { highlightTextSearchAirport } from "@/utils/jsxUtils";
import Image from "next/image";
import React, { useState, useRef, useEffect, Fragment } from "react";
import debounce from "lodash.debounce";
import { useTranslation } from "@/hooks/useTranslation";

export default function AirportPopupSelector({
  handleLocationChange,
  handleLocationPlaceChange,
  initialFrom,
  initialFromPlace,
  initialTo,
  initialToPlace,
  airportsData,
}: AirportPopupSelectorProps) {
  const { t } = useTranslation();
  const isFirstRender = useRef(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [departureDisplayText, setDepartureDisplayText] = useState<
    string | null
  >(initialFromPlace);
  const [destinationDisplayText, setDestinationDisplayText] = useState<
    string | null
  >(initialToPlace);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    initialFrom
  );
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    initialTo
  );

  const [selectedTab, setSelectedTab] = useState(
    airportsData && airportsData[0] ? airportsData[0].id : 0
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeInput, setActiveInput] = useState<
    "departure" | "destination" | null
  >(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<any>(null);
  const toRef = useRef<any>(null);
  const inputSearchRef = useRef<any>(null);
  const debounceRef = useRef<any>(null);
  const [airPortSeach, setAirPortSeach] = useState<any>([]);
  const handleInputClick = (input: "departure" | "destination") => {
    setActiveInput(input);
    setIsPopupVisible(true);
    setSearchQuery("");
  };
  useEffect(() => {
    if (initialFrom) {
      setSelectedDeparture(initialFrom);
      setDepartureDisplayText(initialFromPlace);
    }
    if (initialTo) {
      setSelectedDestination(initialTo);
      setDestinationDisplayText(initialToPlace);
    }
  }, [initialFrom, initialTo, initialFromPlace, initialToPlace]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selectedDeparture || selectedDestination) {
      if (!selectedDeparture) {
        fromRef.current?.click();
      }
      if (!selectedDestination) {
        toRef.current?.click();
      }
    }
  }, [selectedDeparture, selectedDestination]);

  // useEffect(() => {
  //   if (isPopupVisible && inputSearchRef.current) {
  //     inputSearchRef.current?.focus();
  //   }
  // }, [isPopupVisible]);

  useEffect(() => {
    debounceRef.current = debounce((query: string) => {
      if (query) {
        const searchAirPortsResponse = FlightApi.searchAirPorts(query);
        try {
          searchAirPortsResponse.then((response: any) => {
            setAirPortSeach(response?.payload.data);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      debounceRef.current(searchQuery);
    } else {
      setAirPortSeach([]);
    }
  }, [searchQuery]);

  const handleAirportSelect = (
    airport: AirportOption | null,
    airportSearch: any = null
  ) => {
    let displayText = "";
    let code = "";
    if (airportSearch) {
      displayText = `${airportSearch.name_vi} (${airportSearch.code})`;
      code = airportSearch.code;
    } else {
      displayText = `${airport?.city} (${airport?.code})`;
      code = airport ? airport.code : "undefined";
    }
    if (activeInput === "departure") {
      setDepartureDisplayText(displayText);
      setSelectedDeparture(code);
      handleLocationChange({ from: code, to: selectedDestination });
      handleLocationPlaceChange({
        fromPlace: displayText,
        toPlace: destinationDisplayText,
      });
    } else if (activeInput === "destination") {
      setDestinationDisplayText(displayText);
      setSelectedDestination(code);
      handleLocationChange({ from: selectedDeparture, to: code });
      handleLocationPlaceChange({
        fromPlace: departureDisplayText,
        toPlace: displayText,
      });
    }
    setAirPortSeach([]);
    setIsPopupVisible(false);
  };

  const filteredAirports =
    airportsData
      .find((countryData: AirportsCountry) => countryData.id === selectedTab)
      ?.airports.filter((airport) => {
        const selectedType =
          activeInput === "departure"
            ? airportsData
              .flatMap((data) => data.airports)
              .find((a) => a.code === selectedDestination)?.type
            : airportsData
              .flatMap((data) => data.airports)
              .find((a) => a.code === selectedDeparture)?.type;

        // const filterByType =
        //   !selectedType ||
        //   (selectedType === "international"
        //     ? airport.type === "domestic"
        //     : true);

        return (
          // filterByType &&
          activeInput === "departure"
            ? airport.code !== selectedDestination
            : airport.code !== selectedDeparture
        );
      }) || [];

  const handleSwitch = () => {
    setSelectedDeparture((prevDeparture) => {
      setSelectedDestination(prevDeparture);
      return selectedDestination;
    });

    setDepartureDisplayText(destinationDisplayText);
    setDestinationDisplayText(departureDisplayText);
    handleLocationChange({ from: selectedDestination, to: selectedDeparture });
    handleLocationPlaceChange({
      fromPlace: destinationDisplayText,
      toPlace: departureDisplayText,
    });
  };

  return (
    <Fragment>
      <div className="w-full md:w-1/2 mr-1">
        <label htmlFor="departure-input" className="block text-gray-700 mb-1">
          <i className="fas fa-plane-departure"></i>
          <span>{t("tu")}</span>
        </label>
        <div className="flex h-12 items-center border rounded-lg px-2">
          <Image
            src="/icon/AirplaneTakeoff.svg"
            alt="Cất cánh"
            className="h-10"
            width={18}
            height={18}
          ></Image>
          <div className="w-full cursor-pointer">
            <input
              id="departure-input"
              type="text"
              placeholder={t("chon_diem_di")}
              value={departureDisplayText ?? ""}
              onClick={() => handleInputClick("departure")}
              readOnly
              ref={fromRef}
              className="w-full px-4 py-2 cursor-pointer focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div
        onClick={handleSwitch}
        className="focus:outline-none absolute right-0 md:right-[unset] top-[60%] md:top-3/4 md:left-[48%] md:-translate-x-[48%] -translate-y-3/4"
      >
        <button className="border border-gray-300 p-2 rounded-full bg-white">
          <Image
            src="/icon/switch-horizontal.svg"
            alt="Chuyển đổi"
            className="h-5"
            width={20}
            height={20}
          ></Image>
        </button>
      </div>
      <div className="w-full md:w-1/2">
        <label htmlFor="destination-input" className="block text-gray-700 mb-1">
          <span>{t("den")}</span>
        </label>
        <div className="flex h-12 items-center border rounded-lg px-2  md:pl-6">
          <Image
            src="/icon/AirplaneLanding.svg"
            alt="Hạ cánh"
            className="h-10"
            width={18}
            height={18}
          />
          <div className="w-full cursor-pointer">
            <input
              id="destination-input"
              type="text"
              placeholder={t("chon_diem_den")}
              value={destinationDisplayText ?? ""}
              onClick={() => handleInputClick("destination")}
              readOnly
              ref={toRef}
              className="w-full px-4 py-2  cursor-pointer focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div
        ref={popupRef}
        className={`fixed !mt-[68px] md:!mt-2 top-0 md:top-full h-full overflow-y-auto md:h-fit md:inset-[unset] md:absolute w-screen md:w-[650px] lg:w-[750px] left-0 bg-white border border-gray-300 shadow-lg rounded-md z-[9999]
            ${isPopupVisible ? "visible z-[9999]" : "invisible z-[-1]"}`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold text-orange-700">
            {t(`chon_${activeInput === "departure" ? "diem_di" : "diem_den"}`)}
          </h2>
          <button
            onClick={() => setIsPopupVisible(false)}
            className="text-xl font-bold text-gray-500"
          >
            <Image
              src="/icon/close.svg"
              alt="Đóng"
              className="h-4 w-4 block"
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
        <div className="px-4 py-2 mt-2">
          <input
            type="text"
            placeholder="Nhập Tên thành phố, Mã sân bay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setSearchQuery((prev) => prev.trim())}
            ref={inputSearchRef}
            className="w-full px-4 py-2 border rounded-sm border-gray-300 focus:outline-none"
          />
        </div>
        {searchQuery && (
          <div>
            {airPortSeach.length > 0 && (
              <div className="px-4 py-2 absolute left-4 bg-white border border-gray-300 rounded-lg w-11/12 max-h-[320px] z-30 h-auto overflow-y-auto">
                <div>
                  {airPortSeach.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="font-normal py-2 text-left rounded-lg text__default_hover cursor-pointer"
                      onClick={() => handleAirportSelect(null, item)}
                    >
                      <b>{item.code}</b> - <span>{item.name_vi}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap md:flex-nowrap md:space-x-2 px-4 py-2">
          {airportsData &&
            airportsData.map(
              (country, index) =>
                country.airports.length > 0 && (
                  <button
                    key={index}
                    className={`px-3 py-1 mb-2 mr-2 md:mb-0 md:mr-0 rounded-md border ${selectedTab === country.id
                      ? "bg-orange-700 text-white"
                      : "text-gray-600 border-gray-300"
                      }`}
                    onClick={() => setSelectedTab(country.id)}
                  >
                    {country.country}
                  </button>
                )
            )}
        </div>
        {filteredAirports && filteredAirports.length > 0 ? (
          <div className="text-sm md:text-base grid grid-cols-2 mx-4 mt-2 mb-24 md:mb-4 md:grid-cols-3 gap-2 border border-gray-300 rounded-lg py-2 h-auto pb-3 ">
            {filteredAirports.map((airport) => (
              <div
                key={airport.code}
                className="font-normal px-3 py-2 text-left rounded-lg text__default_hover cursor-pointer"
                onClick={() => handleAirportSelect(airport)}
              >
                {highlightTextSearchAirport(
                  `${airport.city} (${airport.code})`,
                  searchQuery
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center my-4 text-gray-500">
            Không tìm thấy{" "}
            {activeInput === "departure" ? "điểm đi" : "điểm đến"} phù hợp
          </div>
        )}
      </div>
    </Fragment>
  );
}
