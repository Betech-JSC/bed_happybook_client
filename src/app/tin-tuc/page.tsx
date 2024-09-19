import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Happy Book",
};
type categoryPosts = {
  category_name: string;
  slug: string;
  posts: post[];
}[];
type post = {
  title: string;
  image: string;
  date: string;
};
const arrPosts: categoryPosts = [
  {
    category_name: "Làm visa",
    slug: "lam-visa",
    posts: [
      {
        title: "Làm Visa Dubai",
        image: "/posts/visa/1.png",
        date: "22/08/2024",
      },
      {
        title: "Làm Visa Pháp",
        image: "/posts/visa/2.png",
        date: "22/08/2024",
      },
      {
        title: "Làm Visa Canada",
        image: "/posts/visa/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Vé máy bay",
    slug: "lam-visa",
    posts: [
      {
        title: "Khi Nào Nên Mua Vé Máy Bay Đi Bắc Kinh Trung Quốc",
        image: "/posts/flight/1.png",
        date: "22/08/2024",
      },
      {
        title: "Vé Máy Bay Đi Trung Quốc",
        image: "/posts/flight/2.png",
        date: "22/08/2024",
      },
      {
        title: "Vé Máy Bay Đi Mỹ",
        image: "/posts/flight/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Tin định cư",
    slug: "lam-visa",
    posts: [
      {
        title: "Chương Trình Định Cư Canada Theo Diện Tay Nghề Cao",
        image: "/posts/settle/1.png",
        date: "22/08/2024",
      },
      {
        title: "Chi Tiết Định Cư Canada Theo Diện Kết Hôn Mới Nhất",
        image: "/posts/settle/2.png",
        date: "22/08/2024",
      },
      {
        title: "Tổng Hợp Các Diện Bảo Lãnh Sang Canada Hiện Nay",
        image: "/posts/settle/3.png",
        date: "22/08/2024",
      },
    ],
  },
  {
    category_name: "Cẩm nang du lịch",
    slug: "lam-visa",
    posts: [
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/1.png",
        date: "22/08/2024",
      },
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/2.png",
        date: "22/08/2024",
      },
      {
        title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
        image: "/posts/travel/3.png",
        date: "22/08/2024",
      },
    ],
  },
];
const popopularPosts: post[] = [
  {
    title: "Vé Máy Bay Đi Trung Quốc",
    image: "/posts/popular/1.png",
    date: "22/08/2024",
  },
  {
    title: "Chương Trình Định Cư Canada Theo Diện Tay Nghề Cao",
    image: "/posts/popular/2.png",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/3.png",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/popular/4.png",
    date: "22/08/2024",
  },
  {
    title: "Làm Visa Pháp",
    image: "/posts/popular/5.png",
    date: "22/08/2024",
  },
];
export default function Posts() {
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="flex space-x-12 lg:h-[670px] mt-6">
        <div className="basis-full lg:basis-[65%]">
          <div className={Post.post__item}>
            <div className="overflow-hidden rounded-xl">
              <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                <Image
                  src={`/posts/new/1.png`}
                  alt="Member"
                  width={844}
                  height={545}
                  className="ease-in duration-300"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
            <div className="my-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-[#175CD3] font-medium hover:bg-blue-200 duration-300">
                Làm visa
              </p>
              <h3
                className={`text-2xl ease-in duration-300 font-semibold text-gray-900 leading-8 mt-2 ${Post.post__item_title}`}
              >
                <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                  Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
                </Link>
              </h3>
              <p className="text-base mt-2 line-clamp-2">
                Việc đặt lịch hẹn visa Mỹ là bước quan trọng trong quá trình xin
                visa, đặc biệt là đối với các diện visa du lịch, công tác. Để
                giúp bạn có một cuộc phỏng vấn suôn sẻ và tăng cơ hội đậu visa,
                dưới đây là hướng dẫn của HappyBook Travel chi tiết về cách
                chuẩn bị giấy tờ, kinh nghiệm phỏng vấn, cũng như quy trình đăng
                ký địa chỉ nhận visa Mỹ gửi về nhà.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block basis-[35%]">
          <div className={Post.post__item}>
            <div className="overflow-hidden rounded-xl">
              <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                <Image
                  src={`/posts/new/2.png`}
                  alt="Member"
                  width={388}
                  height={225}
                  sizes="100vw"
                  className="ease-in duration-300"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
            <div className="mt-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300">
                Làm visa
              </p>
              <Link
                href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau"
                className={`text-base ease-in duration-300 line-clamp-2 font-semibold text-gray-900 mt-2 ${Post.post__item_title}`}
              >
                Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
              </Link>
            </div>
          </div>
          <div className={`mt-8 ${Post.post__item}`}>
            <div className="overflow-hidden rounded-xl">
              <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                <Image
                  src={`/posts/new/3.png`}
                  alt="Member"
                  width={388}
                  height={224}
                  sizes="100vw"
                  className="ease-in duration-300"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
            <div className="mt-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300">
                Tin định cư
              </p>
              <Link
                href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau"
                className={`text-base ease-in duration-300 line-clamp-2 font-semibold text-gray-900 mt-2 ${Post.post__item_title}`}
              >
                Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-12 lg:mt-12 mt-4 mb-8">
        <div className="basis-full md:basis-[65%]">
          {arrPosts.map((item, index) => (
            <div key={index} className="w-full mt-9">
              <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between">
                <div className="lg:basis-10/12">
                  <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
                    {item.category_name}
                  </h3>
                </div>
                <div className="lg:basis-2/12 h-10 max-w-fit flex items-center cursor-pointer bg-[#EFF8FF] py-1 px-4 rounded-lg hover:bg-blue-200 duration-300">
                  <Link
                    href={`/tin-tuc/${item.slug}`}
                    className="text-[#175CD3] font-medium"
                  >
                    Xem tất cả
                  </Link>
                  <Image
                    className="ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-[26.33px]">
                {item.posts.map((post, key) => (
                  <div key={key} className={`mt-8 ${Post.post__item}`}>
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        className="ease-in duration-300"
                        src={post.image}
                        alt="Tin tức"
                        width={252}
                        height={168}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                    <p
                      className={`ease-in duration-300 text-base font-semibold mt-3 line-clamp-3 ${Post.post__item_title}`}
                    >
                      {post.title}
                    </p>
                    <p className="text-sm mt-2">{post.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="basis-full md:basis-[35%] mt-9">
          <div className="hidden md:block p-6 border-t-4 border-blue-700 bg-gray-50 rounded-b-2xl">
            <p className="text-2xl font-bold">Chủ đề khác</p>
            <div>
              <Link
                href="/tin-tuc/lam-visa"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Làm VISA
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Vé máy bay
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Tin định cư
              </Link>
              <Link
                href="#"
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                Cẩm nang du lịch
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
