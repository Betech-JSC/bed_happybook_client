import { getServerT } from "@/lib/i18n/getServerT";
import styles from "@/styles/styles.module.scss";
import { Pacifico } from "next/font/google";
import Image from "next/image";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["vietnamese"],
  display: "swap",
});

export default async function VisaSteps() {
  const t = await getServerT();
  return (
    <div className="relative bg-cover bg-center py-12 md:px-3 lg:px-[50px] xl:px[80px]">
      <div className="absolute inset-0 z-[2] w-full">
        <Image src="/visa-step-2.png" width={1440} height={518} alt="Background" className="w-full h-full object-cover object-center" />
      </div>
      <div className="px-3 md:px-0 relative z-10 container mx-auto text-center text-white">
        <h2 className={` text-3xl font-semibold mb-5`}>{t("cac_buoc_lam_visa_tai_happy_book_travel")}</h2>
        <p className="mb-8 lg:w-[40%] mx-auto">{t("lam_visa_don_gian_va_nhanh_chong_voi_doi_ngu_chuyen_nghiep_ho_tro_chuyen_nghiep_tu_khau_chuan_bi_ho_so_den_khi_nhan_visa")}</p>
        <ul className={`h-[666px] md:mt-[64px] md:h-auto md:space-x-3 ${styles.progressbar}`}>
          <li className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}>
            <div className="w-[240px] text-left ml-[86px] md:ml-0 md:text-center md:w-auto ">
              <p className={` ${styles.progressbar__step_title}`}>{t("dang_ky")}</p>
              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">{t("dien_form_thong_tin_don_gian_nhanh_chong_thong_tin_duoc_bao_mat")}</p>
            </div>
          </li>
          <li className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}>
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p className={`  ${styles.progressbar__step_title}`}>{t("lien_he")}</p>

              <div className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">{t("nhan_vien_se_lien_he_voi_ban_trong_vong_2_h_lam_viec_qua_zalocall_hoac_ban_lien_he_hotline_1900633437_nhan_phim_2_zalocall")}</div>
            </div>
          </li>
          <li className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}>
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p className={`  ${styles.progressbar__step_title}`}>{t("tu_van")}</p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">{t("tu_van_hoan_thien_ho_so_nhan_vien_visa_giau_kinh_nghiem_cua_happy_book_se_dong_hanh_huong_dan_ho_tro_ban_suot_qua_trinh_chuan_bi_ho_so")}</p>
            </div>
          </li>
          <li className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}>
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p className={`  ${styles.progressbar__step_title}`}>{t("nop_ho_so")}</p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">{t("sau_khi_ho_so_da_hoan_chinh_nhan_vien_happy_book_nop_ho_so_visa_len_lanh_su_quan_cac_nuoc")}</p>
            </div>
          </li>
          <li className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}>
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p className={`  ${styles.progressbar__step_title}`}>{t("doi_ket_qua")}</p>

              <p className="text-sm font-normal lg:min-w-[200px] m-w-[220px] mt-3">{t("sau_qua_trinh_doi_lsq_xet_duyet_ho_so_nhan_vien_happybook_se_thong_bao_ket_qua_va_chuyen_phat_ho_so_cho_khach_hang")}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
