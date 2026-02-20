"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/app/hooks/useTranslation";
import { labelRatingStaticText } from "@/constants/staticText";
import { toSnakeCase } from "@/utils/Helper";
import { translateText } from "@/utils/translateApi";
import { formatTranslationMap } from "@/utils/translateDom";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RatingCriteria({
  index,
  criterion,
  rating,
  labelsRating,
  hover,
  onRate,
  disabled = false,
  translatedStaticText,
}: {
  index: number;
  criterion: string;
  rating: number;
  hover?: number;
  labelsRating: string[];
  disabled?: boolean;
  onRate?: (index: number, value: number) => void;
  onHover?: (index: number, value: number) => void;
  translatedStaticText: any;
}) {
  const { t } = useTranslation(translatedStaticText);

  return (
    <div className="font-bold mb-4 flex flex-col md:flex-row space-y-3 md:space-y-0  md:space-x-5 items-center">
      <div className="w-full md:w-4/12">
        <p>{t(`${toSnakeCase(criterion)}`)}</p>
      </div>
      <div className="flex w-full md:w-8/12 space-x-5 items-center">
        <div className="flex space-x-2 items-center">
          {[...Array(5)].map((_, starIndex) => {
            const starValue = starIndex + 1;

            return (
              <label key={starIndex} className="cursor-pointer">
                {!disabled && onRate && (
                  <input
                    type="radio"
                    name={`rating-${index}`}
                    value={starValue}
                    className="hidden"
                    onClick={() => onRate(index, starValue)}
                  />
                )}

                <Image
                  key={index}
                  className="w-6 h-6"
                  src={
                    starValue <= (hover || rating)
                      ? "/icon/starFull.svg"
                      : "/icon/star.svg"
                  }
                  alt="Sao đánh giá"
                  width={32}
                  height={32}
                //   onMouseEnter={() => onHover(index, starValue)}
                //   onMouseLeave={() => onHover(index, 0)}
                />
              </label>
            );
          })}
        </div>
        {rating > 0 && (
          <p className="font-medium">
            {t(`${toSnakeCase(labelsRating[rating - 1])}`)}
          </p>
        )}
      </div>
    </div>
  );
}
