import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import ImageGallery from "../../components/ImageGallery";
import { ProductTicket } from "@/api/ProductTicket";
import { renderTextContent } from "@/utils/Helper";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import Schedule from "../../components/Schedule";
import "@/styles/ckeditor-content.scss";
import { format, parse, parseISO } from "date-fns";
import { isEmpty } from "lodash";
import SmoothScrollLink from "@/components/base/SmoothScrollLink";

export default async function EntertainmentTicketDetail({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const res = (await ProductTicket.detail(
    params.slug,
    searchParams.departDate ?? ""
  )) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();

  const dayMap: Record<string, string> = {
    monday: "Thứ Hai",
    tuesday: "Ba",
    wednesday: "Tư",
    thursday: "Năm",
    friday: "Sáu",
    saturday: "Bảy",
    sunday: "Chủ nhật",
  };
  const daysOpeningRaw = detail?.ticket?.opening_days;
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
    detail?.ticket?.opening_time,
    "HH:mm:ss",
    new Date()
  );
  const displayTimeOpening = format(parsedTimeOpening, "HH:mm");
  const departDate = searchParams.departDate
    ? format(parseISO(searchParams.departDate), "dd/MM/yyyy")
    : null;

  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/ve-vui-choi`}
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Vé vui chơi
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700" data-translate="true">
                    {renderTextContent(detail?.name)}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6 pb-12">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ImageGallery gallery={detail?.gallery} />
              <div id="cac-goi-dich-vu" className="mt-4">
                <div className={`bg-white rounded-2xl p-6`}>
                  <h2
                    className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
                    data-translate="true"
                  >
                    Các gói dịch vụ
                  </h2>
                  <div className="mt-6">
                    {detail?.ticket_options?.length > 0 &&
                      detail?.ticket_options.map((option: any) => (
                        <div
                          key={option.id}
                          className="mb-6 last:mb-0 py-2 px-4 border border-gray-300 rounded-2xl"
                        >
                          <div className="flex gap-2 flex-col md:flex-row items-start justify-between md:items-center py-4 border-b">
                            <p
                              className="text-blue-700 text-18 font-semibold"
                              data-translate="true"
                            >
                              {option?.name}
                            </p>
                            {departDate && (
                              <div className="w-32 flex-shrink-0">
                                <span>Ngày </span>
                                <span>{departDate}</span>
                              </div>
                            )}
                          </div>
                          {option.prices.map((ticket: any) => (
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
                                    ? renderTextContent(
                                        ticket?.type?.description
                                      )
                                    : ""}
                                </div>
                              </div>
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="text-base mr-4">
                                    {formatCurrency(ticket.day_price)}
                                  </span>
                                  <p
                                    className="text-sm text-gray-500 mt-1"
                                    data-translate="true"
                                  >
                                    Giá / Khách
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="text-end mt-6 mb-2">
                            <Link
                              href={`/ve-vui-choi/chi-tiet/${
                                detail?.slug
                              }/checkout?option=${option.id}&departDate=${
                                searchParams.departDate ?? ""
                              }`}
                              className="bg-blue-600 w-[110px] text__default_hover p-[10px] text-white rounded-lg inline-flex items-center justify-center"
                              data-translate="true"
                            >
                              Chọn
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className={`bg-white rounded-2xl p-6`}>
                  <h2
                    className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
                    data-translate="true"
                  >
                    Chi tiết địa điểm
                  </h2>
                  <div
                    className="mt-4 text-base leading-6"
                    data-translate="true"
                    dangerouslySetInnerHTML={{
                      __html: renderTextContent(detail?.ticket?.description),
                    }}
                  ></div>
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
                    {renderTextContent(detail?.name)}
                  </h1>

                  <div className="flex space-x-2 mt-6 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/clock.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span data-translate="true">
                      Mở {displayTimeOpening} | {displayDaysOpening}
                    </span>
                  </div>

                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/marker-pin-01.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span data-translate="true">
                      {renderTextContent(detail?.ticket?.address)}
                    </span>
                  </div>
                </div>
                {/* <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <span className="mr-3" data-translate="true">
                    Giá từ
                  </span>
                  <span className="text-2xl text-primary font-bold mt-3">
                    {formatCurrency(minPrice)}
                  </span>
                </div> */}
                <div className="mt-6">
                  <SmoothScrollLink targetId="cac-goi-dich-vu" offset={-100}>
                    <button
                      type="button"
                      className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                    >
                      <span
                        className="mx-auto text-base font-medium"
                        data-translate="true"
                      >
                        Chọn các gói dịch vụ
                      </span>
                    </button>
                  </SmoothScrollLink>
                </div>
              </div>
              <div className="mt-3">
                <Schedule schedule={detail?.schedule ?? []} />
              </div>
              <div className="mt-3 bg-white rounded-2xl p-6">
                <h2
                  className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold"
                  data-translate="true"
                >
                  Lưu ý
                </h2>
                <div className="mt-4">
                  <div className="ckeditor_container">
                    <div
                      className="cke_editable mt-2"
                      dangerouslySetInnerHTML={{
                        __html: renderTextContent(detail?.ticket?.note),
                      }}
                    ></div>
                  </div>
                  {/* <ul className="pl-6 list-[circle]">
                    <li>
                      Khách nên có xe hơi để đến và rời khỏi nơi lưu trú này.
                    </li>
                    <li>
                      Có nhận phòng không tiếp xúc và trả phòng không tiếp xúc.
                    </li>
                    <li>
                      Nơi lưu trú này chào đón khách thuộc mọi xu hướng tính dục
                      và nhận dạng giới (thân thiện với cộng đồng LGBTQ+).
                    </li>
                  </ul> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="lg:px-[80px] max__screen">
          <div className="my-8 bg-gray-50 rounded-3xl">
            <FAQ />
          </div>
          <div className="my-8 p-8 bg-gray-50 rounded-3xl">
            <WhyChooseHappyBook />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
