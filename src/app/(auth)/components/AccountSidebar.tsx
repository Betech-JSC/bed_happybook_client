"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { User, Settings, ClipboardList, Lock, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { AuthApi } from "@/api/Auth";
import { useUser } from "@/contexts/UserContext";

export default function AccountSidebar({ userInfo }: any) {
  const { t } = useTranslation();
  const pathname: string = usePathname();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userInfo: contextUserInfo, setUserInfo } = useUser();
  const currentUser = userInfo ?? contextUserInfo;
  const avatarSrc = currentUser?.avatar_url || currentUser?.avatar || "";

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
    { name: "Vé vui chơi & hoạt động", type: "ve-vui-choi" },
    { name: "Fast Track", type: "fast-track" },
    { name: "Khách sạn", type: "khach-san" },
    { name: "Bảo hiểm", type: "bao-hiem" },
    { name: "Combo", type: "combo" },
    { name: "Phòng chờ thương gia", type: "phong-cho-thuong-gia" },
    { name: "Sim Du Lịch", type: "esim" },
  ];

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh đại diện không được vượt quá 2MB");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const response = await AuthApi.uploadAvatar(file);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể cập nhật ảnh đại diện");
      }

      setUserInfo(data.user_info);
      toast.success(data.message || "Cập nhật ảnh đại diện thành công");
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật ảnh đại diện");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="w-full max-w-full lg:max-w-xs flex gap-4 flex-col">
      <div className="border rounded-lg p-4 text-center shadow border-[#AEBFFF]">
        <div className="relative mx-auto h-20 w-20">
          <button
            type="button"
            onClick={openFilePicker}
            className="group relative h-20 w-20 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 transition hover:ring-primary"
            aria-label="Đổi ảnh đại diện"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={currentUser?.name || "Avatar"}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
            )}

            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white transition group-hover:bg-black/30">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5 opacity-0 transition group-hover:opacity-100" />
              )}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-3 text-sm font-semibold text-primary transition hover:opacity-80"
        >
          {uploading ? "Đang tải ảnh..." : "Đổi ảnh đại diện"}
        </button>
        <div className="mt-2 font-semibold text-gray-800">{currentUser?.name}</div>
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
