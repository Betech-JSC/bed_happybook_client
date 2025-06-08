"use client";

import { smoothScrollTo } from "@/utils/Helper";
import Link from "next/link";
import React from "react";

interface Props {
  targetId: string;
  offset?: number;
  children: React.ReactNode;
}

export default function SmoothScrollLink({
  targetId,
  offset = 0,
  children,
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + offset;
      smoothScrollTo(y, 1000);
    }
  };

  return (
    <Link href={`#${targetId}`} onClick={handleClick}>
      {children}
    </Link>
  );
}
