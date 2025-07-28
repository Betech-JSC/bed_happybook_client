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
export default function HeaderMobileMenu() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuMbOpen, setIsMenuMbOpen] = useState(false);
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
  }, [isMenuMbOpen]);

  useEffect(() => {
    setIsMenuMbOpen(false);
  }, [pathname]);
  return (
    <Fragment>
      <div className="w-[67%] justify-end flex items-center gap-3">
        <div className={clsx(`relative !h-auto`, styles.header__menu_item)}>
          <button className="flex items-center space-x-1" type="button">
            <Image
              src={`/language/${language}.svg`}
              alt="Icon"
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
                          alt="Icon"
                          className={`h-10 ${
                            item.lang === "vi" ? "rounded-full" : ""
                          }`}
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
      {/* Mobile Menu */}
      <div
        className={`fixed max-h-[600px] inset-[-1px] flex items-center justify z-50  top-[69px] duration-500 ease-in-out`}
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
          <div>
            <p className="mt-3">
              <strong>{t("dich_vu")}</strong>
            </p>
            <Link
              href="/ve-may-bay"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("ve_may_bay")}
            </Link>
            <Link
              href="/tours/tour-noi-dia"
              className="block mt-4 cursor-pointer hover:text-[#F27145]"
            >
              {t("tour_noi_dia")}
            </Link>
            <Link
              href="/tours/tour-quoc-te"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("tour_quoc_te")}
            </Link>
            <Link
              href="/du-thuyen"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("du_thuyen")}
            </Link>
            {/* <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay quốc tế
            </p> */}
            <Link
              href="/visa"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("dich_vu_lam_visa")}
            </Link>
            {/* <Link
              href="/dinh-cu"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("dinh_cu")}
            </Link> */}
            <Link
              href="/khach-san"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("khach_san")}
            </Link>
            <Link
              href="/combo"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("combo")}
            </Link>
            <Link
              href="/fast-track"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              {t("fast_track")}
            </Link>
          </div>
          <div className="mt-6">
            <p>
              <strong> {t("ve_happy_book")}</strong>
            </p>
            <p className="mt-4 hover:text-[#F27145] cursor-pointer">
              <Link href="/ve-chung-toi"> {t("ve_chung_toi")}</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/tin-tuc"> {t("tin_tuc")}</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/lien-he"> {t("lien_he_chung_toi")}</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/dang-ky-ctv"> {t("dang_ky_ctv")}</Link>
            </p>
          </div>
          <div className="my-6">
            <p>
              <strong> {t("khac")}</strong>
            </p>
            <div className="mt-4 hover:text-[#F27145] cursor-pointer">
              <Link href="/tu-van-nhan-visa"> {t("tu_van_visa")}</Link>
            </div>
            {GeneralInforPaths.map(
              (
                item: { title: string; slug: string; url: string },
                index: number
              ) => (
                <div
                  key={index}
                  className="mt-4 hover:text-[#F27145] cursor-pointer"
                >
                  <Link href={item.url}>{t(toSnakeCase(item.title))}</Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
