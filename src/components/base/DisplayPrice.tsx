import { formatCurrency } from "@/lib/formatters";
import clsx from "clsx";
import { isEmpty } from "lodash";

export default function DisplayPrice({
  price,
  textPrefix,
  className = "",
}: {
  price: number;
  textPrefix?: string;
  className?: string;
}) {
  return (
    <div>
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
            {formatCurrency(price)}
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
    </div>
  );
}
