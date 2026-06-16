"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const WELCOME10_VOUCHERS = [
  {
    name: "Dịch vụ Fast Track",
    desc: "Đón tiễn ưu tiên tại sân bay quốc tế & nội địa",
    discount: "Giảm 5%",
    url: "/fast-track",
    productType: "fast-track",
    icon: "✈️"
  },
  {
    name: "Dịch vụ Du Thuyền",
    desc: "Trải nghiệm nghỉ dưỡng, ngắm cảnh sang trọng",
    discount: "Giảm 2%",
    url: "/du-thuyen",
    productType: "yacht",
    icon: "🚢"
  },
  {
    name: "Vé Vui Chơi",
    desc: "Vé vào cổng các khu vui chơi giải trí toàn quốc",
    discount: "Giảm 5%",
    url: "/ve-vui-choi",
    productType: "entertainment_ticket",
    icon: "🎡"
  },
  {
    name: "Bảo Hiểm Du Lịch",
    desc: "Bảo hiểm an toàn cho chuyến đi nội địa & quốc tế",
    discount: "Giảm 10%",
    url: "/bao-hiem",
    productType: "insurance",
    icon: "🛡️"
  },
  {
    name: "Dịch vụ Visa",
    desc: "Tư vấn hồ sơ, làm visa nhanh chóng, chuyên nghiệp",
    discount: "Giảm 5%",
    url: "/visa",
    productType: "visa",
    icon: "🛂"
  }
];

const WELCOME50K_VOUCHERS = [
  {
    name: "Phòng Chờ Thương Gia",
    desc: "Phòng chờ VIP sang trọng tại các sân bay lớn",
    discount: "Giảm 50K",
    url: "/phong-cho-thuong-gia",
    productType: "business-lounge",
    icon: "🛋️"
  },
  {
    name: "Sim Du Lịch / eSIM",
    desc: "Sim data kết nối internet quốc tế tốc độ cao",
    discount: "Giảm 50K",
    url: "/sim-du-lich",
    productType: "esim",
    icon: "📱"
  },
  {
    name: "Dịch vụ Fast Track",
    desc: "Đón tiễn ưu tiên tại sân bay quốc tế & nội địa",
    discount: "Giảm 50K",
    url: "/fast-track",
    productType: "fast-track",
    icon: "✈️"
  }
];

