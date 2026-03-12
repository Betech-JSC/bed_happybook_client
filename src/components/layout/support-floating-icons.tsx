"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SupportFloatingIcons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id =
      "requestIdleCallback" in window
        ? (window as any).requestIdleCallback(() => setIsVisible(true), {
          timeout: 2000,
        })
        : setTimeout(() => setIsVisible(true), 1500);

    return () => {
      if ("cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(id);
      } else {
        clearTimeout(id as ReturnType<typeof setTimeout>);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes custom-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-email {
          animation: custom-pulse 1.5s infinite ease-in-out;
        }
      `}</style>

      <div className="fixed right-2 bottom-[32%] md:bottom-[33%] -translate-y-1/4 z-[100]">
        <div className="flex flex-col items-center gap-3">
          <a href="tel:1900633437">
            <Image
              src="/gif/phone.gif"
              width={60}
              height={60}
              alt="Hotline hỗ trợ Happy Book"
              unoptimized={true}
            />
          </a>

          <a
            href="mailto:cskh@happybooktravel.com"
            className="animate-email w-[50px] h-[50px] bg-[#1570ef] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.66406 9.33325L13.5506 16.9538C14.4322 17.5709 14.873 17.8795 15.3524 17.999C15.7759 18.1046 16.2189 18.1046 16.6424 17.999C17.1218 17.8795 17.5626 17.5709 18.4442 16.9538L29.3307 9.33325M9.06406 26.6666H22.9307C25.1709 26.6666 26.291 26.6666 27.1467 26.2306C27.8993 25.8471 28.5113 25.2352 28.8948 24.4825C29.3307 23.6269 29.3307 22.5068 29.3307 20.2666V11.7333C29.3307 9.49304 29.3307 8.37294 28.8948 7.51729C28.5113 6.76464 27.8993 6.15272 27.1467 5.76923C26.291 5.33325 25.1709 5.33325 22.9307 5.33325H9.06406C6.82385 5.33325 5.70375 5.33325 4.8481 5.76923C4.09545 6.15272 3.48353 6.76464 3.10004 7.51729C2.66406 8.37294 2.66406 9.49304 2.66406 11.7333V20.2666C2.66406 22.5068 2.66406 23.6269 3.10004 24.4825C3.48353 25.2352 4.09545 25.8471 4.8481 26.2306C5.70375 26.6666 6.82385 26.6666 9.06406 26.6666Z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}