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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TableOfContents from "./components/table-content";
import { fetchNewsDetail } from "@/api/news";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { formatDate } from "@/lib/formatters";
import SideBar from "../../components/side-bar";
import { PostType } from "@/types/post";

type Props = {
  params: { slug: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await fetchNewsDetail(params.slug);

  return {
    title: news?.title,
    openGraph: {
      title: news?.title,
      description: news?.description,
      url: "",
      siteName: "Local Host",
      images: [
        {
          url: "",
          width: 800,
          height: 600,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
  };
}
export default async function Posts({ params }: Props) {
  const detail = await fetchNewsDetail(params.slug);
  const relatedNews: PostType[] = detail?.new_relation ?? [];
  if (!detail) {
    notFound();
  }
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="flex flex-col md:flex-row md:space-x-12 pt-3 mb-8">
        <div className="basis-full md:basis-[66%]">
          <Breadcrumb>
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
                  <Link href="/tin-tuc/lam-visa" className="text-blue-700">
                    Làm VISA
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Visa Đức
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="h-6 cursor-pointer mt-8 rounded">
            <p className="inline-block rounded text-blue-700 py-1 px-2 text-sm font-medium hover:bg-blue-200 duration-300 bg-[#EFF8FF]">
              {detail.category.name}
            </p>
          </div>
          <div className="post__detail mt-4">
            <div
              className="mt-6 post__detail_content"
              dangerouslySetInnerHTML={{
                __html: detail.content,
              }}
            ></div>
          </div>
        </div>
        {/* Side bar */}
        <SideBar categories={[]} news={[]} />
      </div>
      {/* Releted Posts */}
      {detail.new_relation?.length > 0 && (
        <div className="mt-8">
          <h3 className="pl-2 border-l-4 border-[#F27145] text-3xl font-bold">
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
                          <Link href={`/tin-tuc/chi-tiet/${post.alias}`}>
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
                        <Link href={`/tin-tuc/chi-tiet/${post.alias}`}>
                          <p
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
  );
}
