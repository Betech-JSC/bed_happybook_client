"use client";

import { useUser } from "@/contexts/UserContext";
import AccountSidebar from "../components/AccountSidebar";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Copy, Ticket, Calendar, BadgePercent, CheckCircle2 } from "lucide-react";

interface VoucherData {
  id: number;
  code: string;
  status: "unused" | "used";
  used_at: string | null;
  order_id: number | null;
  object_type: string | null;
  program_name: string;
  discount_type: "amount" | "percent";
  discount_value: number;
  discount_value_dollar: number | null;
  min_order_amount: number;
  min_order_amount_dollar: number | null;
  max_discount_value: number;
  max_discount_value_dollar: number | null;
  start_date: string | null;
  end_date: string | null;
  product_type: string;
}

export default function KhoVoucher() {
  const { userInfo } = useUser();
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [loading, setLoading] = useState(true);

  if (!userInfo) notFound();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch("/api/auth/my-vouchers");
        const resData = await res.json();
        if (res.ok) {
          setVouchers(resData.data || []);
        } else {
          toast.error("Không thể tải danh sách mã giảm giá.");
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        toast.error("Đã xảy ra lỗi khi tải danh sách mã giảm giá.");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "all":
        return "Tất cả dịch vụ";
      case "esim":
        return "Sim du lịch / eSIM";
      case "fast-track":
        return "Dịch vụ Fast Track";
      case "business-lounge":
        return "Phòng chờ thương gia";
      case "yacht":
        return "Du thuyền";
      case "entertainment_ticket":
      case "ticket":
        return "Vé vui chơi";
      case "insurance":
        return "Bảo hiểm du lịch";
      case "visa":
        return "Dịch vụ Visa";
      default:
        return type;
    }
  };

  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="my-8 flex flex-col lg:flex-row gap-4">
        <AccountSidebar userInfo={userInfo} />
        
        <div className="bg-white shadow rounded-2xl p-6 w-full border-[#AEBFFF] border">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Ticket className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Kho voucher của tôi</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Đang tải danh sách voucher...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">Kho voucher trống</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Bạn chưa lưu hoặc nhận mã giảm giá nào. Hãy tham gia các chương trình ưu đãi để nhận quà nhé!
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {vouchers.map((voucher) => {
                  const isUsed = voucher.status === "used";
                  const isPercent = voucher.discount_type === "percent";
                  const displayVal = isPercent 
                    ? `${Math.round(voucher.discount_value)}%` 
                    : `${Math.round(voucher.discount_value / 1000)}K`;

                  const formattedMinOrder = voucher.min_order_amount > 0 
                    ? `Đơn tối thiểu ${voucher.min_order_amount.toLocaleString("vi-VN")}đ` 
                    : "Không giới hạn chi tiêu";

                  const expiryText = voucher.end_date 
                    ? `HSD: ${new Date(voucher.end_date).toLocaleDateString("vi-VN")}` 
                    : "Không giới hạn thời gian";

                  return (
                    <div
                      key={voucher.id}
                      className={`flex flex-col border rounded-2xl overflow-hidden relative transition duration-300 w-full max-w-[320px] mx-auto ${
                        isUsed 
                          ? "border-gray-200 bg-gray-50 opacity-70" 
                          : "border-blue-100 bg-gradient-to-b from-blue-50/20 to-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      {/* Top Coupon Side with Value */}
                      <div
                        className={`flex flex-col items-center justify-center p-6 text-center border-b border-dashed relative ${
                          isUsed 
                            ? "bg-gray-200 text-gray-500 border-gray-300" 
                            : "bg-blue-600 text-white border-blue-200"
                        }`}
                      >
                        {/* Left half circle notch */}
                        <div className="absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border border-gray-200 rounded-full z-10" />
                        {/* Right half circle notch */}
                        <div className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border border-gray-200 rounded-full z-10" />
                        
                        <BadgePercent className="w-8 h-8 mb-2 opacity-95 animate-pulse" />
                        <span className="text-3xl font-black tracking-tight leading-none mb-1">{displayVal}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5 opacity-80">
                          {isPercent ? "Giảm giá" : "Khấu trừ"}
                        </span>
                      </div>

                      {/* Bottom Details Side */}
                      <div className="flex-1 p-5 flex flex-col justify-between min-w-0 bg-white">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                              {voucher.program_name}
                            </h4>
                            {isUsed && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3" /> Đã dùng
                              </span>
                            )}
                          </div>
                          
                          {/* Minimum Spend Condition */}
                          <p className="text-xs text-gray-500 font-medium mb-3">
                            {formattedMinOrder}
                          </p>
                          
                          {/* Product Type applicability badge */}
                          <div className="mb-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isUsed 
                                ? "bg-gray-200 text-gray-600" 
                                : "bg-orange-50 text-orange-600 border border-orange-100"
                            }`}>
                              {getProductTypeLabel(voucher.product_type)}
                            </span>
                          </div>
                        </div>

                        {/* Footer Actions: Code copy & HSD */}
                        <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{expiryText}</span>
                          </div>

                          {!isUsed && (
                            <button
                              onClick={() => handleCopyCode(voucher.code)}
                              className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-white bg-blue-50 hover:bg-primary px-3 py-2 rounded-xl transition duration-300 active:scale-95 w-full border border-blue-100 hover:border-primary shadow-sm hover:shadow-md"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{voucher.code}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
