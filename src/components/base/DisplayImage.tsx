import Image from "next/image";

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
  const cmsDomain =
    process.env.NEXT_PUBLIC_CMS_URL || "https://cms.happybooktravel.com";
  const fullImageUrl = imagePath.startsWith("/")
    ? `${cmsDomain}${imagePath}`
    : `${cmsDomain}/${imagePath}`;

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