export default function PromoModal() {
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState<"banner" | "welcome10" | "welcome50k">("banner");
    const { userInfo } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkFirstTime = async () => {
            try {
                const response = await fetch("/api/auth/is-first-time");
                const data = await response.json();
                if (data.is_first_time) {
                    // Check if already closed in this session to prevent spamming on every route
                    const isClosed = sessionStorage.getItem("first_time_promo_closed");
                    if (isClosed !== "true") {
                        // Show after 2 seconds delay
                        setTimeout(() => {
                            setShow(true);
                        }, 2000);
                    }
                } else {
                    // If not a first time customer, clean up the applied welcome program
                    sessionStorage.removeItem("applied_welcome_program");
                }
            } catch (error) {
                console.error("Error checking first time status:", error);
            }
        };

        checkFirstTime();
    }, [pathname]);

    // Disable scroll when popup is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = ""; // cleanup
        };
    }, [show]);

    if (!show) return null;

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem("first_time_promo_closed", "true");
    };

    const handleApplyVoucher = (voucher: typeof WELCOME10_VOUCHERS[0], programCode: "WELCOME10" | "WELCOME50K") => {
        if (userInfo) {
            // Logged in: save applied welcome program and redirect
            sessionStorage.setItem("applied_welcome_program", programCode);
            handleClose();
            router.push(voucher.url);
        } else {
            // Not logged in: save post login action and redirect to login
            sessionStorage.setItem("post_login_action", JSON.stringify({
                code: programCode,
                productType: voucher.productType,
                redirectUrl: voucher.url
            }));
            handleClose();
            router.push("/dang-nhap");
        }
    };

    const handleBottomAction = () => {
        if (userInfo) {
            // Logged in: prompt they can select a voucher
            handleClose();
        } else {
            // Not logged in: save general login action and redirect to login
            sessionStorage.setItem("post_login_action", JSON.stringify({
                code: "WELCOME10",
                productType: "fast-track",
                redirectUrl: "/fast-track"
            }));
            handleClose();
            router.push("/dang-nhap");
        }
    };

    return (
        <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full transition-all duration-300 ${
                    activeTab === "banner"
                        ? "max-w-2xl bg-transparent flex flex-col items-center"
                        : "max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col p-6 border border-gray-100"
                }`}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className={`absolute text-3xl transition flex items-center justify-center z-[100] ${
                        activeTab === "banner"
                            ? "-top-12 right-2 text-white hover:text-gray-300 bg-black/40 w-10 h-10 rounded-full"
                            : "top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full text-xl"
                    }`}
                >
                    ✕
                </button>

                {activeTab === "banner" ? (
                    <div className="relative w-full h-auto select-none">
                        <img 
                            src="/opt 1.png" 
                            alt="Đăng ký nhận quà" 
                            className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                        />
                        
                        {/* Left Ticket Overlay (WELCOME10 Detail) */}
                        <div 
                            onClick={() => setActiveTab("welcome10")}
                            className="absolute left-[5%] top-[55%] w-[42%] h-[28%] cursor-pointer hover:bg-white/10 rounded-2xl transition-all"
                            title="Chi tiết chương trình Giảm đến 10%"
                        />

                        {/* Right Ticket Overlay (WELCOME50K Detail) */}
                        <div 
                            onClick={() => setActiveTab("welcome50k")}
                            className="absolute right-[5%] top-[55%] w-[42%] h-[28%] cursor-pointer hover:bg-white/10 rounded-2xl transition-all"
                            title="Chi tiết chương trình Tặng 50K"
                        />

                        {/* Bottom Action Button Overlay */}
                        <div 
                            onClick={handleBottomAction}
                            className="absolute left-[15%] bottom-[2%] w-[70%] h-[10%] cursor-pointer hover:scale-[1.02] rounded-full transition-all"
                            title={userInfo ? "Lưu mã ngay" : "Đăng nhập để nhận ưu đãi"}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                            <button 
                                onClick={() => setActiveTab("banner")}
                                className="text-gray-500 hover:text-blue-700 font-bold flex items-center gap-1 text-sm bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition duration-300"
                            >
                                ← Quay lại
                            </button>
                            <h3 className="font-bold text-gray-900 text-lg flex-1 text-right">
                                {activeTab === "welcome10" ? "Đơn đầu giảm đến 10%" : "Voucher tặng 50K"}
                            </h3>
                        </div>

                        {/* Subtitle */}
                        <p className="text-sm text-gray-500 mb-4 bg-blue-50/50 text-blue-700 px-4 py-2.5 rounded-2xl border border-blue-100/50">
                            {activeTab === "welcome10" 
                                ? "✨ Áp dụng riêng biệt cho từng dịch vụ dưới đây cho lượt đặt đầu tiên của thành viên mới."
                                : "🎁 Nhận ngay 50.000đ khi đặt phòng chờ thương gia, eSIM, hoặc dịch vụ Fast Track đầu tiên."
                            }
                        </p>

                        {/* Vouchers List */}
                        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
                            {(activeTab === "welcome10" ? WELCOME10_VOUCHERS : WELCOME50K_VOUCHERS).map((voucher, idx) => (
                                <div 
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-blue-50/40 hover:border-blue-200 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center text-lg flex-shrink-0">
                                            {voucher.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{voucher.name}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate">{voucher.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 ml-3">
                                        <span className={`font-extrabold text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap ${
                                            activeTab === "welcome10" 
                                                ? "bg-orange-100 text-orange-600" 
                                                : "bg-blue-100 text-blue-600"
                                        }`}>
                                            {voucher.discount}
                                        </span>
                                        <button
                                            onClick={() => handleApplyVoucher(voucher, activeTab === "welcome10" ? "WELCOME10" : "WELCOME50K")}
                                            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition duration-300 shadow-sm shadow-blue-500/10 active:scale-95 whitespace-nowrap"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Info */}
                        <div className="mt-5 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
                            * Ưu đãi dành riêng cho lượt đặt đầu tiên của khách hàng mới. Không áp dụng đồng thời các chương trình khác.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
