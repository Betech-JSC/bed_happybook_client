import { formatCurrencyFromVnd, isVndCurrency } from "@/lib/formatters";
import { displayProductPrice } from "@/utils/Helper";
import { useLanguage } from "@/contexts/LanguageContext";
import { isEmpty } from "lodash";

export default function DisplayPriceWithDiscount({
  price,
  totalDiscount = 0,
  currency = null,
}: {
  price: number;
  totalDiscount?: number;
  currency?: any;
}) {
  const { language } = useLanguage();
  const finalPrice =
    totalDiscount > 0 && price < totalDiscount ? 0 : price - totalDiscount;
  const formatPrice = (value: number) =>
    language === "en" && isVndCurrency(currency)
      ? formatCurrencyFromVnd(value, language)
      : !isEmpty(currency)
        ? displayProductPrice(value, currency)
        : formatCurrencyFromVnd(value, language);

  return (
    <div>
      {totalDiscount > 0 && (
        <div>
          <div className="flex pt-4 justify-between">
            <span className=" text-gray-700 font-medium" data-translate="true">
              Giá gốc
            </span>
            <p className="font-medium">{formatPrice(price)}</p>
          </div>
          <div className="flex py-4 justify-between">
            <span className=" text-gray-700 font-medium" data-translate="true">
              Giảm giá
            </span>
            <p className="font-medium"> {formatPrice(totalDiscount)}</p>
          </div>
        </div>
      )}
      <div className="flex pt-4 justify-between border-t border-t-gray-300 font-semibold ">
        <span className="text-gray-700 font-medium" data-translate="true">
          Tổng cộng
        </span>
        <p className="text-base lg:text-xl text-primary">{formatPrice(finalPrice)}</p>
      </div>
    </div>
  );
}
