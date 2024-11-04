"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import AboutUs from "@/styles/aboutUs.module.scss";
import "@/styles/custom.scss";
const ourTeams = [
  {
    name: "Chị Văn",
    position: "Tổng Giám Đốc",
    image: "1",
  },
  {
    name: "Hòa",
    position: "Leader Booker Quốc Tế",
    image: "2",
  },
  {
    name: "Ngà",
    position: "Leader Booker Nội Địa",
    image: "3",
  },
  {
    name: "Nhu",
    position: "Leader Marketing",
    image: "4",
  },

  {
    name: "Huy Lớn",
    position: "Hộ Chiếu & Visa",
    image: "6",
  },
  {
    name: "Huy Nhỏ",
    position: "Content Creator",
    image: "1",
  },
  {
    name: "Tươi",
    position: "Content Marketing",
    image: "1",
  },
  {
    name: "Kiệt",
    position: "ADS Marketing",
    image: "1",
  },
  {
    name: "My",
    position: "S.E.O Website",
    image: "1",
  },
  {
    name: "Anh Thành",
    position: "Tour Du Lịch",
    image: "1",
  },
  {
    name: "Chị Thoa",
    position: "CTV Vé Máy Bay",
    image: "1",
  },
  {
    name: "Kiều",
    position: "Booker",
    image: "1",
  },
  {
    name: "Vy",
    position: "Booker",
    image: "1",
  },
  {
    name: "Thắm",
    position: "HR",
    image: "1",
  },
  {
    name: "Tuyết",
    position: "Kế Toán",
    image: "1",
  },
];

export default function Members() {
  return (
    <div className="pt-8 pb-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold">Đội ngũ của chúng tôi</h2>
        </div>
      </div>
      <div className="mt-8 members__group">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          breakpoints={{
            1024: {
              slidesPerView: "auto",
              spaceBetween: 0,
              allowTouchMove: false,
            },
            768: {
              slidesPerView: "auto",
              spaceBetween: 0,
              allowTouchMove: false,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
              loop: true,
              allowTouchMove: true,
            },
          }}
        >
          {ourTeams.map((member, index) => (
            <SwiperSlide key={index} className="rounded-2xl">
              <div className={AboutUs.member__item}>
                <Image
                  src={`/our-team/member-${index + 1}.png`}
                  alt="Member"
                  width={100}
                  height={100}
                  sizes="100vw"
                  className={AboutUs.member__img}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className={AboutUs.member__info}>
                  <div className={`m-3 text-white`}>
                    <p className="font-semibold">{member.name}</p>
                    <p className="font-medium text-sm mt-[6px]">
                      {member.position}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
