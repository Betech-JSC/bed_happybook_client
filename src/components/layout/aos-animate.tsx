"use client";
import React from "react";

interface AosAnimateProps {
  children: React.ReactNode;
  animation?: string;
}

const AosAnimate = ({ children, animation = "fade-up" }: AosAnimateProps) => {
  return <div data-aos={animation}>{children}</div>;
};

export default AosAnimate;
