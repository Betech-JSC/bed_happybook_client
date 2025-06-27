import { formatCurrency } from "@/lib/formatters";
import { displayProductPrice } from "@/utils/Helper";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { Fragment } from "react";

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
  return (
    <Fragment>
      {price > 0 ? (
        <>
          {!isEmpty(textPrefix) && (
            <span className="mr-1" data-translate="true">
              {textPrefix}
            </span>
          )}
          <span
            className={clsx(
              "text-[#F27145] font-semibold text-base lg:text-xl",
              className
            )}
          >
            {!isEmpty(currency) ? (
              <>{displayProductPrice(price, currency)}</>
            ) : (
              <>{formatCurrency(price)}</>
            )}
          </span>
        </>
      ) : (
        <span
          className={clsx(
            "text-[#F27145] font-semibold text-base lg:text-xl",
            className
          )}
          data-translate="true"
        >
          Liên hệ
        </span>
      )}
    </Fragment>
  );
}
