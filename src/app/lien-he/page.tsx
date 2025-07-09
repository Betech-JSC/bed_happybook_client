import Image from "next/image";
import type { Metadata } from "next";
import FormContact from "./form";
import SeoSchema from "@/components/schema";
import { pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import Link from "next/link";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl("lien-he", true),
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
  const contentPage = (await PageApi.getContent("lien-he"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function Contact() {
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("lien-he", language))?.payload
    ?.data as any;
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
      <main className="relative h-400px">
        <div
          className="h-[500px] md:h-[700px] w-full -z-[1] absolute"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, #1755DC 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="base__content h-80 md:h-[405px] lg:pr-[200px]">
          <div className="flex justify-between items-center h-full">
            <h1 className="text-32 text-white font-bold">
              {t("lien_he_voi_happy_book")}
            </h1>
            <div>
              <Image
                priority
                src="/about-us/bg.png"
                alt="Background"
                width={273}
                height={273}
                className="w-full h-full md:w-[273px]"
              />
            </div>
          </div>
        </div>
        <div className="h-auto pb-6 w-full bg-gray-100 rounded-2xl top-[-12px]">
          <div className="px-3 pt-10 lg:px-[80px] lg:pt-16">
            <div className="mx-auto p-8 lg:w-[980px] h-auto bg-white rounded-2xl  ">
              <h3 className="text-18 font-semibold">
                {t(
                  "chung_toi_luon_san_sang_lang_nghe_va_ho_tro_ban_neu_co_bat_ky_cau_hoi_nao_hoac_can_tro_giup_dung_ngan_ngai_lien_he_voi_chung_toi_qua_cac_kenh_duoi_day"
                )}
              </h3>
              <div className="mt-3 p-[28px] border border-gray-200 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4 border-b-[1px] border-gray-200">
                  <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/AirplaneTilt.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">
                        {t("hotline_ve_may_bay")}
                      </p>
                      <div className="text-base">
                        <a href="tel:1900633437" className="inline-block">
                          1900.633.437
                        </a>
                        <span>{" -  "}</span>
                        <p>{t("nhan_phim_1")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/passport-outline.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">
                        {t("hotline_visa_ho_chieu")}
                      </p>
                      <a href="tel:1900633437" className="inline-block">
                        1900.633.437
                      </a>
                      <span>{" -  "}</span>
                      <p data-translate="true">{t("nhan_phim_2")}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/bus.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">
                        {t("hotline_tour_du_lich")}
                      </p>
                      <a href="tel:1900633437" className="inline-block">
                        1900.633.437
                      </a>
                      <span>{" -  "}</span>
                      <p data-translate="true">{t("nhan_phim_3")}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4 mt-4 border-b-[1px] border-gray-200">
                  <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/mail-01.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">
                        {t("email_chinh_thuc")}
                      </p>
                      <a
                        href="mailto:info@happybooktravel.com"
                        className="text-base mt-2"
                      >
                        info@happybooktravel.com
                      </a>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/user-square.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">
                        {t("email_tuyen_dung_dang_ky_ctv")}
                      </p>
                      <a
                        href="mailto:HR@happybooktravel.com"
                        className="text-base mt-2 break-all"
                      >
                        HR@happybooktravel.com
                      </a>
                    </div>
                  </div>
                  {/* <div className="flex space-x-4">
                    <div>
                      <Image
                        src="/icon/contact/mail-01.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p
                        className="text-sm font-semibold"
                        data-translate="true"
                      >
                        Email visa - hộ chiếu
                      </p>
                      <p className="text-base mt-2 break-all">
                        visaonline@happybook.com.vn
                      </p>
                    </div>
                  </div> */}
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-2 flex space-x-3">
                    <div>
                      <Image
                        src="/icon/contact/place.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </div>
                    <div className="w-3/4">
                      <p className="text-sm font-semibold">{t("dia_chi")}</p>
                      <p className="text-gray-900">
                        <span className="font-medium">
                          {t("tru_so_chinh")}{" "}
                        </span>
                        <span>
                          {t(
                            "tang_1_phong_phu_tower_9310_quang_trung_khu_pho_1_phuong_tang_nhon_phu_thanh_pho_ho_chi_minh_viet_nam"
                          )}
                        </span>
                      </p>
                      <p className="text-gray-900">
                        <span className="font-medium">{t("chi_nhanh_1")}</span>{" "}
                        <span>
                          {t("124_le_quang_dinh_p_14_q_binh_thanh_tphcm")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {t("theo_doi_chung_toi")}
                    </p>
                    <div className="flex space-x-3 mt-4">
                      <Link
                        href="https://www.facebook.com/happybooktravel"
                        target="_blank"
                      >
                        <Image
                          src="/social/fb.svg"
                          alt="Icon"
                          width={32}
                          height={32}
                        />
                      </Link>
                      <Link
                        href="https://www.tiktok.com/@happybook_visa"
                        target="_blank"
                      >
                        <Image
                          src="/social/tiktok.svg"
                          alt="Icon"
                          width={32}
                          height={32}
                        />
                      </Link>
                      <Link
                        href="https://zalo.me/2451421179976954585/"
                        target="_blank"
                      >
                        <Image
                          src="/social/ytb.svg"
                          alt="Icon"
                          width={32}
                          height={32}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto p-8 mt-8 lg:w-[920px] h-auto bg-white rounded-2xl  ">
              <h3 className="text-18 font-semibold">
                {t(
                  "ban_co_the_gui_thong_tin_yeu_cau_cua_minh_qua_mau_lien_he_duoi_day_va_chung_toi_se_phan_hoi_trong_thoi_gian_som_nhat"
                )}
              </h3>
              <FormContact />
            </div>
            {/* Iframe */}
            <div className="mt-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6352122210205!2d106.7706398107937!3d10.83920325798767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175218fe46ddd97%3A0x5f8c5b870fed6adf!2zxJDhuqFpIEzDvSBWw6kgTcOheSBCYXkgUXXhu5FjIFThur8gdsOgIE7hu5lpIMSQ4buLYSBHacOhIFLhursgfCBoYXBweWJvb2suY29tLnZu!5e0!3m2!1svi!2s!4v1726681819732!5m2!1svi!2s"
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
