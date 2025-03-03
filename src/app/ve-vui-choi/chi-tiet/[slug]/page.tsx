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
import { getServerLang } from "@/lib/session";
import { renderTextContent } from "@/utils/Helper";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";

export default async function EntertainmentTicketDetail({
  params,
}: {
  params: { slug: string };
}) {
  // const language = await getServerLang();
  const res = (await ProductTicket.detail(params.slug)) as any;
  const detail = res?.payload?.data;
  if (!detail) notFound();

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
                    data-translate={true}
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
                    data-translate={true}
                  >
                    Vé vui chơi
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700" data-translate={true}>
                    {renderTextContent(detail?.name)}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6 pb-12">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ImageGallery gallery={detail?.gallery} />
              <div className="mt-4">
                <div className={`bg-white rounded-2xl p-6`}>
                  <h2
                    className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
                    data-translate={true}
                  >
                    Chi tiết địa điểm
                  </h2>
                  <div
                    className="mt-4 text-base leading-6"
                    data-translate={true}
                    dangerouslySetInnerHTML={{
                      __html: renderTextContent(detail?.ticket?.description),
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1
                    className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
                    data-translate={true}
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
                    <span data-translate={true}>
                      {renderTextContent(detail?.ticket?.time)}
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
                    <span data-translate={true}>
                      {renderTextContent(detail?.ticket?.address)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <span className="mr-3" data-translate={true}>
                    Giá từ
                  </span>
                  <span className="text-2xl text-primary font-bold mt-3">
                    {formatCurrency(detail?.price)}
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/ve-vui-choi/chi-tiet/${detail?.slug}/checkout`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <span
                      className="mx-auto text-base font-medium"
                      data-translate={true}
                    >
                      Đặt ngay
                    </span>
                  </Link>
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
