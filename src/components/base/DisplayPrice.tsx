"use client";
import { formatCurrencyFromVnd, isVndCurrency } from "@/lib/formatters";
import { displayProductPrice, toSnakeCase } from "@/utils/Helper";
import { isEmpty } from "lodash";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DisplayPrice({
  price,
  textPrefix,
  className = "",
  currency = null,
}: {
  price: number;
  textPrefix?: string;
  className?: string;
  currency?: any;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const shouldConvertVndToUsd = language === "en" && isVndCurrency(currency);
  const formattedPrice = shouldConvertVndToUsd
    ? formatCurrencyFromVnd(price, language)
    : !isEmpty(currency)
      ? displayProductPrice(price, currency)
      : formatCurrencyFromVnd(price, language);

  return (
    <Fragment>
      {price > 0 ? (
        <span className="inline-flex items-baseline gap-1">
          {!isEmpty(textPrefix) && (
            <span className="text-slate-700 text-sm lg:text-base font-medium">{t(toSnakeCase(textPrefix as string))}</span>
          )}
          <span
            className={cn(
              "text-[#F27145] font-semibold text-base lg:text-xl",
              className
            )}
          >
            {formattedPrice}
          </span>
        </span>
      ) : (
        <span
          className={cn(
            "text-[#F27145] font-semibold text-base lg:text-xl",
            className
          )}
        >
          {t("lien_he")}
        </span>
      )}
    </Fragment>
  );
}
