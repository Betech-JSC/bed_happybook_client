"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { BannerApi } from "@/api/Banner";
import { CheckIsMobileDevice, cloneItemsCarousel } from "@/utils/Helper";
import AosAnimate from "@/components/layout/aos-animate";
import { useTranslation } from "@/hooks/useTranslation";

export default function PartnerAirlines() {
  const { t } = useTranslation();
  const swiperRef = useRef<SwiperType | null>(null);
  const swiperRef2 = useRef<SwiperType | null>(null);
  const [partnerSlide1, setPartnerSlide1] = useState<any>([]);
  const [partnerSlide2, setPartnerSlide2] = useState<any>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  let transformValue: string;
  let transformValue2: string;

  useEffect(() => {
    const mobile = CheckIsMobileDevice();
    setIsMobileDevice(mobile);
    if (!mobile) {
      const fetchData = async () => {
        let data =
          (await BannerApi.getBannerPage("home-doitac"))?.payload?.data ?? [];

        if (data.length > 0 && data.length < 6) {
          data = cloneItemsCarousel(data, 12);
        }
        setPartnerSlide1(data);
        setPartnerSlide2([...data].reverse());
      };
      fetchData();
    }
  }, [isMobileDevice]);

  if (isMobileDevice) return null;

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
      transformValue = swiperRef.current.wrapperEl.style.transform;
      swiperRef.current.wrapperEl.style.transitionDuration = "0ms";
      swiperRef.current.wrapperEl.style.transform =
        "translate3d(" + swiperRef.current.getTranslate() + "px, 0px, 0px)";
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.wrapperEl.style.transitionDuration = "3000ms";
      swiperRef.current.wrapperEl.style.transform = transformValue;
      swiperRef.current.autoplay.start();
    }
  };

  const handleMouseEnter2 = () => {
    if (swiperRef2.current) {
      swiperRef2.current.autoplay.stop();
      transformValue2 = swiperRef2.current.wrapperEl.style.transform;
      swiperRef2.current.wrapperEl.style.transitionDuration = "0ms";
      swiperRef2.current.wrapperEl.style.transform =
        "translate3d(" + swiperRef2.current.getTranslate() + "px, 0px, 0px)";
    }
  };

  const handleMouseLeave2 = () => {
    if (swiperRef2.current) {
      swiperRef2.current.autoplay.start();
      swiperRef2.current.wrapperEl.style.transitionDuration = "3000ms";
      swiperRef2.current.wrapperEl.style.transform = transformValue2;
    }
  };
  if (!partnerSlide1?.length) return;
  return (
    <AosAnimate>
      <div className="py-12 bg-white hidden lg:block">
        <div className="flex justify-between px-3 lg:px-[80px] max__screen">
          <div>
            <h3 className="text-32 font-bold">{t("doi_tac_hang_khong")}</h3>
            <p className="mt-3">
              {t(
                "chung_toi_tu_hao_la_dai_ly_cap_1_cua_cac_hang_hang_khong_uy_tin_tai_viet_nam_nhu"
              )}
            </p>
          </div>
        </div>
        <div className="mt-8 w-full">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full overflow-hidden border border-gray-200 py-5"
          >
            <Swiper
              spaceBetween={10}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              speed={4000}
              modules={[Autoplay, FreeMode]}
              freeMode={{ enabled: true, momentum: false }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                swiper.wrapperEl.style.transitionTimingFunction = "linear";
              }}
            >
              {partnerSlide1?.length > 0 &&
                partnerSlide1.map((partNer: any, index: number) => (
                  <SwiperSlide key={index} className="basis-1/6">
                    <Image
                      src={`${partNer.image_url}${partNer.image_location}`}
                      alt={`${partNer.name ?? "Airline"}`}
                      width={300}
                      height={60}
                      className="w-auto h-10 mx-auto object-cover"
                      quality={95}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="mt-6 border-b border-b-gray-200 py-5">
            <div
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
              className="w-full overflow-hidden"
            >
              <Swiper
                spaceBetween={10}
                slidesPerView="auto"
                loop={true}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: true,
                }}
                speed={4000}
                modules={[Autoplay, FreeMode]}
                freeMode={{ enabled: true, momentum: false }}
                onSwiper={(swiper) => {
                  swiperRef2.current = swiper;
                  swiper.wrapperEl.style.transitionTimingFunction = "linear";
                }}
              >
                {partnerSlide2?.length > 0 &&
                  partnerSlide2.map((partNer: any, index: number) => (
                    <SwiperSlide key={index} className="basis-1/6">
                      <Image
                        src={`${partNer.image_url}${partNer.image_location}`}
                        alt={`${partNer.name ?? "Airline"}`}
                        width={300}
                        height={60}
                        className="w-auto h-10 mx-auto object-cover"
                        quality={95}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </AosAnimate>
  );
}
