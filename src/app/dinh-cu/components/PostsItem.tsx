import Image from "next/image";
import Link from "next/link";
import PostStyle from "@/styles/posts.module.scss";
import DynamicTag from "@/components/base/DynamicTag";

export default function PostsItem({
  title = "",
  alias = "",
  image_url = "",
  image_location = "",
  description = "",
  typeElement = "",
}) {
  return (
    <div className={`${PostStyle.post__item}`}>
      <div className="overflow-hidden rounded-xl">
        <Link
          href={`/dinh-cu/chi-tiet/dinh-cu-my-dien-tri-thuc-eb2-advanced-degree-eb3-professionals`}
        >
          <Image
            className="ease-in duration-300"
            src={image_url + image_location}
            alt={title}
            width={500}
            height={300}
          />
        </Link>
      </div>
      <Link
        href={`/dinh-cu/chi-tiet/dinh-cu-my-dien-tri-thuc-eb2-advanced-degree-eb3-professionals`}
      >
        <DynamicTag
          typeElement={(typeElement || "h3") as keyof JSX.IntrinsicElements}
          className={`ease-in duration-300 text-18 font-semibold mt-3 line-clamp-3 ${PostStyle.post__item_title}`}
        >
          {title}
        </DynamicTag>
      </Link>
      <div
        className="text-base mt-2 line-clamp-2"
        dangerouslySetInnerHTML={{
          __html: description ?? "Nội dung đang cập nhật",
        }}
      ></div>
    </div>
  );
}
