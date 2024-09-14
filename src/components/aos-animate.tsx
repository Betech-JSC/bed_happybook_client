"use client";
import React from "react";

import AOS from "aos";
import "aos/dist/aos.css";
interface AosAnimateProps {
  children: React.ReactNode;
}
const AosAnimate = ({ children }: AosAnimateProps) => {
  React.useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 0,
      duration: 350,
      easing: "ease-in",
      once: true,
    });
  }, []);
  return <div data-aos="fade">{children}</div>;
};

export default AosAnimate;
