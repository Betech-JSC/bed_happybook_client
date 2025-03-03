import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import { newsApi } from "@/api/news";
import SideBar from "./components/side-bar";
import { formatDate, formatMetadata } from "@/lib/formatters";
import { CategoryPostsType, PostType } from "@/types/post";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";

export const metadata: Metadata = formatMetadata({
  title: "Blog - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "Happy Book là đại lý cung cấp dịch vụ làm visa lớn và uy tín hàng đầu Việt Nam",
  alternates: {
    canonical: pageUrl("", BlogTypes.NEWS, true),
  },
});

export default async function Posts() {
  const response = await newsApi.fetchNewsIndex();
  const lastestPosts: PostType[] = response?.payload.data.lastestPosts ?? [];
  const categoriesWithPosts: CategoryPostsType[] =
    response?.payload.data.categoriesWithPosts ?? [];

  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
        {lastestPosts.length > 0 && (
          <div className="flex space-x-12 lg:h-[670px] mt-6 lg:mb-12">
            <div className="basis-full lg:basis-[65%]">
              <div className={Post.post__item}>
                <div className="overflow-hidden rounded-xl">
                  <Link href={`/tin-tuc/chi-tiet/${lastestPosts[0].alias}`}>
                    <Image
                      src={
                        lastestPosts[0].image_url +
                        lastestPosts[0].image_location
                      }
                      alt={lastestPosts[0].title}
                      width={844}
                      height={545}
                      className="ease-in duration-300 w-full lg:h-[545px]"
                      sizes="100vw"
                    />
                  </Link>
                </div>
                <div className="my-3">
                  <p
                    data-translate
                    className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-[#175CD3] font-medium hover:bg-blue-200 duration-300"
                  >
                    {lastestPosts[0].category.name ?? ""}
                  </p>
                  <h3
                    data-translate
                    className={`text-2xl ease-in duration-300 font-semibold text-gray-900 leading-8 mt-2 ${Post.post__item_title}`}
                  >
                    <Link href={`/tin-tuc/chi-tiet/${lastestPosts[0].alias}`}>
                      <h3>{lastestPosts[0].title ?? ""}</h3>
                    </Link>
                  </h3>
                  <div
                    data-translate
                    className="text-base mt-2 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: lastestPosts[0].description
                        ? lastestPosts[0].description
                        : "Nội dung đang cập nhật",
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
                            height={240}
                            sizes="100vw"
                            className="ease-in duration-300"
                            style={{ width: "100%", height: "240px" }}
                          />
                        </Link>
                      </div>
                      <div className="mt-3">
                        <p
                          data-translate
                          className="inline-block text-sm py-1 px-2 rounded-sm bg-[#EFF8FF] text-blue-700 font-medium hover:bg-blue-200 duration-300"
                        >
                          {item.category.name ?? ""}
                        </p>
                        <Link
                          href={`/tin-tuc/chi-tiet/${item.alias}`}
                          className={`text-base ease-in duration-300 line-clamp-2 font-semibold text-gray-900 mt-2 ${Post.post__item_title}`}
                        >
                          <h3 data-translate>{item.title ?? ""}</h3>
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
                    <h2
                      className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold"
                      data-translate
                    >
                      {item.name}
                    </h2>
                  </div>
                  <Link
                    href={`/tin-tuc/${item.alias}`}
                    className="lg:basis-2/12 h-10  text-[#175CD3] font-medium max-w-fit flex items-center cursor-pointer bg-[#EFF8FF] py-1 px-4 rounded-lg hover:bg-blue-200 duration-300"
                  >
                    <span data-translate>Xem tất cả</span>
                    <Image
                      className="ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                {item.news.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-[26.33px]">
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
                          <h3
                            data-translate
                            className={`ease-in duration-300 text-base font-semibold mt-3 line-clamp-3 ${Post.post__item_title}`}
                          >
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm mt-2">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xl" data-translate>
                    Tin tức đang cập nhật...
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* Side bar */}
          <SideBar categories={categoriesWithPosts} news={[]} />
        </div>
      </main>
    </SeoSchema>
  );
}
