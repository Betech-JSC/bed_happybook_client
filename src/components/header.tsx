"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import clsx from "clsx";

export default function Header() {
  let headerClass = "";
  const [isStickyHeader, setStickyHeader] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const logo = isSticky ? "logo-2.svg" : "logo.svg";
  const pathname = usePathname();

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    if (pathname !== "/") {
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
  return (
    <header className="text-white relative hidden lg:block">
      <div
        className={clsx(
          "text-white fixed hidden lg:block h-[132px] z-10",
          styles.header__menu,
          headerClass,
          {
            [styles.header__sticky]: isSticky,
          }
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
            <Link href="/ve-chung-toi" className={styles.header__menu_item}>
              Về chúng tôi
            </Link>
          </div>
          <div>
            <a href="#" className={styles.header__menu_item}>
              Liên hệ
            </a>
          </div>
          <div>
            <a href="#" className={styles.header__menu_item}>
              Tin tức
            </a>
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
          <a
            className={`bg-blue-600 font-medium lg:max-h-10 transition-all duration-300 hover:text-[#f27145] cursor-pointer flex items-center space-x-2 py-2 px-4 rounded-3xl outline-none`}
          >
            <span>Đăng nhập</span>
          </a>
          {/* Menu Button */}
          <div
            className={`${styles.nav_icon} ${isMenuOpen ? styles.open : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {/* Navigation */}
        <div className="mx-auto relative lg:px-[50px] xl:px-[80px] sm:px-3">
          <nav className="flex h-[26px] space-x-8">
            <a href="#" className={`${styles.header__menu_item}`}>
              Tours
            </a>
            <a href="#" className={`${styles.header__menu_item}`}>
              Vé máy bay
            </a>
            <a href="#" className={`${styles.header__menu_item}`}>
              Visa
            </a>
            <a href="#" className={`${styles.header__menu_item}`}>
              Định cư
            </a>
            <a href="#" className={`${styles.header__menu_item}`}>
              Khách sạn
            </a>
            <a href="#" className={`${styles.header__menu_item}`}>
              Khác
            </a>
          </nav>
        </div>
        {/* Menu */}
        <div className="absolute top-[74px] lg:right-[50px] xl:right-20 z-1 bg-blue-800 ">
          <nav
            className={`flex flex-col  transition-height duration-500 ease-in-out opacity-100 border-gray-300 border-2 py-2 space-y-2 absolute right-0 w-[210px] h-[228px] bg-white text-black px-4 rounded-sm`}
            style={{
              opacity: isMenuOpen ? "1" : "0",
              zIndex: isMenuOpen ? "10" : "-1",
              transform: isMenuOpen ? "translateY(0)" : "translateY(-50px)",
            }}
          >
            <a href="#" className={styles.text_hover_default}>
              Đăng ký CTV
            </a>
            <a href="#" className={styles.text_hover_default}>
              Tư vấn visa
            </a>
            <a href="#" className={styles.text_hover_default}>
              Hướng dẫn thanh toán
            </a>
            <a href="#" className={styles.text_hover_default}>
              Hướng dẫn đặt vé
            </a>
            <a href="#" className={styles.text_hover_default}>
              Thông tin chuyển khoản
            </a>
            <a href="#" className={styles.text_hover_default}>
              Điều khoản sử dụng
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
