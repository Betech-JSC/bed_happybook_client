"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import clsx from "clsx";
import { GeneralInforPaths } from "@/constants/paths";
import { useLanguage } from "@/contexts/LanguageContext";
import { totalLanguages } from "@/constants/language";
import { useUser } from "@/contexts/UserContext";
import { AuthApi } from "@/api/Auth";
import { useTranslation } from "@/hooks/useTranslation";
import { toSnakeCase } from "@/utils/Helper";
import { useSimDuLichRegions } from "@/hooks/useSimDuLichRegions";

export default function Header() {
  const { t } = useTranslation();
  let headerClass = "";
  const { userInfo } = useUser();
  const inputSearchTourRef = useRef<HTMLInputElement>(null);
  const pathname: string = usePathname();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [querySeach, setQuerySeach] = useState<string>("");
  const [isStickyHeader, setStickyHeader] = useState<boolean>(true);
  const [isSticky, setSticky] = useState<boolean>(false);
  const [isSimDuLichOpen, setIsSimDuLichOpen] = useState(false);
  const simDuLichRef = useRef<HTMLDivElement>(null);
  const simDuLichRegions = useSimDuLichRegions(language);
  const logo = isSticky ? "/logo-footer.svg" : "/logo.svg";
  const excludePaths = [
    "/",
    "/dang-nhap",
    "/dang-ky",
    "/lien-he",
    "/dang-ky-ctv",
    "/tu-van-nhan-visa",
    "/tours",
    "/visa",
    "/combo",
    "/dinh-cu",
    "/ve-may-bay",
    "/ve-may-bay/tim-kiem",
    "/khach-san",
    "/khach-san/tim-kiem",
    "/bao-hiem",
  ];
  const excludePathsRef = useRef(excludePaths);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    if (!excludePathsRef.current.includes(pathname)) {
      setSticky(true);
      setStickyHeader(false);
    } else {
      setSticky(false);
      setStickyHeader(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isStickyHeader) {
      window.addEventListener("scroll", handleScroll);
      if (window.scrollY) setSticky(true);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isStickyHeader]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (simDuLichRef.current && !simDuLichRef.current.contains(event.target as Node)) {
        setIsSimDuLichOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsSimDuLichOpen(false);
  }, [pathname]);

  const activeSimCategory =
    pathname.startsWith("/sim-du-lich/viet-nam")
      ? "viet-nam"
      : pathname.startsWith("/sim-du-lich/quoc-te")
        ? "quoc-te"
        : "";



  return (
    <header
      className={clsx(
        "text-white relative hidden lg:block h-[132px] z-10",
        styles.header__menu,
        headerClass,
        {
          [styles.header__sticky]: isSticky,
        }
      )}
    >
      <div
        className={clsx(
          "text-white fixed hidden lg:block h-[132px] z-10 max__screen w-full left-1/2 -translate-x-1/2"
        )}
      >
        <div className="mx-auto flex justify-between items-center px-4 pb-4 relative lg:px-[50px] xl:px-[80px] sm:px-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                priority
                src={logo}
                alt="Happy Book Logo"
                width={240}
                height={64}
              ></Image>
            </Link>
          </div>

          {/* Search Bar */}
          <form
            className="hidden xl:flex items-center xl:w-[25%]"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              if (pathname !== "/tours/tim-kiem") {
                e.preventDefault();
                router.push(`tim-kiem?keyword=${querySeach}`);
                setQuerySeach("");
                if (inputSearchTourRef.current) {
                  inputSearchTourRef.current.blur();
                }
              }
            }}
          >
            <input
              type="text"
              ref={inputSearchTourRef}
              placeholder={t("tim_theo_diem_den_hoat_dong")}
              onChange={(e) => {
                setQuerySeach(e.target.value);
              }}
              value={querySeach}
              required
              className={`p-2 w-full outline-none rounded-l-lg text-gray-700 h-12 ${styles.header__menu_search}`}
            />
            <button className="bg-blue-500 px-3 rounded-r-lg w-12 h-12">
              <Image
                src="/icon/search.svg"
                alt="Tìm kiếm tour"
                className="h-10"
                width={20}
                height={20}
                style={{ width: 20, height: 20 }}
              ></Image>
            </button>
          </form>

          <div>
            <Link
              href="/ve-chung-toi"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname == "/ve-chung-toi",
              })}
            >
              {t("ve_chung_toi")}
            </Link>
          </div>
          <div>
            <Link
              href="/lien-he"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname == "/lien-he",
              })}
            >
              {t("lien_he")}
            </Link>
          </div>
          <div>
            <Link
              href="/tin-tuc"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/tin-tuc"),
              })}
            >
              {t("tin_tuc")}
            </Link>
          </div>

          <div className={clsx(`relative !h-auto`, styles.header__menu_item)}>
            <button className="flex items-center space-x-1" type="button">
              <Image
                src={`/language/${language}.svg`}
                alt={`Ngôn ngữ ${language}`}
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
                    stroke={isSticky ? "#283448" : "#fff"}
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            <div
              className={`!block !max-h-24 ${styles.header__sub_menu_item}`}
              style={{ display: "block", top: 32 }}
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
                            alt={`Ngôn ngữ ${item.lang}`}
                            className={`h-10 ${item.lang === "vi" ? "rounded-full" : ""
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

          <a
            href="tel:1900633437"
            className={`flex lg:max-h-10 items-center space-x-2 border border-white px-3 py-2 rounded-3xl ${styles.header__menu_phone_contact}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7079 5.00008C12.5218 5.15889 13.2699 5.55696 13.8563 6.14336C14.4427 6.72976 14.8407 7.4778 14.9996 8.29175M11.7079 1.66675C13.399 1.85461 14.9759 2.61189 16.1798 3.81425C17.3836 5.01662 18.1429 6.59259 18.3329 8.28341M8.52204 11.5526C7.52072 10.5513 6.73007 9.41912 6.15007 8.21111C6.10018 8.1072 6.07523 8.05524 6.05607 7.9895C5.98797 7.75587 6.03689 7.46899 6.17856 7.27113C6.21843 7.21546 6.26606 7.16783 6.36132 7.07257C6.65266 6.78123 6.79833 6.63556 6.89356 6.48908C7.25273 5.93667 7.25273 5.22452 6.89356 4.67211C6.79833 4.52563 6.65266 4.37996 6.36132 4.08862L6.19893 3.92623C5.75606 3.48336 5.53462 3.26192 5.29681 3.14164C4.82384 2.90241 4.26529 2.90241 3.79232 3.14164C3.5545 3.26192 3.33307 3.48336 2.8902 3.92623L2.75883 4.05759C2.31748 4.49894 2.09681 4.71962 1.92827 5.01964C1.74125 5.35257 1.60678 5.86964 1.60792 6.25149C1.60894 6.59562 1.67569 6.8308 1.8092 7.30117C2.52668 9.82901 3.8804 12.2143 5.87039 14.2043C7.86037 16.1943 10.2457 17.548 12.7735 18.2655C13.2439 18.399 13.4791 18.4657 13.8232 18.4668C14.205 18.4679 14.7221 18.3334 15.055 18.1464C15.3551 17.9779 15.5757 17.7572 16.0171 17.3158L16.1484 17.1845C16.5913 16.7416 16.8128 16.5202 16.933 16.2824C17.1723 15.8094 17.1723 15.2508 16.933 14.7779C16.8128 14.5401 16.5913 14.3186 16.1484 13.8758L15.9861 13.7134C15.6947 13.422 15.549 13.2764 15.4026 13.1811C14.8502 12.8219 14.138 12.822 13.5856 13.1811C13.4391 13.2764 13.2934 13.422 13.0021 13.7134C12.9069 13.8086 12.8592 13.8562 12.8035 13.8961C12.6057 14.0378 12.3188 14.0867 12.0852 14.0186C12.0194 13.9994 11.9675 13.9745 11.8636 13.9246C10.6556 13.3446 9.52335 12.554 8.52204 11.5526Z"
                stroke={isSticky ? "#175CD3" : "#EAECF0"}
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium">1900-633-437</span>
          </a>
          {!userInfo ? (
            <Link
              href="/dang-nhap"
              className={`bg-blue-600 min-w-[100px] justify-center font-medium lg:max-h-10 transition-all duration-300 hover:text-[#f27145] hover:bg-white border-blue-700 border cursor-pointer flex items-center space-x-2 py-2 px-4 rounded-3xl outline-none`}
            >
              <span> {t("dang_nhap")}</span>
            </Link>
          ) : (
            <div
              className={`relative space-x-2 !h-auto min-w-[100px] max-w-40 justify-center font-medium lg:max-h-10 transition-all duration-300 hover:text-[#f27145] cursor-pointer flex items-center rounded-3xl outline-none
                 ${styles.header__menu_item}`}
            >
              <div
                className={`w-auto whitespace-nowrap text-ellipsis overflow-hidden font-semibold ${isSticky ? "text-gray-700" : "text-white"
                  }`}
              >
                {userInfo.name}
              </div>
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
                    stroke={isSticky ? "#283448" : "#fff"}
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                className={`!max-h-40 w-fit ${styles.header__sub_menu_item} !flex-col gap-2 items-start`}
                style={{
                  display: "flex",
                  top: 40,
                  padding: 12,
                  textAlign: "left",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Link href="/thong-tin-tai-khoan" style={{ margin: 0 }}>
                  {t("thong_tin_tai_khoan")}
                </Link>
                <Link href="/lich-su-dat-ve" style={{ margin: 0 }}>
                  {t("lich_su_dat_hang")}
                </Link>
                <Link href="/thay-doi-mat-khau" style={{ margin: 0 }}>
                  {t("doi_mat_khau")}
                </Link>
                <button
                  className="hover:text-primary duration-300"
                  type="button"
                  onClick={() => {
                    AuthApi.logout();
                  }}
                  style={{ margin: 0 }}
                >
                  {t("dang_xuat")}
                </button>
              </div>
            </div>
          )}

          {/* Menu Button */}
          {/* <div
            className={`${styles.nav_icon} ${isMenuOpen ? styles.open : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div> */}
        </div>
        {/* Navigation */}
        <div className="mx-auto relative lg:px-[50px] xl:px-[80px] sm:px-3">
          <nav className="flex h-[26px] space-x-8">
            <Link
              href="/ve-may-bay"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/ve-may-bay"),
              })}
            >
              {t("ve_may_bay")}
            </Link>

            <Link
              href="/khach-san"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/khach-san"),
              })}
            >
              {t("khach_san")}
            </Link>

            <div
              className={clsx(`relative flex group cursor-pointer`, styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/tours"),
              })}
            >
              <span className="mr-1">
                <Link href="/tours">{t("Tours")}</Link>
              </span>
              <div className="h-5 self-center">
                <svg width="16" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke={isSticky ? "#283448" : "#fff"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-4 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                <div className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider cursor-default">
                  Tours
                </div>
                <div className="flex flex-col space-y-1">
                  <Link href="/tours/tour-noi-dia" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">✈️</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("tour_noi_dia")}</span>
                  </Link>
                  <Link href="/tours/tour-quoc-te" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">✈️</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("tour_quoc_te")}</span>
                  </Link>
                  <Link href="/du-thuyen" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">🛥️</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("du_thuyen")}</span>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/combo"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/combo"),
              })}
            >
              {t("combo")}
            </Link>

            <div
              className={clsx(`relative flex group cursor-pointer`, styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/visa"),
              })}
            >
              <span className="mr-1">
                <Link href="/visa">{t("visa")}</Link>
              </span>
              <div className="h-5 self-center">
                <svg width="16" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke={isSticky ? "#283448" : "#fff"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-4 w-[240px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                <div className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider cursor-default">
                  Visa
                </div>
                <div className="flex flex-col space-y-1">
                  <Link href="/visa" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">🌏</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("danh_sach_visa_cac_nuoc")}</span>
                  </Link>
                  <Link href="/tu-van-nhan-visa" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">💬</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("tu_van_visa_mien_phi")}</span>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/ve-vui-choi"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/ve-vui-choi"),
              })}
            >
              {t("ve_vui_choi")}
            </Link>

            <div
              className={clsx(`relative flex group cursor-pointer`, styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/fast-track") || pathname.startsWith("/bao-hiem") || pathname.startsWith("/sim") || pathname.startsWith("/phong-cho-thuong-gia"),
              })}
            >
              <span className="mr-1">
                {t("tien_ich")}
              </span>
              <div className="h-5 self-center">
                <svg width="16" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke={isSticky ? "#283448" : "#fff"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-5 w-[380px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 before:absolute before:-top-4 before:left-0 before:w-full before:h-4`}
              >
                <div className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider block cursor-default text-left">
                  {t("dich_vu_tien_ich")}
                </div>
                <div className="flex flex-col space-y-2">
                  <Link href="/fast-track" className="!flex items-start gap-4 hover:bg-blue-50 p-3 -mx-3 rounded-xl transition-all duration-300 !h-auto">
                    <img src="/icon/fast-track.png" alt="Fast Track" className="w-[42px] h-[42px] object-contain flex-shrink-0" />
                    <div className="flex flex-col items-start text-left group/item">
                      <div className="text-[#101828] font-bold text-[15px] leading-tight mb-1 group-hover/item:!text-blue-600 transition-colors">{t("fast_track")}</div>
                      <div className="text-gray-500 text-xs leading-relaxed font-normal">{t("ho_tro_lam_thu_tuc_nhanh_chong_tai_san_bay")}</div>
                    </div>
                  </Link>

                  <Link href="/bao-hiem" className="!flex items-start gap-4 hover:bg-blue-50 p-3 -mx-3 rounded-xl transition-all duration-300 !h-auto">
                    <img src="/icon/insurance.png" alt="Bảo hiểm" className="w-[42px] h-[42px] object-contain flex-shrink-0" />
                    <div className="flex flex-col items-start text-left group/item">
                      <div className="text-[#101828] font-bold text-[15px] leading-tight mb-1 group-hover/item:!text-blue-600 transition-colors">{t("bao_hiem")}</div>
                      <div className="text-gray-500 text-xs leading-relaxed font-normal">{t("bao_ve_suc_khoe_va_tai_san_cho_toan_bo_chuyen_di_cua_ban")}</div>
                    </div>
                  </Link>

                  <div ref={simDuLichRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSimDuLichOpen((current) => !current)}
                      className="!flex items-start gap-4 hover:bg-blue-50 p-3 -mx-3 rounded-xl transition-all duration-300 !h-auto text-left"
                    >
                      <img src="/icon/sim.png" alt="Sim du lịch" className="w-[42px] h-[42px] object-contain flex-shrink-0" />
                      <div className="flex flex-col items-start text-left">
                        <div className="text-[#101828] font-bold text-[15px] leading-tight mb-1 transition-colors">
                          {t("sim_du_lich")}
                        </div>
                        <div className="text-gray-500 text-xs leading-relaxed font-normal">
                          {t("internet_toan_cau_voi_muc_gia_re_hon_data_roaming_khong_can_thao_lap_sim")}
                        </div>
                      </div>
                    </button>

                    {isSimDuLichOpen ? (
                      <div className="absolute left-full top-0 ml-3 w-[330px] rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] z-50">
                        <div className="flex flex-col gap-2">
                          {simDuLichRegions.length > 0 ? (
                            simDuLichRegions.map((item) => {
                              const isActive =
                                activeSimCategory &&
                                item.href.toLowerCase().includes(activeSimCategory);

                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsSimDuLichOpen(false)}
                                  className={`rounded-2xl px-4 py-4 text-[18px] font-medium transition-colors ${
                                    isActive
                                      ? "bg-[#EEF4FF] text-blue-600"
                                      : "text-[#101828] hover:bg-[#EEF4FF] hover:text-blue-600"
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              );
                            })
                          ) : (
                            <div className="px-4 py-4 text-sm text-slate-500">
                              {t("Đang tải dữ liệu...")}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <Link href="/phong-cho-thuong-gia" className="!flex items-start gap-4 hover:bg-blue-50 p-3 -mx-3 rounded-xl transition-all duration-300 !h-auto">
                    <img src="/icon/lounge.png" alt="Phòng chờ thương gia" className="w-[42px] h-[42px] object-contain flex-shrink-0" />
                    <div className="flex flex-col items-start text-left group/item">
                      <div className="text-[#101828] font-bold text-[15px] leading-tight mb-1 group-hover/item:!text-blue-600 transition-colors">{t("phong_cho_thuong_gia")}</div>
                      <div className="text-gray-500 text-xs leading-relaxed font-normal">{t("tan_huong_khong_gian_thu_gian_cao_cap_va_tien_nghi_truoc_chuyen_hanh_trinh_sap_toi")}</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className={clsx(`relative flex group cursor-pointer`, styles.header__menu_item)}
            >
              <span className="mr-1">{t("khac")}</span>
              <div className="h-5 self-center">
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke={isSticky ? "#283448" : "#fff"}
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute top-full right-0 bg-white rounded-xl shadow-xl p-4 w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 before:absolute before:-top-4 before:left-0 before:w-full before:h-4">
                <div className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider cursor-default">
                  {t("khac")}
                </div>
                <div className="flex flex-col space-y-1">
                  <Link href="/dang-ky-ctv" className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300">
                    <span className="text-xl">📝</span>
                    <span className="text-[#101828] font-medium text-[14px]">{t("dang_ky_ctv")}</span>
                  </Link>
                  {GeneralInforPaths.map(
                    (
                      item: { title: string; slug: string; url: string },
                      index: number
                    ) => (
                      <Link
                        key={index}
                        href={item.url}
                        className="flex items-center gap-3 hover:bg-blue-50 px-3 py-2 -mx-3 rounded-xl transition-all duration-300"
                      >
                        <span className="text-xl">📄</span>
                        <span className="text-[#101828] font-medium text-[14px]">{t(toSnakeCase(item.title))}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
