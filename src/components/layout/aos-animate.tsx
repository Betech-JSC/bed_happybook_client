"use client";
import React, { useEffect, useState } from "react";

interface AosAnimateProps {
  children: React.ReactNode;
  animation?: string;
}

const AosAnimate = ({ children, animation = "fade-up" }: AosAnimateProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div {...(mounted ? { "data-aos": animation } : {})}>
      {children}
    </div>
  );
};

export default AosAnimate;
