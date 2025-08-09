"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { User, Settings, ClipboardList, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AccountSidebar({ userInfo }: any) {
  const { t } = useTranslation();
  const pathname: string = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDesktop = window.innerWidth >= 1024;
    if (
      isDesktop &&
      (pathname.startsWith("/lich-su-dat-hang") ||
        pathname.startsWith("/lich-su-dat-ve"))
    ) {
      setOpen(true);
    }
  }, [pathname]);

  const productItems = [
    { name: "Visa", type: "visa" },
    { name: "Tour", type: "tour" },
    { name: "Du thuyền", type: "du-thuyen" },
    { name: "Vé vui chơi", type: "ve-vui-choi" },
    { name: "Fast Track", type: "fast-track" },
    { name: "Khách sạn", type: "khach-san" },
    { name: "Bảo hiểm", type: "bao-hiem" },
    { name: "Combo", type: "combo" },
  ];
  return (
    <div className="w-full max-w-full lg:max-w-xs flex gap-4 flex-col">
      <div className="hidden lg:block border rounded-lg p-4 text-center shadow border-[#AEBFFF]">
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <div className="mt-2 font-semibold text-gray-800">{userInfo?.name}</div>
      </div>

      <div className="border rounded-lg p-5 shadow border-[#AEBFFF]">
        <div className="font-semibold text-gray-800 mb-3">Bảng điều khiển</div>
        <ul className="flex flex-col gap-2 text-base">
          <li
            className={`flex items-center space-x-2 text-gray-700 hover:text-primary duration-300 cursor-pointer ${
              pathname === "/thong-tin-tai-khoan"
                ? "text-primary"
                : "text-gray-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            <Link
              href="/thong-tin-tai-khoan"
              className="hover:text-primary duration-300"
            >
              {t("thong_tin_tai_khoan")}
            </Link>
          </li>
          {/* <li
            className={`flex items-center space-x-2 text-gray-700 hover:text-primary duration-300 cursor-pointer ${
              pathname === "/lich-su-dat-ve" ? "text-primary" : "text-gray-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <Link
              href="/lich-su-dat-ve"
              className="hover:text-primary duration-300"
            >
              {t("lich_su_dat_ve")}
            </Link>
          </li> */}
          <li className="flex flex-col">
            {/* Nút cha */}
            <div
              className={`flex items-center justify-between space-x-2 text-gray-700 hover:text-primary duration-300 cursor-pointer ${
                pathname === "/lich-su-dat-hang"
                  ? "text-primary"
                  : "text-gray-700"
              }`}
              onClick={() => setOpen((prev) => !prev)}
            >
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-4 h-4" />
                <span className="hover:text-primary duration-300">
                  {t("lich_su_dat_hang")}
                </span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <ul className="overflow-hidden pl-6 mt-1 space-y-1 text-sm">
                <li>
                  <Link
                    href={`/lich-su-dat-ve`}
                    className={`block px-2 py-1.5 rounded hover:bg-gray-50 ${
                      pathname === `/lich-su-dat-ve` ? "text-primary" : ""
                    }`}
                  >
                    {t("ve_may_bay")}
                  </Link>
                </li>
                {productItems.map((item) => (
                  <li key={item.type}>
                    <Link
                      href={`/lich-su-dat-hang/${item.type}`}
                      className={`block px-2 py-1.5 rounded hover:bg-gray-50 ${
                        pathname === `/lich-su-dat-hang/${item.type}`
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li
            className={`flex items-center space-x-2 text-gray-700 hover:text-primary duration-300 cursor-pointer ${
              pathname === "/thay-doi-mat-khau"
                ? "text-primary"
                : "text-gray-700"
            }`}
          >
            <Lock className="w-4 h-4" />
            <Link
              href="/thay-doi-mat-khau"
              className="hover:text-primary duration-300"
            >
              {t("doi_mat_khau")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
