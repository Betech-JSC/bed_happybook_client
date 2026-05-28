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
  const fullImageUrl = imagePath.startsWith("/")
    ? `${cmsUrl}${imagePath}`
    : `${cmsUrl}/${imagePath}`;

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
