import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import PostStyle from "@/styles/posts.module.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Pagination from "@/components/pagination";
import { fetchCategoryDetails } from "@/api/news";
import { PostType, SearchParamsProps } from "@/types/post";
import { formatDate } from "@/lib/formatters";
import SideBar from "../../components/side-bar";
import { Suspense } from "react";

type post = {
  title: string;
  image: string;
  description: string | null;
  date: string;
};
export const metadata: Metadata = {
  title: "Visa Đức",
  description: "Happy Book",
};
const categoryPosts: post[] = [
  {
    title: "Cập Nhật Bảng Giá Làm Visa Các Nước Uy Tín Chi Tiết Năm 2024",
    image: "/posts/category-posts/1.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Pháp",
    image: "/posts/category-posts/2.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Canada",
    image: "/posts/category-posts/3.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng dẫn xin visa du lịch Canada tự túc đơn giản cho người mới ",
    image: "/posts/category-posts/4.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Phí gia hạn visa Mỹ là bao nhiêu? Cập nhật thông tin mới nhất ",
    image: "/posts/category-posts/5.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Canada",
    image: "/posts/category-posts/6.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Dubai",
    image: "/posts/category-posts/7.png",
    description: "",
    date: "22/08/2024",
  },
];
const popopularPosts: post[] = [
  {
    title: "Vé Máy Bay Đi Trung Quốc",
    image: "/posts/popular/1.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Chương Trình Định Cư Canada Theo Diện Tay Nghề Cao",
    image: "/posts/popular/2.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/3.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/4.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Pháp",
    image: "/posts/popular/5.png",
    description: "",
    date: "22/08/2024",
  },
];
export default async function SubCategoryPosts({
  params,
  searchParams,
}: {
  params: { subCategory: string };
  searchParams: SearchParamsProps;
}) {
  const category = await fetchCategoryDetails(params.subCategory, searchParams);
  const posts: PostType[] = category.news.data;
  const totalPages: number = category.news.last_page;

  return (
    <main className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
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
              <Link href="/tin-tuc" className="text-blue-700">
                Tin tức
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#" className="text-gray-900">
                Làm VISA
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row mt-12 md:space-x-16">
        <div className="basis-[65%]">
          <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
            Visa Đức
            <div className="mt-6"></div>
          </h3>
          <div className="mt-8">
            <Suspense fallback={<div>Đang tải tin tức...</div>}>
              {posts.length > 0 ? (
                posts.map((item, index) => (
                  <div
                    key={index}
                    className={`mt-3 mb-6 flex space-x-6 items-center pb-3 ${PostStyle.post__item}`}
                  >
                    <div className="basis-[35%]">
                      <div className="overflow-hidden rounded-xl">
                        <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                          <Image
                            className="ease-in duration-300"
                            src={item.image_url + item.image_location}
                            alt="Tin tức"
                            width={140}
                            height={100}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="basis-[63%]">
                      <Link
                        href={`/tin-tuc/chi-tiet/${item.alias}`}
                        className={`text-[18px] leading-[26.1px] ease-in duration-300 font-semibold mt-3 line-clamp-2 ${PostStyle.post__item_title}`}
                      >
                        {item.title}
                      </Link>
                      <div
                        className="text-sm text-gray-700 line-clamp-3 mt-2"
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      ></div>
                      <p className="text-sm mt-2">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xl">Tin tức đang được cập nhật....</p>
              )}
            </Suspense>
          </div>
          {/* Paginate */}
          {totalPages > 1 && (
            <div className="my-8 pt-5 border-t-[1px] border-gray-200">
              {/* <Pagination /> */}
            </div>
          )}
        </div>
        {/* Side bar */}
        <SideBar categories={[]} news={[]} />
      </div>
    </main>
  );
}
