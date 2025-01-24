"use client";
import Image from "next/image";
import { useState } from "react";

export default function DisplayImage({
  imageUrl = "",
  imagePath,
  width,
  height,
  alt,
  classStyle = "",
}: {
  imageUrl?: string;
  imagePath: string;
  width: number;
  height: number;
  alt: string;
  classStyle: string;
}) {
  if (!imageUrl) {
    imageUrl =
      process.env.NEXT_PUBLIC_CMS_URL || "http://cms.happybooktravel.com";
  }
  const fullImageUrl = imagePath.startsWith("/")
    ? `${imageUrl}${imagePath}`
    : `${imageUrl}/${imagePath}`;

  const [imgSrc, setImgSrc] = useState(fullImageUrl);
  const defaultImage = "/default-image.png";
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority
      className={classStyle}
      onError={() => {
        if (imgSrc !== defaultImage) {
          setImgSrc(defaultImage);
        }
      }}
    />
  );
}
