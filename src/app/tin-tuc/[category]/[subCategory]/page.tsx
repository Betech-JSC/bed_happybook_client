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
import { formatDate, formatMetadata } from "@/lib/formatters";
import SideBar from "../../components/side-bar";
import { Suspense } from "react";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";

type Props = {
  params: { subCategory: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchCategoryDetails(params.subCategory, {});
  return formatMetadata({
    title: data.category?.meta_title ?? data.category?.name,
    description: data.category?.meta_description,
    robots: data.category?.meta_robots,
    keywords: data.category?.meta_keywords,
    alternates: {
      canonical:
        data.category?.canonical_link ?? `/tin-tuc/${data.category?.alias}`,
    },
    openGraph: {
      images: [
        {
          url: data.category?.meta_image ?? "",
          alt: data.category?.meta_title,
        },
      ],
    },
  });
}
export default async function SubCategoryPosts({
  params,
  searchParams,
}: {
  params: { subCategory: string };
  searchParams: SearchParamsProps;
}) {
  const data = await fetchCategoryDetails(params.subCategory, searchParams);
  const category = data.category;
  const posts: PostType[] = data.news.data;
  const totalPages: number = data.news.last_page;
  const currentPage = parseInt(searchParams?.page || "1");
  return (
    <SeoSchema
      article={category}
      type={BlogTypes.NEWS}
      breadscrumbItems={[
        { url: pageUrl("", BlogTypes.NEWS, true), name: "Tin tức" },
        {
          url: pageUrl(category?.alias, BlogTypes.NEWS, true),
          name: category.name,
        },
      ]}
    >
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
                  {category.name}
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
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </div>
          {/* Side bar */}
          <SideBar categories={data.relatedCategories} news={[]} />
        </div>
      </main>
    </SeoSchema>
  );
}
