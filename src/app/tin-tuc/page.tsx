import Image from "next/image";
import AosAnimate from "@/components/aos-animate";
import type { Metadata } from "next";
import Link from "next/link";

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
    slug: "123123",
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
    slug: "123123",
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
    slug: "123123",
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
    slug: "123123",
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
    <main className="bg-white mt-[68px] lg:pt-[132px] px-3 lg:px-[80px] pt-6 max__screen">
      <div className="flex space-x-12 lg:h-[670px]">
        <div className="basis-[65%]">
          <div className="posts_new">
            <div>
              <Image
                src={`/posts/new/1.png`}
                alt="Member"
                width={844}
                height={545}
                style={{ width: "844px", height: "545px" }}
              />
            </div>
            <div className="my-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-[#175CD3] font-medium hover:bg-blue-200 duration-300">
                Làm visa
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 leading-8 mt-2">
                Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
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
        <div className="basis-[35%]">
          <div>
            <div>
              <Image
                src={`/posts/new/2.png`}
                alt="Member"
                width={388}
                height={225}
                sizes="100vw"
                style={{ width: "388px", height: "225px" }}
              />
            </div>
            <div className="mt-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300">
                Làm visa
              </p>
              <h3 className="text-base line-clamp-2 font-semibold text-gray-900 mt-2">
                Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
              </h3>
            </div>
          </div>
          <div className="mt-8">
            <div>
              <Image
                src={`/posts/new/3.png`}
                alt="Member"
                width={388}
                height={224}
                sizes="100vw"
                style={{ width: "388px", height: "225px" }}
              />
            </div>
            <div className="mt-3">
              <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300">
                Tin định cư
              </p>
              <h3 className="text-base line-clamp-2 font-semibold text-gray-900 mt-2">
                Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 mb-8 flex space-x-12">
        <div className="basis-[65%]">
          {arrPosts.map((item, index) => (
            <div key={index} className="w-full mt-9">
              <div className="flex justify-between">
                <div>
                  <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
                    {item.category_name}
                  </h3>
                </div>
                <div className="h-10 lg:flex cursor-pointer bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200 duration-300">
                  <button className="text-[#175CD3] font-medium">
                    Xem tất cả
                  </button>
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
                  <div key={key} className="mt-8">
                    <Image
                      className="ease-in duration-300"
                      src={post.image}
                      alt="Tin tức"
                      width={252}
                      height={168}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <p className="text-base font-semibold mt-3 line-clamp-3">
                      {post.title}
                    </p>
                    <p className="text-sm mt-2">{post.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="basis-[35%] mt-9">
          <div className="p-6 border-t-4 border-blue-700 bg-gray-50 rounded-b-2xl">
            <p className="text-2xl font-bold">Chủ đề khác</p>
            <div>
              <Link
                href="#"
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
                  className="mt-3 flex space-x-3 items-center pb-3 border-b-[1px] border-gray-200"
                >
                  <div className="basis-[35%]">
                    <Image
                      className="ease-in duration-300"
                      src={post.image}
                      alt="Tin tức"
                      width={140}
                      height={100}
                      style={{ width: "140px", height: "auto" }}
                    />
                  </div>
                  <div className="basis-[65%]">
                    <p className="text-base font-semibold mt-3 line-clamp-2">
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
