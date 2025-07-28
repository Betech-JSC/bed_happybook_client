import Image from "next/image";
import AboutUs from "@/styles/aboutUs.module.scss";
import { getServerT } from "@/lib/i18n/getServerT";
import Link from "next/link";
export default async function Service() {
  const t = await getServerT();
  return (
    <div className=" bg-[#F9FAFB]">
      <div className="py-8 px-3 lg:px-[50px] xl:px-[80px] max__screen">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[32px] font-bold">
              {t("dich_vu_noi_bat_cua_chung_toi")}
            </h2>
            <p className="font-medium">
              {t(
                "happy_book_cam_ket_mang_den_cho_quy_khach_hang_nhung_dich_vu_tot_nhat_voi_chi_phi_hop_ly_bao_gom"
              )}
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/ve-may-bay" className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                {t("dai_ly_ve_may_bay")}
              </p>
              <p className="mt-2 leading-6 text-justify">
                {t(
                  "happy_book_la_don_vi_chuyen_xu_ly_ve_doan_ve_quoc_te_dac_biet_cac_chang_bay_uc_chau_au_my_canada_voi_gia_cuc_ki_tot_giam_sau_toi_50"
                )}
              </p>
              <p className="mt-3 leading-6 text-justify">
                {t(
                  "he_thong_dat_ve_happy_bookcomvn_cung_cap_ve_may_bay_cua_tat_ca_cac_hang_hang_khong_noi_dia_va_quoc_te_voi_thao_tac_don_gian_ho_tro_247"
                )}
              </p>
            </div>
          </Link>
          <Link href="/visa" className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-1.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                {t("ho_so_visa")}
              </p>
              <p className="mt-2 leading-6 text-justify">
                {t(
                  "ho_tro_tu_van_ho_so_visa_cac_nuoc_an_do_dubai_trung_quoc_nhat_han_dai_uc_chau_au_my_canada"
                )}
              </p>
              <p className="mt-3 leading-6 text-justify">
                {t(
                  "chung_toi_tu_hao_la_don_vi_xu_ly_ho_so_visa_khach_hang_mot_cach_logic_giup_ti_le_dau_cao_nhat_voi_chi_phi_xu_ly_cuc_ky_canh_tranh"
                )}
              </p>
            </div>
          </Link>
          <Link href="/khach-san" className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-2.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                {t("khach_san")}
              </p>
              <p className="mt-2 leading-6 text-justify">
                {t(
                  "happy_book_hop_tac_ky_hop_dong_dai_ly_voi_hon_1000_khach_san_tren_toan_quoc_tap_trung_chu_yeu_khach_san_4_sao_5_sao_khu_resort_nghi_duong_combo_ve_may_bay_va_khach_san_cua_happy_book_tap_trung_dong_san_pham_cao_cap_phu_hop_voi_nhom_gia_dinh_giup_khach_hang_co_nhung_trai_nghiem_hai_long"
                )}
              </p>
            </div>
          </Link>
          <Link href="/tours" className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-3.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                {t("tour_du_lich")}
              </p>
              <p className="mt-2 leading-6 text-justify">
                {t(
                  "happ_book_cung_cap_cac_tour_du_lich_quoc_te_chat_luong_gia_ca_canh_tranh_nhat_cac_tour_noi_bat_thai_lan_trung_quoc_han_quoc_nhat_ban_chau_au_my"
                )}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
