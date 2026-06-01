"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BirthdayRequiredModal() {
  const { t } = useTranslation();
  const { userInfo, setUserInfo } = useUser();
  const router = useRouter();
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);

  const shouldShow = useMemo(() => {
    return Boolean(userInfo && !userInfo.birthday);
  }, [userInfo]);

  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow) {
      setBirthday("");
    }
  }, [shouldShow]);

  if (!shouldShow) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!birthday) {
      toast.error("Vui lòng chọn ngày sinh");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/update-birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthday }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể cập nhật ngày sinh");
      }

      setUserInfo(data.user_info);
      toast.success(data.message || "Cập nhật ngày sinh thành công");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật ngày sinh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="birthday-required-title"
      >
        <div className="mb-6 border-l-4 border-[#ff7a00] pl-4">
          <h2 id="birthday-required-title" className="text-2xl font-bold text-gray-900">
            Cập nhật ngày sinh
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("ngay_sinh")} của bạn chưa được cập nhật. Vui lòng bổ sung để
            tiếp tục sử dụng các chức năng của tài khoản.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="birthday-required-input" className="mb-2 block text-sm font-medium text-gray-800">
              {t("ngay_sinh")}
            </label>
            <input
              id="birthday-required-input"
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 px-3 outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-primary px-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang cập nhật..." : "Lưu ngày sinh"}
          </button>
        </form>
      </div>
    </div>
  );
}
