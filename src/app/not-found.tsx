"use client";

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
    <div
      className="mt-32 h-screen w-full !px-0 flex items-center justify-center bg-center bg-cover"
      style={{
        backgroundImage: "url(/404-background-happybook.webp)",
      }}
    >
      {countDown > 0 && (
        <div
          className="px-5 pt-8 pb-12 rounded-lg"
          style={{
            backgroundColor: "rgb(0 0 0 / 33%)",
          }}
        >
          <p className="text-3xl text-white font-medium">
            Bạn sẽ được chuyển hướng về trang chủ sau {countDown} giây...
          </p>
        </div>
      )}
    </div>
  );
}
