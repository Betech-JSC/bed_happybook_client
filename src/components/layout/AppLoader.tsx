"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/AppLoader.scss";
import { translatePage } from "@/utils/translateDom";
import Image from "next/image";

const AppLoader: React.FC = () => {
  const pathName = usePathname();
  const [loading, setLoading] = useState(false);
  const timeoutLoaderRef = useRef<NodeJS.Timeout | null>(null);
  const gifSrcRef = useRef<string>("");

  const stopLoading = useCallback(() => {
    setLoading(false);
    gifSrcRef.current = "";
  }, []);

  const startLoading = useCallback(() => {
    setLoading(true);
    gifSrcRef.current = `/loading.gif?${Date.now()}`;
  }, []);

  // useEffect(() => {
  //   const handleLinkClick = (event: MouseEvent) => {
  //     if (event.ctrlKey || event.metaKey || event.shiftKey) {
  //       return;
  //     }
  //     const target = event.target as HTMLElement;

  //     if (target.tagName === "A" || target.closest("a")) {
  //       const linkElement =
  //         target.tagName === "A" ? target : target.closest("a");
  //       const href = (linkElement as HTMLAnchorElement)?.getAttribute("href");

  //       if (
  //         href &&
  //         !href.startsWith("#") &&
  //         !href.startsWith("mailto:") &&
  //         !href.startsWith("tel:") &&
  //         href !== window.location.pathname
  //       ) {
  //         startLoading();
  //       }
  //     }
  //   };

  //   document.addEventListener("click", handleLinkClick);

  //   return () => {
  //     document.removeEventListener("click", handleLinkClick);
  //   };
  // }, [startLoading, stopLoading]);

  useEffect(() => {
    translatePage();

    startLoading();

    timeoutLoaderRef.current = setTimeout(() => {
      stopLoading();
    }, 3200);

    return () => {
      if (timeoutLoaderRef.current) {
        clearTimeout(timeoutLoaderRef.current);
        timeoutLoaderRef.current = null;
      }
    };
  }, [pathName, startLoading, stopLoading]);

  return (
    <div
      id="wrapper-app-global-loader"
      className={!loading ? "opacity-0 invisible" : ""}
    >
      <div className="mx-auto">
        {gifSrcRef.current && (
          <Image
            priority
            key={pathName}
            src={gifSrcRef.current}
            alt="Loading"
            width={900}
            height={900}
            unoptimized
            // style={{ height: 900 }}
          />
        )}
      </div>
    </div>
  );
};

export default AppLoader;
