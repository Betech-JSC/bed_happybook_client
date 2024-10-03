import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import { fetchNewsIndex } from "@/api/news";
import SideBar from "./components/side-bar";
import { formatDate } from "@/lib/formatters";
import { CategoryPostsType, PostType } from "@/types/post";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Happy Book",
};

export default async function Posts() {
  const data = await fetchNewsIndex();
  const lastestPosts: PostType[] = data.lastestPosts;
  const categoriesWithPosts: CategoryPostsType[] = data.categoriesWithPosts;
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      {lastestPosts.length > 0 && (
        <div className="flex space-x-12 lg:h-[670px] mt-6 lg:mb-12">
          <div className="basis-full lg:basis-[65%]">
            <div className={Post.post__item}>
              <div className="overflow-hidden rounded-xl">
                <Link href={`/tin-tuc/chi-tiet/${lastestPosts[0].alias}`}>
                  <Image
                    src={
                      lastestPosts[0].image_url + lastestPosts[0].image_location
                    }
                    alt={lastestPosts[0].title}
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
                  {lastestPosts[0].category.name ?? ""}
                </p>
                <h3
                  className={`text-2xl ease-in duration-300 font-semibold text-gray-900 leading-8 mt-2 ${Post.post__item_title}`}
                >
                  <Link href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau">
                    {lastestPosts[0].title ?? ""}
                  </Link>
                </h3>
                <div
                  className="text-base mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      lastestPosts[0].description ?? "Nội dung đang cập nhật",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block basis-[35%]">
            {lastestPosts.map((item, index) => {
              return (
                index > 0 && (
                  <div key={item.id} className={`mb-8 ${Post.post__item}`}>
                    <div className="overflow-hidden rounded-xl">
                      <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                        <Image
                          src={item.image_url + item.image_location}
                          alt={item.title}
                          width={388}
                          height={225}
                          sizes="100vw"
                          className="ease-in duration-300"
                          style={{ width: "100%", height: "225px" }}
                        />
                      </Link>
                    </div>
                    <div className="mt-3">
                      <p className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300">
                        {item.category.name ?? ""}
                      </p>
                      <Link
                        href="/tin-tuc/chi-tiet/huong-dan-thu-tuc-xin-visa-di-duc-tham-than-chi-tiet-cho-nguoi-moi-bat-dau"
                        className={`text-base ease-in duration-300 line-clamp-2 font-semibold text-gray-900 mt-2 ${Post.post__item_title}`}
                      >
                        {item.title ?? ""}
                      </Link>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:space-x-12 mt-4 mb-8 lg:mt-12">
        <div className="basis-full md:basis-[65%]">
          {categoriesWithPosts.map((item, index) => (
            <div key={index} className="w-full mb-9">
              <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between">
                <div className="lg:basis-10/12">
                  <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
                    {item.name}
                  </h3>
                </div>
                <div className="lg:basis-2/12 h-10 max-w-fit flex items-center cursor-pointer bg-[#EFF8FF] py-1 px-4 rounded-lg hover:bg-blue-200 duration-300">
                  <Link
                    href={`/tin-tuc/${item.alias}`}
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
              {item.news.length > 0 ? (
                <div className="grid grid-cols-3 gap-[26.33px]">
                  {item.news.map((item, key) => (
                    <div key={key} className={`mt-8 ${Post.post__item}`}>
                      <div className="overflow-hidden rounded-xl">
                        <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                          <Image
                            className="ease-in duration-300"
                            src={item.image_url + item.image_location}
                            alt={item.title}
                            width={252}
                            height={168}
                            style={{ width: "100%", height: "168px" }}
                          />
                        </Link>
                      </div>
                      <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                        <p
                          className={`ease-in duration-300 text-base font-semibold mt-3 line-clamp-3 ${Post.post__item_title}`}
                        >
                          {item.title}
                        </p>
                      </Link>
                      <p className="text-sm mt-2">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xl">Tin tức đang cập nhật...</p>
              )}
            </div>
          ))}
        </div>
        {/* Side bar */}
        <SideBar categories={categoriesWithPosts} news={[]} />
      </div>
    </main>
  );
}
