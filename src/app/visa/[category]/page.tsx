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
import TourStyle from "@/styles/tour.module.scss";
import FAQ from "@/components/FAQ";
import { Fragment } from "react";
import SeoSchema from "@/components/schema";
import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const res = (await VisaApi.getCategory("visa")) as any;

  const data = res?.payload.data;
  return formatMetadata({
    title: data?.meta_title ?? data?.title,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias, BlogTypes.VISA, true),
    },
  });
}

type dataSideBarType = {
  title: string;
  values: {
    id: number;
    title: string;
  }[];
}[];
const dataSideBar: dataSideBarType = [
  {
    title: "Theo điểm đến",
    values: [
      { id: 1, title: "Visa Anh" },
      { id: 2, title: "Visa Mỹ" },
      { id: 3, title: "Visa Nhật Bản" },
      { id: 3, title: "Visa Hàn Quốc" },
      { id: 3, title: "Visa New Zealand" },
    ],
  },
  {
    title: "Theo loại hình visa",
    values: [
      {
        id: 1,
        title: "Du lịch",
      },
      {
        id: 2,
        title: "Công tác",
      },
      {
        id: 3,
        title: "Công tác",
      },
    ],
  },
];

type tourItem = {
  title: string;
  image: number;
  type: string;
};
const arrTours: tourItem[] = [];
const tour: tourItem = {
  title: "Dịch Vụ Hỗ Trợ Làm Thủ Tục Visa Anh",
  image: 0,
  type: "",
};
for (var i = 1; i < 8; i++) {
  const tourItem = { ...tour };
  tourItem.image = i;
  if (i == 1 || i == 4 || i == 5 || i == 7) {
    tourItem.type = "Hot visa";
  }
  arrTours.push(tourItem);
}
export default async function CategoryPosts({
  params,
}: {
  params: { category: string };
}) {
  const res = (await VisaApi.getCategory("visa")) as any;
  const category = res?.payload?.data;

  if (!category) {
    notFound();
  }

  return (
    <SeoSchema
      article={category}
      type={BlogTypes.VISA}
      breadscrumbItems={[
        { url: pageUrl(BlogTypes.VISA, true), name: "Visa" },
        {
          url: pageUrl(category?.alias, BlogTypes.VISA, true),
          name: category?.name,
        },
      ]}
    >
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
                  <Link href="/tour" className="text-blue-700">
                    Dịch vụ Visa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tour/noi-dia" className="text-gray-700">
                    Visa Nhật Bản
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <div className="flex mt-6 md:space-x-4 items-start">
            <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
              {dataSideBar.map((item, index) => (
                <div
                  key={index}
                  className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
                >
                  <p className="font-semibold">{item.title}</p>
                  {item.values.map((value) => {
                    return (
                      value.id < 6 && (
                        <div
                          key={value.id}
                          className="mt-3 flex space-x-2 items-center"
                        >
                          <input
                            type="checkbox"
                            className={TourStyle.custom_checkbox}
                          />
                          <span>{value.title}</span>
                        </div>
                      )
                    );
                  })}
                  {item.values.length > 5 && (
                    <button className="mt-3 flex items-center rounded-lg space-x-3 ">
                      <span className="text-[#175CD3] font-medium">
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
              ))}
            </div>
            <div className="md:w-8/12 lg:w-9/12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="text-32 font-bold">Dịch vụ Visa</h1>
                <div className="flex my-4 md:my-0 space-x-3 items-center">
                  <span>Sắp xếp</span>
                  <div className="w-40 bg-white border border-gray-200 rounded-lg">
                    <select
                      className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                      name=""
                      id=""
                    >
                      <option value="">Mới nhất</option>
                      <option value="">Cũ nhất</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                {arrTours.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4"
                  >
                    <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                      <Link href="/visa/chi-tiet/visa-nhat-ban">
                        <Image
                          className=" hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                          src={`/visa-service/category/${item.image}.png`}
                          alt="Image"
                          width={360}
                          height={270}
                          sizes="100vw"
                        />
                      </Link>
                      {item.type && (
                        <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                          <span>{item.type}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href="/visa/chi-tiet/visa-nhat-ban"
                          className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                        >
                          <h2>{tour.title}</h2>
                        </Link>
                        <div className="mt-3">
                          <span className="font-semibold">Loại Visa:</span>{" "}
                          <span>Du lịch</span>
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">Điểm Đến:</span>{" "}
                          <span>Visa Nhật Bản</span>
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">
                            Thời gian làm Visa:
                          </span>{" "}
                          <span>10 ngày</span>
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">
                            Thời gian lưu trú::
                          </span>{" "}
                          <span>14 ngày</span>
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">
                            Số lần nhập cảnh::
                          </span>{" "}
                          <span>3 tháng 1 lần</span>
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">
                            Phí nộp tại ĐSQ:
                          </span>
                        </div>
                      </div>
                      <div className="text-end mt-3">
                        <p className="line-through text-gray-500">
                          3.000.000 vnđ
                        </p>
                        <p className="mt-2 text-xl text-primary font-semibold">
                          2.500.000 vnđ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 mb-8">
                <button
                  className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
                justify-center items-center hover:border-primary"
                >
                  <span className="font-medium">Xem thêm</span>
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
                </button>
              </div>
            </div>
          </div>
          {/* Section Before Footer */}
        </div>
      </div>
      <div className="px-3 lg:px-[80px] max__screen">
        {/* Blog */}
        <div className="mt-8 rounded-2xl bg-gray-50 p-8">
          <h3 className="text-2xl font-bold">
            Tour Trong Nước - Khám Phá Vẻ Đẹp Việt Nam
          </h3>
          <p className="mt-6 line-clamp-3	">
            Việt Nam, với thiên nhiên hùng vĩ và văn hóa đa dạng, là điểm đến lý
            tưởng cho những chuyến tour trong nước. Từ núi rừng Tây Bắc hùng vĩ,
            đồng bằng sông Cửu Long mênh mông, đến bãi biển miền Trung tuyệt
            đẹp, mỗi vùng đất đều mang đến trải nghiệm đáng nhớ.
            <span className="block mt-4">
              Khi lựa chọn tour du lịch trong nước cùng HappyBook, bạn sẽ được
              khám phá các địa điểm nổi tiếng như Hà Nội cổ kính, Đà Nẵng năng
              động, Nha Trang biển xanh, hay Phú Quốc thiên đường nhiệt đới.
              Ngoài ra, các dịch vụ hỗ trợ chuyên nghiệp của chúng tôi sẽ đảm
              bảo hành trình của bạn luôn trọn vẹn và thú vị.
            </span>
          </p>
          <Link
            href="#"
            className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center"
          >
            <span className="font-medium group-hover:text-primary duration-300">
              Xem thêm
            </span>
            <svg
              className="group-hover:stroke-primary stroke-blue-700 duration-300"
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
          </Link>
        </div>
        {/* Faq */}
        <div className="my-8">
          <FAQ />
        </div>
        <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
          <h3 className="text-32 font-bold text-center">
            Vì sao nên chọn HappyBook
          </h3>
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/adviser.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Đội ngũ Happybook tư vấn
                  </p>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    hỗ trợ nhiệt tình 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/developers.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Đơn vị hơn 8 năm kinh nghiệm.
                  </p>
                  <p className="text-18 font-semibold text-gray-900">
                    Lấy chữ tín làm đầu
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/product-icon.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Sản phẩm đa dạng,
                  </p>
                  <p className="text-18 font-semibold text-gray-900">
                    giá cả tốt nhất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SeoSchema>
  );
}
