"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/styles/styles.module.scss";
import { usePathname } from "next/navigation";

export default function BackToTopButton() {
  const pathname = usePathname();
  const isEsimRoute =
    pathname?.startsWith("/sim-du-lich") ||
    pathname?.startsWith("/sim-viet-nam") ||
    pathname?.startsWith("/sim-quoc-te");

  if (isEsimRoute) return null;

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.back__top}>
      <button
        onClick={scrollToTop}
        className={`${styles.back__top_btn} ${
          isVisible ? "visible" : "invisible"
        }`}
        style={{
          opacity: isVisible ? "0.5" : "0",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <Image
          src="/icon/back-to-top.svg"
          alt="Back To Top"
          width={48}
          height={45}
          className={styles.back__top_icon}
        />
        <p className="text-xs">back to top</p>
      </button>
    </div>
  );
}
