"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GeneralInforPaths } from "@/constants/paths";
import { totalLanguages } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import clsx from "clsx";
import AccountDropdownMobile from "./AccountDropdownMobile";
import { useTranslation } from "@/hooks/useTranslation";
import { toSnakeCase } from "@/utils/Helper";
import { useMenu } from "@/contexts/MenuContext";

export default function HeaderMobileMenu() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isMenuMbOpen, setIsMenuMbOpen } = useMenu();
  const [menuHeight, setMenuHeight] = useState("0px");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (dropdownRef.current) {
      if (isMenuMbOpen) {
        setMenuHeight(`${dropdownRef.current.scrollHeight}px`);
      } else {
        setMenuHeight("0px");
      }
    }
  }, [isMenuMbOpen, language]);

  useEffect(() => {
    setIsMenuMbOpen(false);
  }, [pathname, setIsMenuMbOpen]);

  return (
    <Fragment>
      <div className="w-[67%] justify-end flex items-center gap-3">
        <div className={clsx(`relative !h-auto`, styles.header__menu_item)}>
          <button className="flex items-center space-x-1" type="button">
            <Image
              src={`/language/${language}.svg`}
              alt="Ngôn ngữ hiện tại"
              className={`h-10 ${language === "vi" ? "rounded-full" : ""}`}
              width={20}
              height={20}
              style={{ width: 20, height: 20 }}
            ></Image>
            <div>
              <svg
                width="22"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke={"#283448"}
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          <div
            className={`!block !max-h-24 ${styles.header__sub_menu_item}`}
            style={{ display: "block", top: 32, left: -36 }}
          >
            {totalLanguages.map(
              (item: any, index: number) =>
                item.lang !== language && (
                  <div key={index}>
                    <button
                      className="flex space-x-1 items-center"
                      onClick={() => setLanguage(item.lang)}
                    >
                      <div>
                        <Image
                          src={`/language/${item.lang}.svg`}
                          alt={item.label}
                          className={`h-10 ${item.lang === "vi" ? "rounded-full" : ""}`}
                          width={20}
                          height={20}
                          style={{ width: 20, height: 20 }}
                        ></Image>
                      </div>
                      <span>{t(toSnakeCase(item.label))}</span>
                    </button>
                  </div>
                )
            )}
          </div>
        </div>
        <div>
          <AccountDropdownMobile />
        </div>
        <div
          className={`${styles.nav_icon} ${isMenuMbOpen ? styles.open : ""} `}
          onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
        >
          <span className="!bg-black"></span>
          <span className="!bg-black"></span>
          <span className="!bg-black"></span>
        </div>
      </div>

      <div
        className={`fixed max-h-[600px] inset-[-1px] flex items-center justify z-50 top-[68px] duration-500 ease-in-out`}
        style={{
          height: menuHeight,
          opacity: isMenuMbOpen ? "1" : "0",
          zIndex: isMenuMbOpen ? "10" : "-1",
          transform: isMenuMbOpen ? "translateY(0)" : "translateY(-50px)",
        }}
      >
        <div
          ref={dropdownRef}
          className={`bg-white text-black overflow-y-scroll shadow-lg w-full h-full px-3`}
        >
          <div className="pb-8">
            {/* 1. Vé máy bay */}
            <Link href="/ve-may-bay" className="block mt-4 hover:text-[#F27145] cursor-pointer font-semibold text-[15px]">
              {t("ve_may_bay")}
            </Link>

            {/* 2. Khách sạn */}
            <Link href="/khach-san" className="block mt-4 hover:text-[#F27145] cursor-pointer font-semibold text-[15px]">
              {t("khach_san")}
            </Link>

            {/* 3. Visa */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{t("visa")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#283448" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Link href="/visa" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("danh_sach_visa_cac_nuoc")}
              </Link>
              <Link href="/tu-van-nhan-visa" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("tu_van_visa_mien_phi")}
              </Link>
            </div>

            {/* 4. Dịch vụ tại sân bay */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{t("dich_vu_tai_san_bay")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#283448" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] text-[14px]">
                <Link href="/fast-track" onClick={() => setIsMenuMbOpen(false)} className="font-medium text-[14px]">{t("don_tien_uu_tien_fast_track")}</Link>
                <div className="flex flex-col mt-1 pl-3 space-y-2 border-l border-gray-200">
                  <Link href="/fast-track/xuat-canh" onClick={() => setIsMenuMbOpen(false)} className="text-gray-500 hover:text-[#F27145] text-[13px]">{t("xuat_canh")}</Link>
                  <Link href="/fast-track/nhap-canh" onClick={() => setIsMenuMbOpen(false)} className="text-gray-500 hover:text-[#F27145] text-[13px]">{t("nhap_canh")}</Link>
                </div>
              </div>
              <Link href="/phong-cho-thuong-gia" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("phong_cho_thuong_gia")}
              </Link>
              <Link href="/thue-xe" onClick={() => setIsMenuMbOpen(false)} className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("dua_don_san_bay")}
              </Link>
              <Link href="/bao-hiem" onClick={() => setIsMenuMbOpen(false)} className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("bao_hiem")}
              </Link>
              <Link href="/flight-radar" onClick={() => setIsMenuMbOpen(false)} className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("flight_radar")}
              </Link>
            </div>

            {/* 5. Vé vui chơi */}
            <Link href="/ve-vui-choi" className="block mt-4 hover:text-[#F27145] cursor-pointer font-semibold text-[15px]">
              {t("ve_vui_choi_hoat_dong")}
            </Link>

            {/* 6. Sim du lịch */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{t("sim_du_lich")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#283448" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Link href="/sim-viet-nam" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("sim_du_lich_viet_nam")}
              </Link>
              <Link href="/sim-du-lich/quoc-te" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("sim_du_lich_quoc_te")}
              </Link>
            </div>

            {/* 7. Tour */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{t("tours")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#283448" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Link href="/tours/tour-noi-dia" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("tour_noi_dia")}
              </Link>
              <Link href="/tours/tour-quoc-te" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("tour_quoc_te")}
              </Link>
            </div>

            {/* 8. Combo */}
            <Link href="/combo" className="block mt-4 hover:text-[#F27145] cursor-pointer font-semibold text-[15px]">
              {t("combo")}
            </Link>

            {/* 9. Du thuyền */}
            <Link href="/du-thuyen" className="block mt-4 hover:text-[#F27145] cursor-pointer font-semibold text-[15px]">
              {t("du_thuyen")}
            </Link>

            {/* 10. Dành cho bạn */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px]">{t("danh_cho_ban")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#283448" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Link href="/dang-ky-ctv" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">
                {t("dang_ky_ctv")}
              </Link>
              {GeneralInforPaths.map(
                (item: { title: string; slug: string; url: string }, index: number) => (
                  <Link
                    key={index}
                    href={item.url}
                    className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]"
                  >
                    {t(toSnakeCase(item.title))}
                  </Link>
                )
              )}
            </div>

            {/* Về Happy Book */}
            <div className="mt-6 border-t border-gray-100 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[15px] text-gray-500">{t("ve_happy_book")}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#9ca3af" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <Link href="/ve-chung-toi" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">{t("ve_chung_toi")}</Link>
              <Link href="/tin-tuc" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">{t("tin_tuc")}</Link>
              <Link href="/lien-he" className="block mt-2 pl-3 text-gray-700 hover:text-[#F27145] cursor-pointer text-[14px]">{t("lien_he_chung_toi")}</Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
