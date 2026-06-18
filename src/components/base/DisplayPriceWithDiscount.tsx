import { formatCurrencyFromVnd, isVndCurrency } from "@/lib/formatters";
import { displayProductPrice } from "@/utils/Helper";
import { useLanguage } from "@/contexts/LanguageContext";
import { isEmpty } from "lodash";

export default function DisplayPriceWithDiscount({
  price,
  originalPrice,
  totalDiscount = 0,
  currency = null,
}: {
  price: number;
  originalPrice?: number;
  totalDiscount?: number;
  currency?: any;
}) {
  const { language } = useLanguage();
  const displayOriginal = originalPrice !== undefined ? originalPrice : price;
  const displayFinal =
    originalPrice !== undefined
      ? price
      : totalDiscount > 0 && price < totalDiscount
        ? 0
        : price - totalDiscount;
  const hasDiscount =
    originalPrice !== undefined
      ? originalPrice > price
      : totalDiscount > 0;

  const formatPrice = (value: number) =>
    language === "en" && isVndCurrency(currency)
      ? formatCurrencyFromVnd(value, language)
      : !isEmpty(currency)
        ? displayProductPrice(value, currency)
        : formatCurrencyFromVnd(value, language);

  return (
    <div className="w-full flex justify-between items-end">
      <span className="text-gray-700 font-medium" data-translate="true">
        Tổng cộng
      </span>
      <div className="flex flex-col items-end">
        {hasDiscount && (
          <span className="text-sm font-normal text-slate-400 line-through mb-1">
            {formatPrice(displayOriginal)}
          </span>
        )}
        <span className="text-base lg:text-xl text-[#F27145] font-bold">
          {formatPrice(displayFinal)}
        </span>
      </div>
    </div>
  );
}
