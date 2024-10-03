import { SidebarProps } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import Post from "@/styles/posts.module.scss";
import { formatDate } from "@/lib/formatters";

export default function SideBar({ categories, news }: SidebarProps) {
  return (
    <div className="basis-full md:basis-[35%]">
      <div className="hidden md:block p-6 border-t-4 border-blue-700 bg-gray-50 rounded-b-2xl">
        <p className="text-2xl font-bold">Chủ đề khác</p>
        <div>
          {categories.length > 0 ? (
            categories.map((item) => (
              <Link
                key={item.id}
                href={
                  item.parent_id > 0
                    ? `/tin-tuc/${item.parent.alias}/${item.alias}`
                    : `/tin-tuc/${item.alias}`
                }
                className="block text__default_hover text-sm font-medium mt-3 p-[6px] border-b-2 border-gray-300"
              >
                {item.name}
              </Link>
            ))
          ) : (
            <p className="mt-3 text-xl">Chủ đề đang cập nhật...</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">Bài viết phổ biến</p>
        <div>
          {news.length > 0 ? (
            news.map((item, index) => (
              <div
                key={item.id}
                className={`mt-3 flex space-x-3 items-center pb-3 border-b-[1px] border-gray-200 ${Post.post__item}`}
              >
                <div className="basis-[35%]">
                  <div className="overflow-hidden rounded-sm">
                    <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                      <Image
                        className="ease-in duration-300"
                        src={`/posts/popular/${index + 1}.png`}
                        alt="Tin tức"
                        width={140}
                        height={100}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </Link>
                  </div>
                </div>
                <div className="basis-[65%]">
                  <Link href={`/tin-tuc/chi-tiet/${item.alias}`}>
                    <p
                      className={`text-base ease-in duration-300 font-semibold mt-3 line-clamp-2 ${Post.post__item_title}`}
                    >
                      {item.title}
                    </p>
                  </Link>
                  <p className="text-sm mt-2">{formatDate(item.created_at)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="my-4 text-xl">Tin tức đang cập nhật....</p>
          )}
        </div>
      </div>
    </div>
  );
}
