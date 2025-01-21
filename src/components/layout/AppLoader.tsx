"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Vivus from "vivus";
import "@/styles/AppLoader.scss";

const AppLoader: React.FC = () => {
  const pathName = usePathname();
  const router = useRouter();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);
  const timeoutLoaderRef = useRef<NodeJS.Timeout | null>(null);
  const isLoaderRunning = useRef<boolean>(false);
  const isFirstLoad = useRef<boolean>(true);

  const stopLoader = useCallback(() => {
    setLoadingCompleted(true);
    const prevSvg = svgContainerRef?.current?.querySelector("svg");
    if (prevSvg) {
      prevSvg.remove();
    }
    isFirstLoad.current = false;
    isLoaderRunning.current = false;
  }, []);

  const startLoader = useCallback(() => {
    if (!svgContainerRef.current) return;
    if (isLoaderRunning.current) return;
    setLoadingCompleted(false);
    isLoaderRunning.current = true;
    const vivusInstance = new Vivus(
      svgContainerRef.current?.id || "",
      {
        file: "/logo-happybook.svg",
        duration: isFirstLoad.current ? 120 : 60,
        type: "oneByOne",
        onReady: (myVivus) => {
          const paths = myVivus.el.querySelectorAll("path, polygon");
          paths.forEach((path: any) => {
            path.style.fill = path.getAttribute("data-fill-color") || "black";
            path.style.fillOpacity = "0";
          });
        },
      },
      () => {
        let paths = document.querySelectorAll(
          "#app-global-loader svg path, #app-global-loader svg polygon"
        );
        paths.forEach((path) => {
          path.classList.add("animated-fill");
        });
        if (isFirstLoad.current) {
          timeoutLoaderRef.current = setTimeout(() => {
            stopLoader();
          }, 700);
        }
      }
    );
    return () => {
      vivusInstance.destroy();
      if (timeoutLoaderRef.current) {
        clearTimeout(timeoutLoaderRef.current);
      }
    };
  }, [stopLoader]);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      const target = event.target as HTMLElement;

      if (target.tagName === "A" || target.closest("a")) {
        const linkElement =
          target.tagName === "A" ? target : target.closest("a");
        const href = (linkElement as HTMLAnchorElement)?.getAttribute("href");

        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:")
        ) {
          startLoader();
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [startLoader]);

  useEffect(() => {
    if (!isLoaderRunning.current) {
      startLoader();
    }
    if (!isFirstLoad.current) {
      timeoutLoaderRef.current = setTimeout(() => {
        stopLoader();
      }, 700);
    }
    return () => {
      if (timeoutLoaderRef.current) {
        clearTimeout(timeoutLoaderRef.current);
      }
    };
  }, [pathName, startLoader, stopLoader]);

  return (
    <div
      id="wrapper-app-global-loader"
      className={loadingCompleted ? "opacity-0 invisible" : ""}
    >
      <div ref={svgContainerRef} id="app-global-loader"></div>
    </div>
  );
};

export default AppLoader;
