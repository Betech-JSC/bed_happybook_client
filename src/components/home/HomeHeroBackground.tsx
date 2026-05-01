"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroImage = {
  src: string;
  alt: string;
};

const desktopSlides: HeroImage[] = [
  { src: "/bg-image.webp", alt: "Happy Book hero background" },
  { src: "/bg-image-2.webp", alt: "Happy Book hero background 2" },
  { src: "/bg-image.png", alt: "Happy Book hero background 3" },
];

const mobileSlides: HeroImage[] = [
  { src: "/bg-image.webp", alt: "Happy Book hero background" },
  { src: "/bg-image-2.webp", alt: "Happy Book hero background 2" },
  { src: "/bg-image.png", alt: "Happy Book hero background 3" },
];

function AutoBanner({
  slides,
  className,
  priorityFirst = true,
}: {
  slides: HeroImage[];
  className?: string;
  priorityFirst?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={className}>
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            priority={priorityFirst && index === 0}
            src={slide.src}
            fill
            sizes="100vw"
            className="object-cover"
            alt={slide.alt}
          />
        </div>
      ))}
    </div>
  );
}

export function HomeHeroDesktopBackground() {
  return (
    <div className="hidden lg:block absolute inset-0 h-[694px]">
      <AutoBanner slides={desktopSlides} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
        }}
      />
    </div>
  );
}

export function HomeHeroMobileBackground() {
  return (
    <div className="absolute inset-0 h-full">
      <AutoBanner
        slides={mobileSlides}
        className="absolute inset-0"
        priorityFirst={false}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
        }}
      />
    </div>
  );
}
