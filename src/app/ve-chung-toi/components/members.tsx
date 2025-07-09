"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import AboutUs from "@/styles/aboutUs.module.scss";
import "@/styles/custom.scss";
import { useTranslation } from "@/hooks/useTranslation";

export default function Members({ data }: any) {
  const { t } = useTranslation();
  return (
    <div className="pt-8 pb-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold">
            {t("doi_ngu_cua_chung_toi")}
          </h2>
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
          {data.map((member: any) => (
            <SwiperSlide key={member.id} className="rounded-2xl">
              <div className={AboutUs.member__item}>
                <Image
                  src={`${member.image_url}/${member.image_location}`}
                  alt="Image"
                  width={600}
                  height={400}
                  sizes="100vw"
                  className={`${AboutUs.member__img} w-full h-[468px] md:h-[316px] lg:h-[255px] object-cover`}
                />
                <div className={AboutUs.member__info}>
                  <div className={`m-3 text-white`}>
                    <p className="font-semibold" data-translate>
                      {member.name}
                    </p>
                    <p className="font-medium text-sm mt-[6px]" data-translate>
                      {member.sub_title}
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
