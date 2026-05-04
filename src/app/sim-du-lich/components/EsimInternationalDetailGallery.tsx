"use client";

import { useState } from "react";
import Image from "next/image";
import type { EsimPackageView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  selectedPackage: EsimPackageView | null;
};

const GALLERY = [
  "/tour/detail/gallery/2.png",
  "/tour/detail/gallery/3.png",
  "/tour/detail/gallery/4.png",
  "/tour/detail/gallery/5.png",
];

export default function EsimInternationalDetailGallery({ selectedPackage }: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = GALLERY[activeIndex] || GALLERY[0];

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm aspect-[16/10]">
        <Image
          src={activeImage}
          alt={selectedPackage?.title || t("Ảnh eSIM quốc tế")}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <div className="absolute left-4 bottom-4 rounded-lg bg-[#4E6EB3] px-4 py-2 text-sm font-medium text-white shadow-md">
          {t("Sim du lịch quốc tế")}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {GALLERY.map((src, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative overflow-hidden rounded-xl aspect-[4/3] border transition-all ${
                isActive ? "border-[#F27145] ring-2 ring-orange-100" : "border-slate-200"
              }`}
            >
              <Image
                src={src}
                alt={`${selectedPackage?.title || t("Ảnh eSIM quốc tế")} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 140px"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
