import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Pagination from "@/components/pagination";
import { fetchNewsByCategory } from "@/api/news";

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
}: {
  params: { subCategory: string };
}) {
  const data = await fetchNewsByCategory(params.subCategory);
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
            {categoryPosts.map((post, index) => (
              <div
                key={index}
                className={`mt-3 mb-6 flex space-x-6 items-center pb-3 ${Post.post__item}`}
              >
                <div className="basis-[35%]">
                  <div className="overflow-hidden rounded-xl">
                    <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                      <Image
                        className="ease-in duration-300"
                        src={post.image}
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
                    href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau"
                    className={`text-[18px] leading-[26.1px] ease-in duration-300 font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-700 line-clamp-3 mt-2">
                    {index == 0
                      ? `Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau,
                  nếu bạn không thành thạo việc xin visa ra nước ngoài, thì
                    quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu
                    sót.`
                      : `Việc đặt lịch hẹn visa Mỹ là bước quan trọng trong quá
                    trình xin visa, đặc biệt là đối với các diện visa du lịch,
                    công tác. Để giúp bạn có một cuộc phỏng vấn suôn sẻ và tăng
                    cơ hội đậu visa, dưới đây là hướng dẫn của HappyBook Travel
                    chi tiết về cách chuẩn bị giấy tờ, kinh nghiệm phỏng vấn,
                    cũng như quy trình đăng ký địa chỉ nhận visa Mỹ gửi về nhà.`}
                  </p>
                  <p className="text-sm mt-2">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Paginate */}
          <div className="my-8 pt-5 border-t-[1px] border-gray-200">
            <Pagination />
          </div>
        </div>
        <div className="basis-full md:basis-[35%]">
          <div className="hidden md:block p-6 border-t-4 border-blue-700 bg-gray-50 rounded-b-2xl">
            <p className="text-2xl font-bold">Những danh mục khác</p>
            <div>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                VISA Pháp
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                VISA Anh
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                VISA Trung Quốc
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                VISA Mỹ
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">Bài viết phổ biến</p>
            <div>
              {popopularPosts.map((post: post, key: number) => (
                <div
                  key={key}
                  className={`mt-3 flex space-x-3 items-center pb-3 border-b-[1px] border-gray-200 ${Post.post__item}`}
                >
                  <div className="basis-[35%]">
                    <div className="overflow-hidden rounded-sm">
                      <Image
                        className="ease-in duration-300"
                        src={post.image}
                        alt="Tin tức"
                        width={140}
                        height={100}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                  <div className="basis-[65%]">
                    <p
                      className={`text-base ease-in duration-300 font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
                    >
                      {post.title}
                    </p>
                    <p className="text-sm mt-2">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
