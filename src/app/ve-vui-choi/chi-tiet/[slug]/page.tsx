import Image from "next/image";
import type { Metadata } from "next";
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

export default async function EntertainmentTicketDetail({
  params,
}: {
  params: { slug: string };
}) {
  const gallery = [
    {
      image_url: "",
      image: "ve-vui-choi/gallery/1.png",
    },
    {
      image_url: "",
      image: "ve-vui-choi/gallery/2.png",
    },
    {
      image_url: "",
      image: "ve-vui-choi/gallery/3.png",
    },
    {
      image_url: "",
      image: "ve-vui-choi/gallery/4.png",
    },
    {
      image_url: "",
      image: "ve-vui-choi/gallery/5.png",
    },
    {
      image_url: "",
      image: "ve-vui-choi/gallery/6.png",
    },
  ];
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/ve-vui-choi`} className="text-blue-700">
                    Vé vui chơi
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700">VinWonders Hà Nội</p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6 pb-12">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ImageGallery gallery={gallery} />
              <div className="mt-4">
                <div className={`bg-white rounded-2xl p-6`}>
                  <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                    Chi tiết địa điểm
                  </h2>
                  <div className="mt-4 text-base leading-6">
                    <p>
                      Đưa vô số trò chơi và giải trí đa dạng vào một trong những
                      công viên giải trí lớn nhất Việt Nam, và bạn sẽ có ngay
                      một điểm hẹn: VinWonders Phú Quốc.
                    </p>
                    <ul className="list list-disc list-inside">
                      <li>
                        Trải nghiệm 12 nền văn minh nhân loại từ xa xưa đến nay
                        và 6 khu với hơn 100 hoạt động vui chơi giải trí trong
                        công viên giải trí lớn nhất Việt Nam
                      </li>
                      <li>
                        Du hành ngược thời gian đến những vùng đất huyền thoại
                        thông qua các trò chơi nổi tiếng thế giới, lên một chiếc
                        bè khổng lồ cao 30 mét so với mực nước biển hoặc lênh
                        đênh trên dòng sông ly kỳ để khám phá những bí mật ẩn
                        giấu của các bộ tộc cổ xưa
                      </li>
                      <li>
                        Vào Hang Thỏ và bước vào một thế giới thần tiên của
                        Alice và gặp lại những nhân vật yêu thích từ tuổi thơ
                      </li>
                      <li>
                        Lạc vào khu rừng thần thoại và cùng Thạch Sách tham gia
                        trận chiến khốc liệt chống lại con mãng xà độc ác và
                        chim khổng lồ
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    Vé VinWonders Phú Quốc
                  </h1>

                  <div className="flex space-x-2 mt-6 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/clock.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>Mở | Thứ, 10:00-19:30</span>
                  </div>

                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/marker-pin-01.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>
                      Khu Bãi Dài, Phú Quốc, Kiên Giang 92512, Vietnam
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <span className="mr-3">Giá từ</span>
                  <span className="text-2xl text-primary font-bold mt-3">
                    {formatCurrency(710000)}
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/ve-vui-choi/chi-tiet/vinwonders-ha-noi/checkout`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <span className="mx-auto text-base font-medium">
                      Đặt ngay
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
