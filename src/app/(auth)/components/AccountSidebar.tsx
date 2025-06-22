"use client";
import { User, Settings, ClipboardList, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar({ userInfo }: any) {
  const pathname: string = usePathname();

  return (
    <div className="w-full max-w-full lg:max-w-xs flex gap-4 flex-col">
      <div className="border rounded-lg p-4 text-center shadow border-[#AEBFFF]">
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
              data-translate="true"
            >
              Thông tin tài khoản
            </Link>
          </li>
          <li
            className={`flex items-center space-x-2 text-gray-700 hover:text-primary duration-300 cursor-pointer ${
              pathname === "/lich-su-dat-ve" ? "text-primary" : "text-gray-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <Link
              href="/lich-su-dat-ve"
              className="hover:text-primary duration-300"
              data-translate="true"
            >
              Lịch sử đặt vé
            </Link>
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
              data-translate="true"
            >
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
