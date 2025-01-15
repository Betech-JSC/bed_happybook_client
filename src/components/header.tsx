"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import clsx from "clsx";

export default function Header() {
  let headerClass = "";
  const pathname: string = usePathname();
  const [isStickyHeader, setStickyHeader] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSticky, setSticky] = useState<boolean>(false);
  const subMenuRef = useRef<HTMLDivElement>(null);
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
    setIsMenuOpen(false);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subMenuRef.current &&
        !subMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [subMenuRef]);

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
          <div className="hidden xl:flex items-center xl:w-[25%]">
            <input
              type="text"
              placeholder="Tìm theo điểm đến, hoạt động"
              className={`p-2 w-full rounded-l-lg text-gray-700 h-12 ${styles.header__menu_search}`}
            />
            <button className="bg-blue-500 px-3 rounded-r-lg w-12 h-12">
              <Image
                src="/icon/search.svg"
                alt="Search icon"
                className="h-10"
                width={20}
                height={20}
                style={{ width: 20, height: 20 }}
              ></Image>
            </button>
          </div>

          <div>
            <Link
              href="/ve-chung-toi"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname == "/ve-chung-toi",
              })}
            >
              Về chúng tôi
            </Link>
          </div>
          <div>
            <Link
              href="/lien-he"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname == "/lien-he",
              })}
            >
              Liên hệ
            </Link>
          </div>
          <div>
            <Link
              href="/tin-tuc"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/tin-tuc"),
              })}
            >
              Tin tức
            </Link>
          </div>

          <div className="relative">
            <button className="flex items-center space-x-1">
              <Image
                src="/icon/VN flag.svg"
                alt="Phone icon"
                className="h-10 rounded-full"
                width={22}
                height={20}
                style={{ width: 22, height: 20 }}
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
          </div>

          <a
            href="tel:0983-488-937"
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
            <span className="font-medium">0983-488-937</span>
          </a>
          <Link
            href="/dang-nhap"
            className={`bg-blue-600 font-medium lg:max-h-10 transition-all duration-300 hover:text-[#f27145] cursor-pointer flex items-center space-x-2 py-2 px-4 rounded-3xl outline-none`}
          >
            <span>Đăng nhập</span>
          </Link>
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
            <div
              className={clsx(`relative`, styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/tours"),
              })}
            >
              <Link href="/tours" className="py-4">
                Tours
              </Link>
              <div className={` ${styles.header__sub_menu_item}`}>
                <Link href="/tours/tour-noi-dia">Tour Nội Địa</Link>
                <Link href="/tours/tour-quoc-te">Tour Quốc Tế</Link>
                <Link href="/tours/tour-du-thuyen">Tour Du Thuyền</Link>
              </div>
            </div>

            <Link
              href="/ve-may-bay"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/ve-may-bay"),
              })}
            >
              Vé máy bay
            </Link>
            <Link
              href="/visa"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/visa"),
              })}
            >
              Visa
            </Link>
            <Link
              href="/dinh-cu"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/dinh-cu"),
              })}
            >
              Định cư
            </Link>
            <Link
              href="/khach-san"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/khach-san"),
              })}
            >
              Khách sạn
            </Link>
            <Link
              href="/combo"
              className={clsx(styles.header__menu_item, {
                [styles.active]: pathname.startsWith("/combo"),
              })}
            >
              Combo
            </Link>
            <div
              ref={subMenuRef}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                return false;
              }}
              className={`relative flex cursor-pointer ${styles.header__menu_item}`}
            >
              <span>Khác</span>
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
              {/* Menu */}
              <nav
                className={`absolute -left-full top-12 z-10 ${
                  styles.header__menu_sub_menu
                }  ${
                  isMenuOpen
                    ? "[&>a]:max-h-12 visible"
                    : "[&>a]:max-h-0 invisible"
                }`}
                style={{
                  maxHeight: isMenuOpen ? "240px" : "0px ",
                  opacity: isMenuOpen ? "1" : "0",
                  zIndex: isMenuOpen ? "10" : "-1",
                  transform: isMenuOpen ? "translateY(0)" : "translateY(-50px)",
                }}
              >
                <Link
                  href="/dang-ky-ctv"
                  className={styles.text_hover_default}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Đăng ký CTV
                </Link>
                <Link
                  href="/tu-van-nhan-visa"
                  className={styles.text_hover_default}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Tư vấn visa
                </Link>
                <Link
                  href="/huong-dan-thanh-toan"
                  className={styles.text_hover_default}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Hướng dẫn thanh toán
                </Link>
                <a href="#" className={styles.text_hover_default}>
                  Hướng dẫn đặt vé
                </a>
                <a href="#" className={styles.text_hover_default}>
                  Thông tin chuyển khoản
                </a>
                <a href="#" className={styles.text_hover_default}>
                  Điều khoản sử dụng
                </a>
                <Link
                  href="/chinh-sach-bao-mat"
                  className={styles.text_hover_default}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Chính sách bảo mật
                </Link>
              </nav>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
