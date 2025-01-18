import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import HotelDetailTabs from "../../components/HotalDetaiTabs";
import SeoSchema from "@/components/schema";
import { notFound } from "next/navigation";
import { HotelApi } from "@/api/Hotel";
import {
  BlogTypes,
  blogUrl,
  pageUrl,
  ProductTypes,
  productUrl,
} from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import FAQ from "@/components/content-page/FAQ";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const res = (await HotelApi.detail("tesst1")) as any;

  const data = res?.payload.data;
  return formatMetadata({
    title: data?.meta_title ?? data?.title,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: productUrl(data?.slug, ProductTypes.HOTEL, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export default async function HotelDetail({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await HotelApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;
  if (!detail) {
    notFound();
  }
  return (
    <SeoSchema
      product={detail}
      type={ProductTypes.HOTEL}
      breadscrumbItems={[
        {
          url: pageUrl(ProductTypes.HOTEL, true),
          name: "Khách sạn",
        },
        {
          url: productUrl(ProductTypes.HOTEL, detail?.slug, true),
          name: detail?.title as string,
        },
      ]}
    >
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
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
                  <Link href="/khach-san" className="text-blue-700">
                    Khách sạn
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    {detail.name ?? ""}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className=" mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300"
                  src={`${detail.image_url}/${detail.image_location}`}
                  alt="Image"
                  width={700}
                  height={450}
                  sizes="100vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {detail?.gallery?.length > 0 &&
                  detail.gallery.map(
                    (item: any, index: number) =>
                      index <= 4 && (
                        <div
                          className="overflow-hidden rounded-lg h-[220px]"
                          key={index}
                        >
                          <Image
                            className="cursor-pointer w-full h-32 md:h-[220px] rounded-lg hover:scale-110 ease-in duration-300"
                            src={`${item.image_url}${item.image}`}
                            alt="Image"
                            width={320}
                            height={220}
                            sizes="100vw"
                            style={{ height: "100%", width: "100%" }}
                          />
                        </div>
                      )
                  )}
              </div>
            </div>
            <div className="mt-4">
              <HotelDetailTabs data={detail} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white">
          <div className="px-3 lg:px-[80px] max__screen">
            {/* Blog */}
            <div className="mt-8 rounded-2xl bg-gray-50 p-8">
              <h3 className="text-2xl font-bold">
                Tour Trong Nước - Khám Phá Vẻ Đẹp Việt Nam
              </h3>
              <p className="mt-6 line-clamp-3	">
                Việt Nam, với thiên nhiên hùng vĩ và văn hóa đa dạng, là điểm
                đến lý tưởng cho những chuyến tour trong nước. Từ núi rừng Tây
                Bắc hùng vĩ, đồng bằng sông Cửu Long mênh mông, đến bãi biển
                miền Trung tuyệt đẹp, mỗi vùng đất đều mang đến trải nghiệm đáng
                nhớ.
                <span className="block mt-4">
                  Khi lựa chọn tour du lịch trong nước cùng HappyBook, bạn sẽ
                  được khám phá các địa điểm nổi tiếng như Hà Nội cổ kính, Đà
                  Nẵng năng động, Nha Trang biển xanh, hay Phú Quốc thiên đường
                  nhiệt đới. Ngoài ra, các dịch vụ hỗ trợ chuyên nghiệp của
                  chúng tôi sẽ đảm bảo hành trình của bạn luôn trọn vẹn và thú
                  vị.
                </span>
              </p>
              <button className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center">
                <span className="font-medium group-hover:text-primary duration-300">
                  Xem thêm
                </span>
                <svg
                  className="group-hover:stroke-primary stroke-blue-700 duration-300"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* Faq */}
            <div className="my-8">
              <FAQ />
            </div>
            <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
              <h3 className="text-32 font-bold text-center">
                Vì sao nên chọn HappyBook
              </h3>
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/adviser.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Đội ngũ Happybook tư vấn
                      </p>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        hỗ trợ nhiệt tình 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/developers.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Đơn vị hơn 8 năm kinh nghiệm.
                      </p>
                      <p className="text-18 font-semibold text-gray-900">
                        Lấy chữ tín làm đầu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/product-icon.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Sản phẩm đa dạng,
                      </p>
                      <p className="text-18 font-semibold text-gray-900">
                        giá cả tốt nhất
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SeoSchema>
  );
}
