import Image from "next/image";

export default function DisplayImageTour({
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
  return (
    <Image
      src={imagePath}
      alt={alt}
      width={width}
      height={height}
      priority
      className={classStyle}
    />
  );
}
