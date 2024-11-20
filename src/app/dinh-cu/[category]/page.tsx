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
import PostsItem from "../components/PostsItem";
import FormContact from "../components/FormContact";

export const metadata: Metadata = {
  title: "Dịch vụ định cư Mỹ",
  description: "Happy Book",
};
const arrPosts = [
  {
    title: "Bảo lãnh định cư Mỹ diện vợ chồng",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/1.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Dịch vụ bảo lãnh định cư Mỹ diện hôn phu hôn thê",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/2.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện đoàn tụ gia đình",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/3.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Dịch vụ tư vấn bảo lãnh trọn gói định cư Mỹ miễn phí",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/4.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện hôn nhân đồng giới",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/5.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện đoàn tụ gia đình",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/6.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Dịch vụ bảo lãnh định cư Mỹ diện hôn phu hôn thê",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/7.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Dịch vụ tư vấn bảo lãnh trọn gói định cư Mỹ miễn phí",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/8.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện vợ chồng",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/9.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    typeElement: "h2",
  },
];

export default function CompoTour() {
  return (
    <main>
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
                <Link href="/dinh-cu" className="text-blue-700">
                  Định cư
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/tour/noi-dia" className="text-gray-700">
                  Định cư Mỹ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
          <h1 className="text-32 font-bold">Dịch vụ định cư Mỹ</h1>
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

        <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
          {arrPosts.map((item, index) => (
            <div key={index}>
              <PostsItem {...item} />
            </div>
          ))}
        </div>
        <div className="my-8">
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
      <div className=" border-y border-y-gray-300 mt-8 ">
        <div className="lg:px-[50px] xl:px-[80px] py-12 px-3 max__screen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="text-32 font-bold">Tại sao nên chọn Happy Book ?</h3>
            <div>
              HappyBook cung cấp dịch vụ tư vấn định cư chuyên nghiệp, hỗ trợ
              bạn từ giai đoạn chuẩn bị hồ sơ đến khi hoàn thành mọi thủ tục
              pháp lý để đạt được giấc mơ định cư tại các quốc gia phát triển
              như Mỹ, Canada, Úc, Châu Âu,...
            </div>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="flex items-start space-x-3 h-20">
                <Image
                  src="/icon/settle-service/adviser.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Chuyên Nghiệp & Tận Tâm
                  </p>
                  <p>
                    Đội ngũ chuyên gia giàu kinh nghiệm, hỗ trợ tận tình từ A-Z.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 h-20">
                <Image
                  src="/icon/settle-service/icon-quy-trinh.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Quy Trình Minh Bạch
                  </p>
                  <p>
                    Thông tin rõ ràng, quy trình minh bạch, giúp bạn an tâm.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 h-20">
                <Image
                  src="/tour/product-icon.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Giải Pháp Tối Ưu
                  </p>
                  <p>Tư vấn chương trình định cư phù hợp với từng cá nhân.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          {/* Form contact */}
          <div className="py-6">
            <FormContact />
          </div>
        </div>
      </div>
    </main>
  );
}
