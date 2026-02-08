import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import "@/styles/custom.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { notFound } from "next/navigation";
import { Fragment, Suspense } from "react";
import { formatDate, formatMetadata } from "@/lib/formatters";
import { PostType, SearchParamsProps } from "@/types/post";
import SeoSchema from "@/components/schema";
import { BlogTypes, blogUrl, pageUrl } from "@/utils/Urls";
import "@/styles/ckeditor-content.scss";
import { getServerLang } from "@/lib/session";
import SideBar from "../tin-tuc/components/side-bar";
import { getCachedNewsDetail } from "./utils/cached-api";
import dynamic from "next/dynamic";

const BlogContentSection = dynamic(() => import("./components/BlogContentSection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />,
});

type Props = {
  params: { slug: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getCachedNewsDetail(params.slug, {});
  return formatMetadata({
    title: news?.meta_title ?? news?.title,
    description: news?.meta_description,
    robots: news?.meta_robots,
    keywords: news?.keywords,
    alternates: {
      canonical: news?.canonical_link ?? `/${news?.alias}`,
    },
    openGraph: {
      images: [
        {
          url: news?.meta_image
            ? news.meta_image
            : `${news?.image_url}${news?.image_location}`,
          alt: news?.meta_title,
        },
      ],
    },
  });
}
export default async function Posts({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParamsProps;
}) {
  const detail = await getCachedNewsDetail(params.slug, searchParams);
  const relatedNews: PostType[] = detail?.new_relation ?? [];
  if (!detail) {
    notFound();
  }
  const language = await getServerLang();

  return (
    <SeoSchema
      blog={detail}
      breadscrumbItems={[
        {
          url: pageUrl(BlogTypes.NEWS, true),
          name: "Tin tức",
        },
        {
          url: blogUrl(BlogTypes.NEWS, detail.alias, true),
          name: detail.title as string,
        },
      ]}
    >
      <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
        <div className="flex flex-col md:flex-row md:space-x-12 pt-3 mb-8 mt-2">
          <div className="basis-full md:basis-[66%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="text-blue-700"
                      data-translate="true"
                    >
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/tin-tuc"
                      className="text-blue-700"
                      data-translate="true"
                    >
                      Tin tức
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/tin-tuc/${detail.category.alias}`}
                      className="text-blue-700"
                      data-translate="true"
                    >
                      {detail.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="#"
                      className="text-gray-700"
                      data-translate="true"
                    >
                      {detail?.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="h-6 cursor-pointer mt-8 rounded">
              <p
                data-translate="true"
                className="inline-block rounded text-blue-700 py-1 px-2 text-sm font-medium hover:bg-blue-200 duration-300 bg-[#EFF8FF]"
              >
                {detail.category.name}
              </p>
            </div>
            <div className="post__detail mt-4">
              <h1
                className="text-gray-900 text-32 font-bold"
                data-translate="true"
              >
                {detail.title}
              </h1>
              <div className="my-6">
                <Image
                  priority
                  src={detail.image_url + detail.image_location}
                  width={900}
                  height={470}
                  className="max-w-full lg-h[470px] w-full object-cover"
                  alt={detail.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 600px"
                />
              </div>

              {/* Streamed Content with Translations */}
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />}>
                <BlogContentSection detail={detail} language={language} />
              </Suspense>

            </div>
          </div>
          {/* Side bar */}
          <SideBar categories={detail.categories_relation} news={[]} />
        </div>
        {/* Releted Posts */}
        {detail.new_relation?.length > 0 && (
          <div className="mt-8">
            <h3
              className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold"
              data-translate="true"
            >
              Các bài viết liên quan
            </h3>
            <div className="my-8">
              <div className="mt-8 w-full">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {relatedNews.map((post, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/3"
                      >
                        <div key={index} className={`${Post.post__item}`}>
                          <div className="overflow-hidden rounded-xl">
                            <Link href={`/${post.alias}`}>
                              <Image
                                className="ease-in duration-300 lg:h-[256px] object-cover"
                                src={`${post.image_url}/${post.image_location}`}
                                alt="Tin tức"
                                width={410}
                                height={272}
                                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 33vw"
                              />
                            </Link>
                          </div>
                          <Link href={`/${post.alias}`}>
                            <p
                              data-translate="true"
                              className={`min-h-12 ease-in duration-300 text-base font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
                            >
                              {post.title}
                            </p>
                          </Link>
                          <p className="text-sm mt-2">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {relatedNews.length > 3 && (
                    <Fragment>
                      <CarouselPrevious className="hidden lg:inline-flex" />
                      <CarouselNext className="hidden lg:inline-flex" />
                    </Fragment>
                  )}
                </Carousel>
              </div>
            </div>
          </div>
        )}
      </main>
    </SeoSchema>
  );
}
