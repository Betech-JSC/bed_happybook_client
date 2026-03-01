import Image from "next/image";
import Members from "./components/members";
import Service from "./components/service";
import type { Metadata } from "next";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { BannerApi } from "@/api/Banner";
import Partner from "@/components/home/partner";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import PartnerAirlines from "../ve-may-bay/components/Partner";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl("ve-chung-toi", true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}/${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("ve-chung-toi"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function AboutUs() {
  // const members = (await BannerApi.getBannerPage("home-doingu"))?.payload
  //   ?.data as any;
  // const partners = (await BannerApi.getBannerPage("home-doitac"))?.payload
  //   ?.data as any;

  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-chung-toi", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);
  const t = await getServerT();

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
      <main className="bg-white mt-[68px] lg:mt-[132px]">
        {/* <AosAnimate> */}
        <div>
          <Image
            src="/about-us/banner.png"
            alt="Happy Book Logo"
            width={1900}
            height={500}
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>
        {/* </AosAnimate> */}
        {/* <AosAnimate> */}
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="mt-8">
            <h1 className="text-black text-center font-bold text-2xl">
              {t("happy_book_tu_hao_la_doi_tac_tin_cay")}
            </h1>
            <p className="font-medium text-black-700 text-center w-[836px] mx-auto mt-3  max-w-full">
              {t(
                "happy_book_luon_dat_chu_tin_len_hang_dau_voi_su_phat_trien_khong_ngung_chung_toi_da_xay_dung_mot_doi_ngu_chuyen_vien_nang_dong_giau_kinh_nghiem_va_luon_tan_tam_phuc_vu_quy_khach_su_hai_long_cua_khach_hang_la_kim_chi_nam_cho_moi_hoat_dong_cua_chung_toi"
              )}
            </p>
          </div>
          <div className="mt-12">
            <Image
              priority
              src="/about-us/members.png"
              alt="Members"
              width={1280}
              height={562}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-16 items-center ">
            <div>
              <h2 className="text-black font-bold text-2xl">
                {t("10_nam_hinh_thanh_va_phat_trien")}
              </h2>
              <p className="font-medium">
                {t(
                  "happy_book_da_khang_dinh_vi_the_cua_minh_la_dai_ly_cap_1_chuyen_cung_cap_ve_may_bay_trong_nuoc_va_quoc_te_chung_toi_hien_la_doi_tac_uy_tin_cua_nhieu_hang_hang_khong_lon_tai_viet_nam_va_tren_the_gioi_mang_den_cho_khach_hang_nhung_lua_chon_da_dang_va_phu_hop_nhat"
                )}
              </p>
            </div>
            <div>
              <Image
                priority
                src="/about-us/1.png"
                alt="Văn phòng Happy Book"
                width={623}
                height={492}
                sizes="100vw"
              // style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
        <PartnerAirlines />
        {/* {members?.length > 0 && <Members data={members}></Members>} */}
        <Service></Service>

        <div className="bg-[#F9FAFB]">
          <div className="py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <p className="text-[32px] leading-[38.4px] font-bold text-center">
              {t("cam_ket_cua_chung_toi")}
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
                <div>
                  <Image
                    src="/about-us/fi_8898827.svg"
                    alt="Tư vấn chuyên nghiệp"
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                </div>
                <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                  {t("tu_van_chuyen_nghiep_ve_cac_thu_tuc_va_dich_vu")}
                </p>
              </div>
              <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
                <div>
                  <Image
                    src="/about-us/fi_11345966.svg"
                    alt="Giao vé đúng hạn"
                    width={48}
                    height={48}
                    className="mx-auto"
                    style={{ height: "48px", width: "48px" }}
                  />
                </div>
                <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                  {t("giao_ve_theo_yeu_cau_dam_bao_dung_han")}
                </p>
              </div>
              <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
                <div>
                  <Image
                    src="/about-us/fi_5806908.svg"
                    alt="Thanh toán tiện lợi"
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                </div>
                <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                  {t("phuong_thuc_thanh_toan_don_gian_nhanh_chong_va_tien_loi")}
                </p>
              </div>
              <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
                <div>
                  <Image
                    src="/about-us/fi_8898825.svg"
                    alt="Khách hàng hài lòng"
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                </div>
                <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                  {t("mang_den_su_hai_long_toi_da_cho_khach_hang")}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* </AosAnimate> */}
        {/* <AosAnimate> */}
        <div>
          <Image
            priority
            src="/about-us/Contact.png"
            alt="Happy Book Logo"
            width={1900}
            height={500}
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>
        {/* </AosAnimate> */}
      </main>
    </SeoSchema>
  );
}
