// components/UserProfile.tsx
"use client";

import { useUser } from "@/contexts/UserContext";
import AccountSidebar from "../components/AccountSidebar";
import { notFound } from "next/navigation";
import { parseISO, format } from "date-fns";
import { isEmpty } from "lodash";

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: any;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-gray-600 font-bold">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
export default function UserProfile() {
  const { userInfo } = useUser();
  if (!userInfo) notFound();
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="my-8 flex flex-col lg:flex-row gap-4">
        <AccountSidebar userInfo={userInfo} />
        <div className="bg-white shadow rounded-2xl p-6 w-full border-[#AEBFFF] border">
          <h2 className="text-xl font-semibold mb-6">Thông tin tài khoản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-base">
            <InfoItem label="Họ tên" value={userInfo.name} />
            <InfoItem label="Email" value={userInfo.email} />
            <InfoItem
              label="Số điện thoại"
              value={!isEmpty(userInfo.phone) || "Chưa xác định"}
            />
            <InfoItem
              label="Ngày đăng ký"
              value={format(parseISO(userInfo.created_at), "HH:mm dd-MM-yyyy")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
