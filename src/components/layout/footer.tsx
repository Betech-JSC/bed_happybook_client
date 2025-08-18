import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { GeneralInforPaths } from "@/constants/paths";
import { getServerT } from "@/lib/i18n/getServerT";
import { toSnakeCase } from "@/utils/Helper";

export default async function Footer() {
  const t = await getServerT();
  return (
    <footer className="bg-[#F9FAFB]">
      <div className="max__screen px-3 lg:px-[50px] xl:px-[80px] lg:mt-0  pt-12 pb-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="basis-1/2">
            <div className="pb-12">
              <Image
                src="/logo-footer.svg"
                alt="Icon"
                width={287}
                height={72}
              />
            </div>
            <div>
              <p className="font-bold mr-1 inline-block">
                {t("hotline_ve_may_bay")}
              </p>
              <a href="tel:1900633437" className="inline-block mr-1">
                1900.633.437 - {t("nhan_phim_1")}
              </a>
              {/* <p className="inline-block mr-1">
                (Nội địa)
              </p>
              <p className="inline-block mr-1"> - 1900.633.437 </p>
              <p className="inline-block">
                (Quốc tế)
              </p> */}
            </div>
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                {t("hotline_visa_ho_chieu")}
              </p>
              <a href="tel:1900633437" className="inline-block">
                1900.633.437 - {t("nhan_phim_2")}
              </a>
            </div>
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                {t("hotline_tour_du_lich")}
              </p>
              <a href="tel:1900633437" className="inline-block">
                1900.633.437 - {t("nhan_phim_3")}
              </a>
            </div>
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                {t("email_chinh_thuc")}
              </p>
              <a
                className="inline-block"
                href="mailto:info@happybooktravel.com"
              >
                info@happybooktravel.com
              </a>
            </div>
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                {t("email_tuyen_dung_dang_ky_ctv")}
              </p>
              <a
                href="mailto:HR@happybooktravel.com.vn"
                className="inline-block"
              >
                HR@happybooktravel.com
              </a>
            </div>
            {/* <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                Email visa - hộ chiếu:
              </p>
              <p className="inline-block"> visaonline@happybook.com.vn</p>
            </div> */}
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">{t("tru_so_chinh")}</p>
              <p className="inline">
                {t(
                  "tang_1_phong_phu_tower_9310_quang_trung_khu_pho_1_phuong_tang_nhon_phu_thanh_pho_ho_chi_minh_viet_nam"
                )}
              </p>
            </div>
            <div className="mt-1">
              <p className="font-bold mr-1 inline-block">
                {t("dia_diem_kinh_doanh")}
              </p>
              <p className="inline">
                {t(
                  "blue_sea_tower_205_b_hoang_hoa_tham_phuong_binh_loi_trung_thanh_pho_ho_chi_minh"
                )}
              </p>
            </div>
            {/* <div className="mt-1">
              <p className="font-bold mr-1 inline-block">{t("chi_nhanh_1")}</p>
              <p className="inline-block">
                {t("124_le_quang_dinh_p_binh_thanh_tphcm")}
              </p>
            </div> */}
          </div>
          <div className="mt-12 lg:mt-0 basis-1/2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 md:gap-12">
            <div>
              <p className="font-bold">{t("ve_happy_book")}</p>
              <div className="grid grid-cols-2 md:grid-cols-1">
                <p className={`mt-4 ${styles.text_hover_default}`}>
                  <Link href="/ve-chung-toi">{t("ve_chung_toi")}</Link>
                </p>
                <p className={`mt-3 ${styles.text_hover_default}`}>
                  <Link href="/tin-tuc">{t("tin_tuc")}</Link>
                </p>
                <p className={`mt-3 ${styles.text_hover_default}`}>
                  <Link href="/lien-he">{t("lien_he_chung_toi")}</Link>
                </p>
                <p className={`mt-3 ${styles.text_hover_default}`}>
                  <Link href="/dang-ky-ctv">{t("dang_ky_ctv")}</Link>
                </p>
              </div>
              <div className="hidden md:block">
                <p className="mt-8">
                  <strong>{t("theo_doi_chung_toi")}</strong>
                </p>
                <div className="flex gap-4 mt-4">
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
                  {/* <button>
                  <Image
                    src="/social/zalo.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button> */}
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
            <div>
              <p className="font-bold">{t("dich_vu")}</p>
              <div className="grid grid-cols-2 md:grid-cols-1">
                <Link
                  href="/tours/tour-noi-dia"
                  className={`block mt-4 ${styles.text_hover_default}`}
                >
                  {t("tour_noi_dia")}
                </Link>
                <Link
                  href="/tours/tour-quoc-te"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("tour_quoc_te")}
                </Link>
                {/* <Link
                  href="/tours/tour-du-thuyen"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  Tour du thuyền
                </Link> */}
                <Link
                  href="/ve-may-bay"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("ve_may_bay")}
                </Link>
                <Link
                  href="/visa"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("dich_vu_lam_visa")}
                </Link>
                <Link
                  href="/du-thuyen"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("du_thuyen")}
                </Link>
                <Link
                  href="/ve-vui-choi"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("ve_vui_choi")}
                </Link>
                {/* <Link
                  href="/dinh-cu"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("dinh_cu")}
                </Link> */}
                <Link
                  href="/khach-san"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("khach_san")}
                </Link>
                <Link
                  href="/combo"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("combo")}
                </Link>
                <Link
                  href="/fast-track"
                  className={`block mt-3 ${styles.text_hover_default}`}
                >
                  {t("fast_track")}
                </Link>
              </div>
            </div>
            <div>
              <p className="font-bold">{t("khac")}</p>
              <p className={`mt-4 ${styles.text_hover_default} `}>
                <Link href="/tu-van-nhan-visa">{t("tu_van_visa")}</Link>
              </p>
              {GeneralInforPaths.map(
                (
                  item: { title: string; slug: string; url: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className={`mt-3 ${styles.text_hover_default} `}
                  >
                    <Link href={item.url}>{t(toSnakeCase(item.title))}</Link>
                  </div>
                )
              )}
              <div className="block md:hidden">
                <p className="mt-8">
                  <strong>{t("theo_doi_chung_toi")}</strong>
                </p>
                <div className="flex gap-4 mt-4">
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
                  {/* <button>
                  <Image
                    src="/social/zalo.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button> */}
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
              <p className="mt-8 font-bold">{t("hinh_thuc_thanh_toan")}</p>
              <div className="grid grid-cols-4 md:grid-cols-3 gap-3 mt-4">
                <button>
                  <Image
                    src="/payment/1.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/2.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/3.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/4.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between xl:justify-center xl:space-x-[66px]">
            <Image src="/certifi/1.svg" alt="Icon" width={100} height={32} />
            <Image src="/certifi/2.svg" alt="Icon" width={100} height={32} />
            <Image src="/certifi/3.svg" alt="Icon" width={100} height={32} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="font-bold">
            {t("cong_ty_tnhh_tmdv_du_lich_happybook")}
          </p>
          <p className="text-[12px]">
            {t(
              "ma_so_doanh_nghiep_0314012158_do_so_ke_hoach_dau_tu_tp_hcm_cap_ngay_15092016_cap_thay_doi_ngay_26032024"
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
