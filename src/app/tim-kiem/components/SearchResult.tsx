"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { KeywordSearchApi } from "@/api/KeywordSearch";
import SearchHotelList from "./SearchHotelList";
import SearchVisaList from "./SearchVisaList";
import SearchTourList from "./SearchTourList";
import SearchYachtList from "./SearchYachtList";
import SearchTicketList from "./SearchTicketList";
import SearchInsuranceList from "./SearchInsurancelList";
import { isEmpty } from "lodash";

export default function SearchAllResult() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const [loading, setLoading] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setTranslatedText(false);
      const res = await KeywordSearchApi.products(`${keyword}`);
      const result = res?.payload?.data;
      const isAllEmpty = Object.values(result).every(
        (arr) => Array.isArray(arr) && arr.length === 0
      );
      setData(isAllEmpty ? [] : result);
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    loadData();
  }, [keyword, loadData]);

  if (loading) {
    return (
      <div
        className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18" data-translate="true">
          Loading...
        </span>
      </div>
    );
  }
  return (
    <Fragment>
      {!loading && !isEmpty(data) ? (
        <div className="pt-4 pb-12">
          {data?.hotels?.length > 0 && (
            <SearchHotelList hotels={data?.hotels} />
          )}
          {data?.visa?.length > 0 && <SearchVisaList visa={data?.visa} />}
          {data?.tours?.length > 0 && <SearchTourList tours={data?.tours} />}
          {data?.yachts?.length > 0 && (
            <SearchYachtList yachts={data?.yachts} />
          )}
          {data?.tickets?.length > 0 && (
            <SearchTicketList tickets={data?.tickets} />
          )}
          {data?.insurances?.length > 0 && (
            <SearchInsuranceList insurances={data?.insurances} />
          )}
        </div>
      ) : (
        <div
          className={`flex mt-6 pt-12 pb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
        >
          <span className="text-18" data-translate="true">
            Không tìm thấy kết quả phù hợp với từ khóa:{" "}
            <span className="font-semibold">{keyword}</span>
          </span>
        </div>
      )}
    </Fragment>
  );
}
