"use client";
import { formatCurrency, formatMoney } from "@/lib/formatters";
import Image from "next/image";
import { format, parse, isValid, differenceInDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { SearchForm } from "@/types/insurance";
import { isEmpty, isNumber } from "lodash";
import { ProductInsurance } from "@/api/ProductInsurance";
import "@/styles/ckeditor-content.scss";
import { handleScrollSmooth, renderTextContent } from "@/utils/Helper";
import DisplayImage from "@/components/base/DisplayImage";

export default function SearchResults() {
  const types = ["domestic", "international"];
  const searchParams = useSearchParams();
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [diffDate, setDiffDate] = useState<number>(0);
  const [querySearch, setQuerySearch] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const areaType = searchParams.get("type") ?? "";
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [formData, setFormData] = useState<SearchForm>({
    departurePlace: "",
    destinationPlace: "",
    departureDate: null,
    returnDate: null,
    guests: 1,
    type: "",
  });

  const toggleShowDetail = useCallback(
    (id: number) => {
      setShowDetail(showDetail === id ? null : id);
    },
    [showDetail]
  );
  useEffect(() => {
    const departDate = parse(
      searchParams.get("departDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    const returnDate = parse(
      searchParams.get("returnDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    setFormData({
      departurePlace: searchParams.get("departure") ?? "",
      destinationPlace: searchParams.get("destination") ?? "",
      departureDate: isValid(departDate) ? departDate : null,
      returnDate: isValid(returnDate) ? returnDate : null,
      guests: isNumber(parseInt(searchParams.get("guests") ?? "1"))
        ? parseInt(searchParams.get("guests") ?? "1")
        : 1,
      type: searchParams.get("type") ?? "",
    });
    setDepartDate(departDate);
    setReturnDate(returnDate);
    setDiffDate(differenceInDays(returnDate, departDate));
  }, [searchParams]);

  const handleChoose = (id: number) => {
    router.push(`/bao-hiem/checkout/${id}${querySearch}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const formattedDate = formData.departureDate
          ? format(formData.departureDate, "dd-MM-yyyy")
          : "";
        const formattedReturndate = formData.returnDate
          ? format(formData.returnDate, "dd-MM-yyyy")
          : "";
        const formattedDateSearch = formData.departureDate
          ? format(formData.departureDate, "ddMMyyyy")
          : "";
        const formattedReturndateSearch = formData.returnDate
          ? format(formData.returnDate, "ddMMyyyy")
          : "";
        const queryString = `?departure=${formData.departurePlace}&destination=${formData.destinationPlace}&departure_date=${formattedDate}&return_date=${formattedReturndate}&guests=${formData.guests}&type=${formData.type}`;
        const querySearch = `?departure=${formData.departurePlace}&destination=${formData.destinationPlace}&departDate=${formattedDateSearch}&returnDate=${formattedReturndateSearch}&guests=${formData.guests}&type=${formData.type}`;
        const response = await ProductInsurance.search(
          `/insurance/search${queryString}`
        );
        setQuerySearch(querySearch);
        setData(response?.payload?.data ?? []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        if (resultsRef.current) {
          handleScrollSmooth(resultsRef.current);
        }
      }
    };
    if (
      formData.departurePlace &&
      formData.destinationPlace &&
      formData.departureDate &&
      formData.returnDate
    ) {
      setData([]);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [formData]);

  const { guests, ...rest } = formData;

  const isFormDataEmpty = Object.values(rest).every(
    (value) => value === "" || value === null || value === undefined
  );

  if (isFormDataEmpty) return;

  if (isLoading) {
    return (
      <div
        ref={resultsRef}
        className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Loading...</span>
      </div>
    );
  }

  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen pb-12">
      <div>
        <h2 className="text-2xl lg:text-32 font-bold !leading-tight">
          Bảo hiểm du lịch{" "}
          {types.includes(areaType)
            ? areaType === "domestic"
              ? "nội địa"
              : "quốc tế"
            : ""}
        </h2>
        {departDate && returnDate && (
          <p className="text-base font-normal leading-normal text-gray-500 mt-2">
            {`${format(departDate, "dd/MM/yyyy")} - ${format(
              returnDate,
              "dd/MM/yyyy"
            )}`}
          </p>
        )}
      </div>
      <div className="mt-6">
        <div ref={resultsRef}>
          {data?.length > 0 ? (
            data.map((item: any, index: number) => {
              const matchedInsurancePackagePrice =
                item?.insurance_package_prices?.find(
                  (item: any) =>
                    diffDate >= item.day_start && diffDate <= item.day_end
                );
              const matchedFee =
                parseInt(matchedInsurancePackagePrice?.parsed_price) ?? 0;
              const totalFee = matchedFee * (formData.guests ?? 1);
              const currencyFormatDisplay =
                item?.currency.toLowerCase() === "usd" ? "en" : "vi";
              return (
                <>
                  {totalFee > 0 && (
                    <div className="mb-6 last:mb-0  h-fit" key={index}>
                      <div className="grid gap-1 grid-cols-8 items-start justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
                        <div className="col-span-8 lg:col-span-3">
                          <div className="flex flex-col md:flex-row items-start gap-4 text-center md:text-left mb-3">
                            <div className="w-full md:w-[120px] flex-shrink-0">
                              {!isEmpty(item?.insurance_type.image_location) ? (
                                <DisplayImage
                                  imagePath={
                                    item?.insurance_type.image_location
                                  }
                                  width={174}
                                  height={58}
                                  alt={"Brand"}
                                  classStyle="w-full h-auto rounded-sm object-cover "
                                />
                              ) : (
                                <Image
                                  src="/default-image.png"
                                  width={174}
                                  height={58}
                                  alt={"Brand"}
                                  className="w-full h-auto object-cover rounded-sm"
                                />
                              )}
                            </div>
                            <div className="flex gap-1 flex-col items-start justify-between space-y-1 lg:space-y-0">
                              <h3 className="text-18 font-bold !leading-normal">
                                {renderTextContent(item.name)}
                              </h3>
                              <p className="line-clamp-5 text-sm font-normal leading-snug text-gray-500 text-justify">
                                {renderTextContent(item.description)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-8 lg:col-span-5">
                          <div
                            className={`grid grid-cols-4 lg:grid-cols-${
                              currencyFormatDisplay === "vi" ? "4" : "5"
                            }`}
                          >
                            {!isEmpty(item.exchange_rate) &&
                              currencyFormatDisplay !== "vi" && (
                                <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                                  <p className="text-gray-700">Tỷ giá</p>
                                  <div className="flex flex-col items-center justify-between space-y-1 lg:space-y-0">
                                    <p className="mt-1 leading-snug font-medium">
                                      {formatCurrency(item.exchange_rate)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                              <p className="text-gray-700">Giá / Khách</p>
                              <div className="flex flex-col items-center justify-between space-y-1 lg:space-y-0">
                                <p className="mt-1 leading-snug font-medium">
                                  {formatCurrency(
                                    matchedFee,
                                    currencyFormatDisplay
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                              <p className="text-gray-700">Số lượng</p>
                              <p className="mt-1 leading-snug font-medium">
                                {formData.guests}
                              </p>
                            </div>
                            <div className="col-span-4 lg:col-span-1 text-right lg:text-center mb-4">
                              <p className="text-gray-700 font-semibold">
                                Tổng
                              </p>
                              <p className="mt-1 leading-snug text-primary text-18 font-semibold">
                                {formatCurrency(
                                  totalFee,
                                  currencyFormatDisplay
                                )}
                              </p>
                            </div>
                            <div className="col-span-4 lg:col-span-1 w-full text-center md:text-right xl:pr-8">
                              <div className="flex flex-row-reverse w-full lg:w-auto lg:flex-col justify-between float-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleChoose(item.id)}
                                  className="max-w-32 block text-center w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                                >
                                  Chọn
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleShowDetail(index)}
                                  className="text-blue-700 font-medium text-base border-b border-b-blue-700"
                                >
                                  Xem quyền lợi
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        ref={contentRef}
                        style={{
                          maxHeight: showDetail === index ? "500px" : "0px",
                        }}
                        className={`bg-gray-100 border-2 rounded-2xl relative transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${
                          showDetail === index
                            ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
                            : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
                        } overflow-y-auto rounded-lg`}
                      >
                        <div className="flex flex-col justify-between py-3 px-4 md:px-6 bg-white rounded-lg">
                          <div className="pb-1">
                            <p className="text-blue-700 text-22 font-bold mb-4">
                              Quyền lợi bảo hiểm
                            </p>
                            {item?.insurance_package_benefits?.length > 0 ? (
                              item.insurance_package_benefits.map(
                                (benefit: any, benefitIndex: number) => (
                                  <div
                                    key={benefitIndex}
                                    className="mb-4 pb-4 border-b border-b-gray-200"
                                  >
                                    <p className="mb-1">
                                      {renderTextContent(benefit.name)}
                                    </p>
                                    <p className="mb-1">
                                      {renderTextContent(benefit.description)}
                                    </p>
                                    {benefit.parsed_price && (
                                      <p className="text-primary text-base font-bold">
                                        {formatCurrency(
                                          benefit.parsed_price,
                                          currencyFormatDisplay
                                        )}
                                      </p>
                                    )}
                                  </div>
                                )
                              )
                            ) : (
                              <p>Nội dung đang cập nhật...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })
          ) : (
            <div className="text-18 md:text-2xl text-center">
              Không tìm thấy dữ liệu phù hợp....
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
