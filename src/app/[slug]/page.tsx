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
import { fetchNewsDetail } from "@/api/news";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { formatDate, formatMetadata } from "@/lib/formatters";
import { PostType, SearchParamsProps } from "@/types/post";
import SeoSchema from "@/components/schema";
import { BlogTypes, blogUrl, pageUrl } from "@/utils/Urls";
import "@/styles/ckeditor-content.scss";
import { getServerLang } from "@/lib/session";
import { translateText } from "@/utils/translateApi";
import { renderTextContent } from "@/utils/Helper";
import SideBar from "../tin-tuc/components/side-bar";
import TableOfContents from "../tin-tuc/components/TableOfContents";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";

type Props = {
  params: { slug: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await fetchNewsDetail(params.slug, {});
  return formatMetadata({
    title: news?.meta_title ?? news?.title,
    description: news?.meta_description,
    robots: news?.meta_robots,
    keywords: news?.keywords,
    alternates: {
      canonical: news?.canonical_link ?? `/tin-tuc/chi-tiet/${news?.alias}`,
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
  const detail = await fetchNewsDetail(params.slug, searchParams);
  const relatedNews: PostType[] = detail?.new_relation ?? [];
  if (!detail) {
    notFound();
  }
  const language = await getServerLang();
  let translateData: any = {};
  await translateText(
    [renderTextContent(detail.content), renderTextContent(detail.toc)],
    language
  ).then((data) => {
    translateData.content = data[0];
    translateData.toc = data[1];
  });
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
                    <Link href="/" className="text-blue-700" data-translate>
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
                      data-translate
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
                      className="text-gray-700"
                      data-translate
                    >
                      {detail.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="h-6 cursor-pointer mt-8 rounded">
              <p
                data-translate
                className="inline-block rounded text-blue-700 py-1 px-2 text-sm font-medium hover:bg-blue-200 duration-300 bg-[#EFF8FF]"
              >
                {detail.category.name}
              </p>
            </div>
            <div className="post__detail mt-4">
              <h1 className="text-gray-900 text-32 font-bold" data-translate>
                {detail.title}
              </h1>
              <div className="my-6">
                <Image
                  src={detail.image_url + detail.image_location}
                  width={900}
                  height={470}
                  className="max-w-full lg-h[470px]"
                  alt={detail.title}
                />
              </div>
              <div
                data-translate
                className="mb-8 pb-8 border-b-2 border-gray-200"
              >
                <DisplayContentEditor content={detail?.description} />
              </div>
              <TableOfContents toc={translateData?.toc} />
              {translateData?.content && (
                <div className="post__detail_content md:max-w-[460px] lg:max-w-[820px] overflow-hidden">
                  <DisplayContentEditor content={translateData.content} />
                </div>
              )}
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
              data-translate
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
                                className="ease-in duration-300"
                                src="/posts/related/1.png"
                                alt="Tin tức"
                                width={410}
                                height={272}
                                sizes="100vw"
                              />
                            </Link>
                          </div>
                          <Link href={`/${post.alias}`}>
                            <p
                              data-translate
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
