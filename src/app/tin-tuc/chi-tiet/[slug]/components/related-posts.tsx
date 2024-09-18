"use client";
import Image from "next/image";
import Post from "@/styles/posts.module.scss";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type post = {
  title: string;
  image: string;
  description: string | null;
  date: string;
};
const relatedPosts: post[] = [
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/related/1.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/related/2.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/related/3.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/related/1.png",
    description: "",
    date: "22/08/2024",
  },
  {
    title: "Hướng Dẫn Chuẩn Bị Giấy Tờ Cần Chuẩn Bị Đặt Lịch Hẹn Visa Mỹ",
    image: "/posts/related/2.png",
    description: "",
    date: "22/08/2024",
  },
];
export default function RelatedPosts() {
  return (
    <div className="mt-8 w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {relatedPosts.map((post, index) => (
            <CarouselItem
              key={index}
              className="basis-10/12 md:basis-5/12 lg:basis-1/3"
            >
              <div key={index} className={`${Post.post__item}`}>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    className="ease-in duration-300"
                    src={post.image}
                    alt="Tin tức"
                    width={410}
                    height={272}
                    sizes="100vw"
                  />
                </div>
                <p
                  className={`ease-in duration-300 text-base font-semibold mt-3 line-clamp-3 ${Post.post__item_title}`}
                >
                  {post.title}
                </p>
                <p className="text-sm mt-2">{post.date}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </div>
  );
}
