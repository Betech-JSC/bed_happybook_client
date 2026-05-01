"use client";
import { formatCurrency } from "@/lib/formatters";
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
  return (
    <Fragment>
      {price > 0 ? (
        <>
          {!isEmpty(textPrefix) && (
            <span className="mr-1">{t(toSnakeCase(textPrefix as string))}</span>
          )}
          <span
            className={cn(
              "text-[#F27145] font-semibold text-base lg:text-xl",
              className
            )}
          >
            {!isEmpty(currency) ? (
              <>{displayProductPrice(price, currency)}</>
            ) : (
              <>{formatCurrency(price, language)}</>
            )}
          </span>
        </>
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
