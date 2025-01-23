"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [countDown, setCountDown] = useState<number>(10);
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);

  useEffect(() => {
    const checkLoaderVisibility = setInterval(() => {
      const loaderElement = document.getElementById("app-global-loader");
      const hasSvg = loaderElement?.querySelector("svg") !== null;

      if (!hasSvg) {
        setIsLoaderVisible(false);
        clearInterval(checkLoaderVisibility);
      }
    }, 500);

    return () => clearInterval(checkLoaderVisibility);
  }, []);

  useEffect(() => {
    if (isLoaderVisible) return;
    if (countDown > 0) {
      const timeoutRedirect = setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);

      return () => clearTimeout(timeoutRedirect);
    } else {
      router.push("/");
    }
  }, [router, countDown, isLoaderVisible]);

  return (
    <div className="h-[200px] md:h-[500px] lg:h-screen w-full mt-16 lg:mt-32 relative z-[-1]  !px-0 flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          priority
          src="/404-background-happybook.webp"
          width={1900}
          height={1000}
          alt="Background"
          className="md:h-full object-contain md:object-cover"
        />
      </div>

      {countDown > 0 && (
        <div
          className="px-2 py-4 mx-3 md:mx-0  md:px-5 md:pt-8 md:pb-12 rounded-lg relative z-10 text-center"
          style={{
            backgroundColor: "rgb(0 0 0 / 33%)",
          }}
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium">
            Bạn sẽ được chuyển hướng về trang chủ sau {countDown} giây...
          </p>
        </div>
      )}
    </div>
  );
}
