import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";
import toast from "react-hot-toast";

const path = "/customer";

const AuthApi = {
  register: (data: any) => http.post<any>(`${path}/register`, data),
  logout: async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }
      toast.success("Đăng xuất thành công");
      setTimeout(() => {
        window.location.href = "/dang-nhap";
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    }
  },
};

export { AuthApi };
