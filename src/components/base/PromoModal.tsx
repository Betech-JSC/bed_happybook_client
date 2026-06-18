"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
    const { language } = useLanguage();

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
            // Logged in: claim in DB, save applied welcome program, and redirect
            fetch("/api/auth/claim-welcome-vouchers", { method: "POST" })
                .catch((err) => console.error("Error claiming vouchers in background:", err));

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

    const handleBottomAction = async () => {
        if (userInfo) {
            // Logged in: claim in DB with toast feedback
            const loadToast = toast.loading("Đang lưu mã giảm giá...");
            try {
                const response = await fetch("/api/auth/claim-welcome-vouchers", { method: "POST" });
                const resData = await response.json();
                toast.dismiss(loadToast);
                if (response.ok) {
                    toast.success("Đã lưu mã giảm giá thành công vào tài khoản!");
                } else {
                    toast.error(resData.message || "Không thể lưu mã giảm giá.");
                }
            } catch (error) {
                toast.dismiss(loadToast);
                toast.error("Đã xảy ra lỗi khi lưu mã giảm giá.");
            }
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
                className="relative w-full max-w-lg bg-transparent flex flex-col items-center transition-all duration-300"
            >
                {/* Close Button (only for banner state) */}
                {activeTab === "banner" && (
                    <button
                        onClick={handleClose}
                        className="absolute text-3xl transition flex items-center justify-center z-[100] -top-12 right-2 text-white hover:text-gray-300 bg-black/40 w-10 h-10 rounded-full"
                    >
                        ✕
                    </button>
                )}

                {/* State 1: Banner */}
                {activeTab === "banner" && (
                    <div className="relative w-full h-auto select-none">
                        <img
                            src={language === "en" ? "/POPUPEN.png" : "/POPUPVN.png"}
                            alt="Đăng ký nhận quà"
                            className="w-full h-auto object-contain"
                        />

                        <div
                            onClick={() => setActiveTab("welcome10")}
                            className="absolute left-[5%] top-[55%] w-[42%] h-[28%] cursor-pointer hover:bg-white/10 rounded-2xl transition-all"
                            title="Chi tiết chương trình Giảm đến 10%"
                        />

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
                )}

                {/* State 2: Welcome10 */}
                {activeTab === "welcome10" && (
                    <div className="relative w-full h-auto select-none">
                        <img
                            src={language === "en" ? "/CTR 1 (EN).png" : "/CTR 1 (VN).png"}
                            alt="Đơn đầu giảm đến 10%"
                            className="w-full h-auto object-contain"
                        />

                        {/* Back Button Hotspot */}
                        <div
                            onClick={() => setActiveTab("banner")}
                            className="absolute cursor-pointer hover:bg-black/5 rounded-xl transition-all"
                            style={{ left: "4%", top: "3%", width: "22%", height: "7%" }}
                            title="Quay lại"
                        />

                        {/* Close Button Hotspot */}
                        <div
                            onClick={handleClose}
                            className="absolute cursor-pointer hover:bg-black/5 rounded-full transition-all"
                            style={{ right: "3%", top: "3%", width: "8%", height: "8%" }}
                            title="Đóng"
                        />

                        {/* Fast Track - Index 0 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME10_VOUCHERS[0], "WELCOME10")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "28%", width: "20%", height: "9%" }}
                            title="Áp dụng Fast Track"
                        />

                        {/* Yacht - Index 1 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME10_VOUCHERS[1], "WELCOME10")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "40%", width: "20%", height: "9%" }}
                            title="Áp dụng Du Thuyền"
                        />

                        {/* Entertainment - Index 2 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME10_VOUCHERS[2], "WELCOME10")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "52%", width: "20%", height: "9%" }}
                            title="Áp dụng Vé Vui Chơi"
                        />

                        {/* Insurance - Index 3 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME10_VOUCHERS[3], "WELCOME10")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "64%", width: "20%", height: "9%" }}
                            title="Áp dụng Bảo Hiểm"
                        />

                        {/* Visa - Index 4 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME10_VOUCHERS[4], "WELCOME10")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "76%", width: "20%", height: "9%" }}
                            title="Áp dụng Visa"
                        />
                    </div>
                )}

                {/* State 3: Welcome50k */}
                {activeTab === "welcome50k" && (
                    <div className="relative w-full h-auto select-none">
                        <img
                            src={language === "en" ? "/CTR 2 (EN).png" : "/CTR 2 (VN).png"}
                            alt="Voucher tặng 50K"
                            className="w-full h-auto object-contain"
                        />

                        {/* Back Button Hotspot */}
                        <div
                            onClick={() => setActiveTab("banner")}
                            className="absolute cursor-pointer hover:bg-black/5 rounded-xl transition-all"
                            style={{ left: "4%", top: "3%", width: "22%", height: "7%" }}
                            title="Quay lại"
                        />

                        {/* Close Button Hotspot */}
                        <div
                            onClick={handleClose}
                            className="absolute cursor-pointer hover:bg-black/5 rounded-full transition-all"
                            style={{ right: "3%", top: "3%", width: "8%", height: "8%" }}
                            title="Đóng"
                        />

                        {/* Lounge - Index 0 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME50K_VOUCHERS[0], "WELCOME50K")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "39%", width: "20%", height: "9%" }}
                            title="Áp dụng Phòng Chờ Thương Gia"
                        />

                        {/* Fast Track - Index 1 */}
                        <div
                            onClick={() => handleApplyVoucher(WELCOME50K_VOUCHERS[1], "WELCOME50K")}
                            className="absolute cursor-pointer hover:scale-[1.02] rounded-xl transition-all"
                            style={{ left: "74%", top: "54%", width: "20%", height: "9%" }}
                            title="Áp dụng Fast Track"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
