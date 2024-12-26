import Image from "next/image";

export default function DisplayImage({
  imagePath,
  width,
  height,
  alt,
  classStyle = "",
}: {
  imagePath: string;
  width: number;
  height: number;
  alt: string;
  classStyle: string;
}) {
  const cmsDomain =
    process.env.NEXT_PUBLIC_CMS_URL || "http://cms.happybooktravel.com";
  const fullImageUrl = imagePath.startsWith("/")
    ? `${cmsDomain}${imagePath}`
    : `${cmsDomain}/${imagePath}`;

  return (
    <Image
      src={fullImageUrl}
      alt={alt}
      width={width}
      height={height}
      priority
      className={classStyle}
    />
  );
}
