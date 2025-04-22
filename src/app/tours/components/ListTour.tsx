"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  buildSearch,
  getLabelRatingProduct,
  renderTextContent,
} from "@/utils/Helper";
import { TourApi } from "@/api/Tour";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";
import { translatePage } from "@/utils/translateDom";

type optionFilterType = {
  label: string;
  name: string;
  option: {
    value?: number;
    label?: string;
  }[];
};

type LocationData = {
  countries: any;
  areas: any;
  cities: any;
  districts: any;
}

export default function ListTour({
  type_tour,
  titlePage,
  optionsFilter,
}: {
  type_tour: number | undefined;
  titlePage: string;
  optionsFilter: optionFilterType[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    type_tour: type_tour,
    text: searchParams.get("text"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const defaultImage = "https://storage.googleapis.com/gst-nhanhtravel-com/upload/tour/20241018151946.webp?GoogleAccessId=firebase-adminsdk-1qkmx%40nhanhtravel-129e6.iam.gserviceaccount.com&Expires=2229239586&Signature=ekTzZpKt9mPRSsSIJbaQZHkJNO5V9fOtdBZy2DfQSLSEBejWt%2BG5wp4Odh3tGw%2FS%2BzF1CW4EXR2zyny5LwAeU%2Bvgd2x8Z0gS%2B0qDk%2B%2BkFU2LJem6c1l7zc%2F%2FS2kDKXhHgwIUh6%2B0yc27lKzPOR47fYPBbuC4eHRmGaZMVCAI2P3Mi03whRqNniEvAvs7b%2BG85L9czdurKtfEvv%2FaQafrALjNQ6IiZDZEL96S%2FbzpD4pkKqHMGXM3PJmz2CElrG0sGc%2BfnvUIrM3n7t6lSXACA8EcMEUKgXVVIe1xXlAmd4OX8bO%2Bq7QpTo0yw8vzWLx7U7eDXaVIoBheYQUP7wvASA%3D%3D";
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  
  const [areas, setAreas] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const [loadingArea, setLoadingArea] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      setTranslatedText(false);
      setIsDisabled(true);
      const search = buildSearch(query);
      const res = await TourApi.search(`/product/tours/search${search}`);
      const countries = (await TourApi.getCountry())?.payload?.data;
      setCountries(countries || []);
      const result = res?.payload?.data;
      setData((prevData: any) =>
        result.items.length > 0 && !query.isFilters
          ? [...prevData, ...result.items]
          : result.items
      );
      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
      translatePage("#wrapper-search-tours", 10).then(() =>
        setTranslatedText(true)
      );
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setLoadingLoadMore(false);
      setIsDisabled(false);
    }
  }, [query]);

  const handleFilterChange = (group: string, value: string) => {
    setData([]);
    query.text = "";
    setQuery((prevFilters) => {
      const groupFilters = Array.isArray(prevFilters[group])
        ? prevFilters[group]
        : [];
      if (groupFilters.includes(value)) {
        return {
          ...prevFilters,
          [group]: groupFilters.filter((item: string) => item !== value),
          isFilter: true,
        };
      } else {
        return {
          ...prevFilters,
          [group]: [...groupFilters, value],
          isFilter: true,
        };
      }
    });
  };
  const handleSortData = (value: string) => {
    setData([]);
    const [sort, order] = value.split("|");
    setQuery({ ...query, sort: sort, order: order, isFilters: true });
  };

  const handleCountryChange = async (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedArea("");
    setSelectedCity("");
    setSelectedDistrict("");
    setCities([]);
    setDistricts([]);
    handleFilterChange("country_id", countryId);
    if (countryId) {
      try {
        setLoadingArea(true);
        const res = await TourApi.getAreaByCountry(Number(countryId));
        setAreas(res?.payload?.data || []);
      } catch (error) {
        console.error("Error loading areas:", error);
        setAreas([]);
      } finally {
        setLoadingArea(false);
      }
    } else {
      setAreas([]);
    }
  };

  const handleAreaChange = async (areaId: string, countryId: string) => {
    setSelectedArea(areaId);
    setSelectedCity("");
    setSelectedDistrict("");
    setDistricts([]);
    handleFilterChange("area_id", areaId);
    if (areaId) {
      try {
        setLoadingCity(true);
        const res = await TourApi.getCityByLocation(Number(areaId), Number(countryId));
        setCities(res?.payload?.data || []);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      } finally {
        setLoadingCity(false);
      }
    } else {
      setCities([]);
    }
  };

  const handleCityChange = async (cityId: string, countryId: string, areaId: string) => {
    setSelectedCity(cityId);
    setSelectedDistrict("");
    handleFilterChange("city_id", cityId);
    if (cityId) {
      try {
        setLoadingDistrict(true);
        const res = await TourApi.getDistrictByCity(Number(cityId), Number(countryId), Number(areaId));
        setDistricts(res?.payload?.data || []);
      } catch (error) {
        console.error("Error loading districts:", error);
        setDistricts([]);
      } finally {
        setLoadingDistrict(false);
      }
    } else {
      setDistricts([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [query, loadData]);

  if (firstLoad) {
    return (
      <div
        className={`min-h-[300px] flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18" data-translate>
          Loading.....
        </span>
      </div>
    );
  }
  return (
    <div
      id="wrapper-search-tours"
      className="flex mt-6 md:space-x-4 items-start pb-8"
    >
      <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
        <div className="pb-3 mb-3 border-b border-gray-200">
          <p className="font-semibold mb-3" data-translate="true">Địa điểm</p>
          
          <div className="mb-3">
            <select 
              className="w-full p-2 border rounded"
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              <option value="">Chọn quốc gia</option>
              {countries?.map((country: any) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div className="mb-3">
              <select 
                className="w-full p-2 border rounded"
                value={selectedArea}
                onChange={(e) => handleAreaChange(e.target.value, selectedCountry)}
                disabled={loadingArea}
              >
                <option value="">
                  {loadingArea ? "Đang tải..." : "Chọn khu vực"}
                </option>
                {areas.map((area: any) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedArea && (
            <div className="mb-3">
              <select 
                className="w-full p-2 border rounded"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value, selectedCountry, selectedArea)}
                disabled={loadingCity}
              >
                <option value="">
                  {loadingCity ? "Đang tải..." : "Chọn thành phố"}
                </option>
                {cities.map((city: any) => (
                  <option key={city.id} value={city.id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCity && (
            <div className="mb-3">
              <select 
                className="w-full p-2 border rounded"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={loadingDistrict}
              >
                <option value="">
                  {loadingDistrict ? "Đang tải..." : "Chọn quận/huyện"}
                </option>
                {districts.map((district: any) => (
                  <option key={district.id} value={district.id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* {optionsFilter?.length > 0 &&
          optionsFilter.map((item: optionFilterType, index: number) => (
            <div
              key={index}
              className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
            >
              <p className="font-semibold" data-translate="true">
                {item.label}
              </p>
              {item?.option?.length > 0 ? (
                item.option.map((option, index) => {
                  return (
                    index < 20 && (
                      <div
                        key={option.value}
                        className="mt-3 flex space-x-2 items-center"
                      >
                        <input
                          id={item.name + index}
                          type="checkbox"
                          value={option.value}
                          disabled={isDisabled}
                          className={TourStyle.custom_checkbox}
                          onChange={(e) =>
                            handleFilterChange(`${item.name}[]`, e.target.value)
                          }
                        />
                        <label
                          htmlFor={item.name + index}
                          data-translate="true"
                        >
                          {option.label}
                        </label>
                      </div>
                    )
                  );
                })
              ) : (
                <p
                  className="mt-1 text-base text-gray-700"
                  data-translate="true"
                >
                  Dữ liệu đang cập nhật...
                </p>
              )}
              {item.option.length > 20 && (
                <button className="mt-3 flex items-center rounded-lg space-x-3 ">
                  <span
                    className="text-[#175CD3] font-medium"
                    data-translate="true"
                  >
                    Xem thêm
                  </span>
                  <Image
                    className="hover:scale-110 ease-in duration-300 rotate-90"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </button>
              )}
            </div>
          ))} */}
      </div>
      <div className="md:w-8/12 lg:w-9/12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold" data-translate="true">
            {titlePage}
          </h1>
          <div className="flex my-4 md:my-0 space-x-3 items-center">
            <span data-translate="true">Sắp xếp</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => {
                  handleSortData(e.target.value);
                }}
                defaultValue={"id|desc"}
              >
                <option value="id|desc" data-translate="true">
                  Mới nhất
                </option>
                <option value="id|asc" data-translate="true">
                  Cũ nhất
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data.length > 0 ? (
            data.map((tour: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4 transition-opacity duration-700 ${
                  translatedText ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                  <Link href={`/tours/chi-tiet/${tour.slug ?? tour.permalink + '-' + tour.tour_id + '-' + tour.id}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full object-cover"
                      src={tour.bucket_img || defaultImage}
                      alt={`Tour ${tour.tour_name || 'image'}`}
                      width={360}
                      height={270}
                      unoptimized
                      loading="eager"
                      style={{ height: 270, objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                    <span data-translate="true">
                      {renderTextContent(tour?.type_tour_price_id_name)}
                    </span>
                  </div>
                  {tour.is_hot > 0 && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                      <span data-translate="true">Hot tour</span>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/tours/chi-tiet/${tour.slug ?? tour.permalink + '-' + tour.tour_id + '-' + tour.id}`}
                      className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                    >
                      <h2 data-translate="true">
                        {renderTextContent(tour?.tour_name)}
                      </h2>
                    </Link>
                    <div className="flex space-x-2 mt-2">
                      {tour.average_rating > 0 && (
                        <Fragment>
                          <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                            {tour.average_rating}
                          </span>
                          {tour.average_rating >= 2 ? (
                            <span
                              className="text-primary font-semibold"
                              data-translate="true"
                            >
                              {getLabelRatingProduct(tour.average_rating)}
                            </span>
                          ) : (
                            <span className="text-primary font-semibold"></span>
                          )}
                        </Fragment>
                      )}
                      <span className="text-gray-500" data-translate="true">
                        {tour.total_rating ?? 0} đánh giá
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-2 items-center">
                      <Image
                        className="w-4 h-4"
                        src="/icon/clock.svg"
                        alt="Icon"
                        width={18}
                        height={18}
                      />
                      <span data-translate="true">{tour.date_type_name}</span>
                    </div>
                    {tour.date_start_tour && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/clock.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true"> Ngày khởi hành: {tour.date_start_tour} 
                        </span>
                      </div>
                    )}

                    {tour.date_end_tour && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/clock.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true"> Ngày kết thúc: {tour.date_end_tour} 
                        </span>
                      </div>
                    )}

                    


                    {tour.place_start && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/flag.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">
                          Khởi hành từ {renderTextContent(tour.place_start)}
                        </span>
                      </div>
                    )}
                    {tour.place_end && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/marker-pin-01.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">
                          {renderTextContent(tour.place_end)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl text-primary font-bold text-end mt-3">
                    {tour.price_arr.length > 0 ? (
                      <span>
                        {formatCurrency(tour.price_arr[0])}
                      </span>
                    ) : (
                      <span data-translate="true">Liên hệ</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
            >
              <span className="!border-blue-500 !border-t-blue-200"></span>
              {loadingLoadMore ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18" data-translate="true">
                    {" "}
                    Loading...
                  </span>
                </>
              ) : (
                <span className="text-18" data-translate="true">
                  Không tìm thấy dữ liệu phù hợp...
                </span>
              )}
            </div>
          )}
        </div>
        {data.length > 0 && !isLastPage && (
          <div className="mt-4">
            <button
              onClick={() => {
                setQuery({
                  ...query,
                  page: query.page + 1,
                  isFilters: false,
                });
              }}
              className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
            justify-center items-center hover:border-primary"
            >
              {loadingLoadMore ? (
                <span className="loader_spiner"></span>
              ) : (
                <>
                  <span data-translate="true"> Xem thêm</span>

                  <svg
                    className="group-hover:stroke-primary stroke-gray-700 duration-300"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
