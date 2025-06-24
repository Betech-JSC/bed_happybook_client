import { formatCurrency } from "@/lib/formatters";
import { displayProductPrice } from "@/utils/Helper";

export default function DisplayPriceWithDiscount({
  price,
  totalDiscount = 0,
  currency = null,
}: {
  price: number;
  totalDiscount?: number;
  currency?: any;
}) {
  const finalPrice =
    totalDiscount > 0 && price < totalDiscount ? 0 : price - totalDiscount;
  return (
    <div>
      {totalDiscount > 0 && (
        <div>
          <div className="flex pt-4 justify-between">
            <span className=" text-gray-700 font-medium" data-translate="true">
              Giá gốc
            </span>
            <p className="font-medium">
              {currency
                ? displayProductPrice(price, currency)
                : formatCurrency(price)}
            </p>
          </div>
          <div className="flex py-4 justify-between">
            <span className=" text-gray-700 font-medium" data-translate="true">
              Giảm giá
            </span>
            <p className="font-medium">
              {" "}
              {currency
                ? displayProductPrice(totalDiscount, currency)
                : formatCurrency(totalDiscount)}
            </p>
          </div>
        </div>
      )}
      <div className="flex pt-4 justify-between border-t border-t-gray-300 font-semibold ">
        <span className="text-gray-700 font-medium" data-translate="true">
          Tổng cộng
        </span>
        <p className="text-base lg:text-xl text-primary">
          {currency
            ? displayProductPrice(finalPrice, currency)
            : formatCurrency(finalPrice)}
        </p>
      </div>
    </div>
  );
}
