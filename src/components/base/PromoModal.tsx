"use client";
import { useEffect, useState, useRef } from "react";

export default function PromoModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onReady = () => {
            setTimeout(() => {
                setShow(true);
            }, 5000); // 5s sau DOMContentLoaded
        };

        if (document.readyState === "complete" || document.readyState === "interactive") {
            onReady();
        } else {
            window.addEventListener("DOMContentLoaded", onReady);
        }

        return () => window.removeEventListener("DOMContentLoaded", onReady);
    }, []);

    // Disable scroll khi popup mở
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

    return (
        <div
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row z-[90]">

                {/* Image */}
                <div className="w-full md:w-1/2">
                    <img
                        src="/promotions/buy-ticket.webp"
                        alt="Promo"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-[#F0F8FF] relative">

                    {/* Title */}
                    <h1
                        className="font-black text-3xl sm:text-4xl text-[#F15A24] uppercase tracking-wide"
                        style={{
                            textShadow:
                                "2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF",
                        }}
                    >
                        Mua vé máy bay
                    </h1>

                    <h2 className="font-black text-2xl sm:text-3xl text-[#0055D9] uppercase tracking-wide">
                        Tặng ngay fast track
                    </h2>

                    {/* Description */}
                    <p className="mt-4 text-sm text-gray-600">
                        Nhận ngay dịch vụ Fast Track ưu tiên tại sân bay khi đặt vé máy bay!
                    </p>

                    {/* Action buttons */}
                    <div className="w-full mt-6 space-y-3">
                        <a
                            href="https://happybooktravel.com/ve-may-bay"
                            target="_blank"
                            className="block w-full bg-[#F15A24] text-white font-bold text-lg py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition transform hover:-translate-y-1"
                        >
                            Đặt vé ngay nhé!
                        </a>

                        <a
                            href="http://localhost:3000/mua-ve-may-bay-quoc-te-tang-fast-track"
                            target="_blank"
                            className="block w-full border-2 border-[#0055D9] text-[#0055D9] font-bold text-lg py-3 px-6 rounded-lg hover:bg-[#0055D9] hover:text-white transition"
                        >
                            Xem thêm ưu đãi
                        </a>
                    </div>

                    {/* Footer note */}
                    <div className="mt-6 text-xs text-gray-500">
                        {/* <p>*Áp dụng khi mua vé từ 11/11 - 31/12/2025</p> */}
                        <p className="mt-1">Hotline: 1900 633 437 | Website: happybooktravel.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
