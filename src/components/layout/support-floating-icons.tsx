"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Lazy-render this component after the main content is loaded
// to avoid blocking the main thread during initial load
export default function SupportFloatingIcons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay rendering until browser is idle — avoids contributing to TBT
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
    <div className="fixed right-2 bottom-[32%] md:bottom-[33%] -translate-y-1/4 z-[100]">
      <div className="flex flex-col items-center">
        <a href="tel:1900633437">
          <Image
            src="/gif/phone.gif"
            width={60}
            height={60}
            alt="Hotline hỗ trợ Happy Book"
            unoptimized={true}
          />
        </a>
      </div>
    </div>
  );
}
