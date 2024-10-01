import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Pagination from "@/components/pagination";
import { fetchCategoryDetails } from "@/api/news";
import { notFound } from "next/navigation";
import { categoryPostsType, PostType } from "@/types/post";
import { formatDate } from "@/lib/formatters";
import SideBar from "../components/side-bar";

export const metadata: Metadata = {
  title: "Làm visa",
  description: "Happy Book",
};

export default async function CategoryPosts({
  params,
}: {
  params: { category: string };
}) {
  const data = await fetchCategoryDetails(params.category);
  const category = data.category;
  if (!category) {
    notFound();
  }
  // const relatedCategories: categoryPostsType[] = data.relatedCategories;
  // const news: PostType[] = data.news.data;
  // const totalPages: number = data.news.last_page;
  const relatedCategories: categoryPostsType[] = [];
  const news: PostType[] = [];
  const totalPages: number = 0;
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
              <Link href="/tin-tuc" className="text-gray-700">
                Tin tức
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row mt-12 md:space-x-16">
        <div className="basis-[65%]">
          <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
            {category.name}
            <div className="mt-6"></div>
          </h3>
          <div className="border-b-[1px] border-gray-300">
            {/* <ul className="flex">
              {category.recursive_children.map((item: categoryPostsType) => (
                <li
                  key={item.id}
                  className="text-sm font-medium text-gray-700 py-[6px] px-[10px] text__default_hover"
                >
                  <Link href={`/tin-tuc/lam-visa/${item.slug}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
          <div className="mt-8">
            <Suspense fallback={<div>Đang tải tin tức...</div>}>
              {news.length > 0 ? (
                news.map((item, index) => (
                  <div
                    key={index}
                    className={`mt-3 mb-6 flex space-x-6 items-center pb-3 ${Post.post__item}`}
                  >
                    <div className="basis-[35%]">
                      <div className="overflow-hidden rounded-xl">
                        <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                          <Image
                            className="ease-in duration-300"
                            src={`/posts/category-posts/${index + 1}.png`}
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
                        className={`text-[18px] leading-[26.1px] ease-in duration-300 font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
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
                <p className="text-center text-xl">
                  Tin tức đang được cập nhật....
                </p>
              )}
            </Suspense>
          </div>
          {/* Paginate */}
          {totalPages > 1 && (
            <div className="my-8 pt-5 border-t-[1px] border-gray-200">
              <Pagination />
            </div>
          )}
        </div>
        {/* Side bar */}
        <SideBar categories={relatedCategories} news={news} />
      </div>
    </main>
  );
}
