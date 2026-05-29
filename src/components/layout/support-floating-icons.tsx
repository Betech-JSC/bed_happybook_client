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
        .animate-zalo {
          animation: custom-pulse 1.5s infinite ease-in-out;
        }
        .animate-whatsapp {
          animation: custom-pulse 1.8s infinite ease-in-out;
        }
      `}</style>

      <div className="fixed right-2 bottom-[32%] md:bottom-[33%] -translate-y-1/4 z-[100]">
        <div className="flex flex-col items-center gap-5">
          <a href="tel:1900633437">
            <Image
              src="/gif/phone.gif"
              width={55}
              height={55}
              alt="Hotline hỗ trợ Happy Book"
              unoptimized={true}
            />
          </a>

          <a
            href="https://wa.me/message/WKCH4YLLTHV2M1?src=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-whatsapp w-[42px] h-[42px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            aria-label="Chat on WhatsApp Business"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382C17.153 14.223 15.584 13.447 15.295 13.342C15.007 13.237 14.795 13.184 14.584 13.501C14.372 13.818 13.78 14.505 13.601 14.717C13.422 14.928 13.242 14.954 12.924 14.795C12.605 14.636 11.576 14.3 10.364 13.214C9.405 12.358 8.756 11.317 8.577 10.999C8.398 10.682 8.558 10.51 8.718 10.352C8.861 10.209 9.035 9.986 9.195 9.805C9.354 9.624 9.406 9.492 9.512 9.282C9.618 9.07 9.566 8.885 9.486 8.726C9.406 8.567 8.771 6.98 8.506 6.345C8.243 5.728 7.981 5.811 7.788 5.801C7.608 5.792 7.397 5.791 7.186 5.791C6.974 5.791 6.631 5.871 6.339 6.188C6.048 6.505 5.228 7.272 5.228 8.832C5.228 10.392 6.366 11.9 6.524 12.112C6.683 12.324 8.758 15.541 11.97 16.927C12.735 17.257 13.332 17.456 13.8 17.604C14.568 17.848 15.267 17.813 15.82 17.724C16.438 17.625 17.747 16.922 18.016 16.155C18.285 15.388 18.285 14.726 18.205 14.588C18.126 14.451 17.914 14.372 17.597 14.213L17.472 14.382ZM12.002 20.068H12V20.068C10.519 20.068 9.096 19.664 7.859 18.914L7.545 18.723L4.693 19.493L5.471 16.634L5.265 16.313C4.469 15.066 4.049 13.568 4.049 12.016C4.049 7.625 7.629 4.045 12.022 4.045C14.153 4.046 16.113 4.877 17.619 6.386C19.123 7.894 19.953 9.855 19.953 11.986C19.953 16.377 16.374 19.956 11.982 19.956L12.002 20.068ZM18.423 5.567C16.702 3.844 14.417 2.893 11.983 2.893C7.03 2.893 3.003 6.92 3.003 11.874C3.003 13.483 3.423 15.044 4.212 16.416L2.682 22.029L8.406 20.505C9.728 21.229 11.233 21.611 11.981 21.611H12.001C16.953 21.611 20.98 17.583 20.98 12.63C20.98 10.231 20.046 7.947 18.423 5.567Z" />
            </svg>
          </a>

          <a
            href="https://zalo.me/2451421179976954585/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 animate-zalo w-[42px] h-[42px] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            aria-label="Chat on Zalo OA"
          >
            <Image
              src="/icon/zalo-icon-circle.png"
              width={42}
              height={42}
              alt="Zalo OA"
              unoptimized={true}
              className="block h-[42px] w-[42px]"
            />
          </a>
        </div>
      </div>
    </>
  );
}
