"use client";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { format, parse, isValid } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { SearchForm } from "@/types/insurance";
import { isEmpty, isNumber } from "lodash";
import { ProductInsurance } from "@/api/ProductInsurance";
import "@/styles/ckeditor-content.scss";
import { handleScrollSmooth, renderTextContent } from "@/utils/Helper";
import DisplayImage from "@/components/base/DisplayImage";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [querySearch, setQuerySearch] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
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
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [formData]);

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
    <div ref={resultsRef}>
      {data?.length > 0 ? (
        data.map((item: any, index: number) => (
          <div className="mb-6 last:mb-0  h-fit" key={index}>
            <div className="grid grid-cols-8 items-start justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
              <div className="col-span-8 lg:col-span-6">
                <div className="flex flex-col md:flex-row items-start gap-4 text-center md:text-left mb-3">
                  <div>
                    {!isEmpty(item.image) ? (
                      <DisplayImage
                        imagePath={item.image ?? ""}
                        width={174}
                        height={58}
                        alt={"Brand"}
                        classStyle="max-w-[174px] max-h-[58px] rounded-sm"
                      />
                    ) : (
                      <Image
                        src="/default-image.png"
                        width={174}
                        height={58}
                        alt={"Brand"}
                        className="max-w-[174px] max-h-[58px] object-cover rounded-sm"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-start justify-between space-y-1 lg:space-y-0">
                    <h3 className="text-18 font-bold !leading-normal">
                      {renderTextContent(item.name)}
                    </h3>
                    <p className="text-sm font-normal leading-snug text-gray-500">
                      {renderTextContent(item.description)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-8 lg:col-span-2 w-full text-center md:text-right xl:pr-8">
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
                          {benefit.price && (
                            <p className="text-primary text-base font-bold">
                              {formatCurrency(benefit.price)}
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
        ))
      ) : (
        <div className="text-18 md:text-2xl text-center">
          Không tìm thấy dữ liệu phù hợp....
        </div>
      )}
    </div>
  );
}
