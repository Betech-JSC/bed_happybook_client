import Image from "next/image";
import { cmsUrl } from "@/constants";

export default function DisplayImage({
  imagePath,
  width,
  height,
  alt,
  classStyle = "",
  priority = false, // Defaults to false
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: {
  imagePath: string;
  width: number;
  height: number;
  alt: string;
  classStyle?: string;
  priority?: boolean;
  sizes?: string;
}) {
  let fullImageUrl = "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    fullImageUrl = imagePath;
  } else {
    fullImageUrl = imagePath.startsWith("/")
      ? `${cmsUrl}${imagePath}`
      : `${cmsUrl}/${imagePath}`;
  }

  // Clean up any double slashes in the URL path (excluding the protocol prefix)
  fullImageUrl = fullImageUrl.replace(/([^:]\/)\/+/g, "$1");

  return (
    <Image
      src={fullImageUrl}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={classStyle}
      sizes={sizes}
    />
  );
}
