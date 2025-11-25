"use client";
import { useEffect, useState } from "react";

export default function PromoModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Key duy nhất cho phiên khuyến mãi này (đổi khi muốn reset)
        const PROMO_KEY = "promo_shown_nov2025";

        // Kiểm tra xem đã có tab nào "chiếm quyền" hiển thị popup chưa
        const alreadyShown = sessionStorage.getItem(PROMO_KEY) === "true";

        if (alreadyShown) {
            return; // Các tab khác vào sau → bỏ qua hoàn toàn
        }

        // Tab này là tab đầu tiên → chiếm quyền hiển thị
        sessionStorage.setItem(PROMO_KEY, "true");

        // Đảm bảo chỉ 1 tab được show (phòng trường hợp race condition)
        let timer: NodeJS.Timeout;

        const startTimer = () => {
            timer = setTimeout(() => {
                setShow(true);
            }, 5000);
        };

        // Chạy ngay nếu DOM đã sẵn sàng
        if (document.readyState === "loading") {
            const onReady = () => {
                startTimer();
                document.removeEventListener("DOMContentLoaded", onReady);
            };
            document.addEventListener("DOMContentLoaded", onReady);
        } else {
            startTimer();
        }

        return () => clearTimeout(timer);
    }, []);

    // Disable scroll khi popup mở
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show]);

    if (!show) return null;

    return (
        <div
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pt-20 pb-20 z-[999]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative max-h-[80vh] overflow-y-auto"
            >
                {/* Close Button - sửa size cho dễ bấm */}
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                    ×
                </button>

                <div className="w-full md:w-1/2">
                    <img
                        src="/promotions/buy-ticket.webp"
                        alt="Khuyến mãi vé máy bay"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center text-center bg-[#F0F8FF]">
                    <h1
                        className="font-black text-3xl sm:text-4xl text-[#F15A24] uppercase tracking-wide"
                        style={{
                            textShadow:
                                "2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF",
                        }}
                    >
                        Mua vé máy bay
                    </h1>

                    <h2 className="font-black text-2xl sm:text-3xl text-[#0055D9] uppercase tracking-wide mt-2">
                        Tặng ngay Fast Track
                    </h2>

                    <p className="mt-4 text-sm text-gray-600">
                        Nhận ngay dịch vụ Fast Track ưu tiên tại sân bay khi đặt vé máy bay!
                    </p>

                    <div className="w-full mt-8 space-y-4">
                        <a
                            href="/ve-may-bay"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#F15A24] text-white font-bold text-lg py-4 rounded-lg shadow-lg hover:bg-orange-600 transition transform hover:-translate-y-1"
                        >
                            Đặt vé ngay nhé!
                        </a>

                        <a
                            href="/mua-ve-may-bay-quoc-te-tang-fast-track"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full border-2 border-[#0055D9] text-[#0055D9] font-bold text-lg py-4 rounded-lg hover:bg-[#0055D9] hover:text-white transition"
                        >
                            Xem thể lệ chương trình
                        </a>
                    </div>

                    <div className="mt-8 text-xs text-gray-500">
                        <p>Hotline: 1900 633 437 | Website: happybooktravel.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}