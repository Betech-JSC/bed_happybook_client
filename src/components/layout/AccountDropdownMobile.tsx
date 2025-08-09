"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { AuthApi } from "@/api/Auth";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountDropdownMobile() {
  const { t } = useTranslation();
  const { userInfo } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <Fragment>
      {!userInfo ? (
        <Link
          href="/dang-nhap"
          className={`bg-blue-600 w-fit justify-center font-medium transition-all duration-300 cursor-pointer flex items-center p-2 rounded-3xl outline-none`}
        >
          <span className="text-xs min-w-16 text-center">{t("dang_nhap")}</span>
        </Link>
      ) : (
        <div ref={dropdownRef} className="relative">
          <div
            className={`flex items-center space-x-1 cursor-pointer `}
            onClick={() => setOpen((prev) => !prev)}
          >
            <User size={20} className="text-gray-900" />
            <svg
              width="22"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#283448"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            className={`absolute z-50 bg-white text-gray-700 shadow-md rounded transition-all duration-300 overflow-hidden w-fit flex flex-col items-start gap-3`}
            style={{
              top: 40,
              left: "0%",
              transform: "translateX(-50%)",
              maxHeight: open ? 160 : 0,
              opacity: open ? 1 : 0,
              padding: open ? 12 : 0,
              pointerEvents: open ? "auto" : "none",
              minWidth: 200,
            }}
          >
            <Link href="/thong-tin-tai-khoan" onClick={() => setOpen(false)}>
              {t("thong_tin_tai_khoan")}
            </Link>
            <Link href="/lich-su-dat-ve" onClick={() => setOpen(false)}>
              {t("lich_su_dat_hang")}
            </Link>
            <Link href="/thay-doi-mat-khau" onClick={() => setOpen(false)}>
              {t("doi_mat_khau")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                AuthApi.logout();
              }}
            >
              {t("dang_xuat")}
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
