"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { Fragment } from "react";
import OrderRow from "./OrderRow";

export default function OrderYacht({ order }: { order: any }) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <OrderRow
        label={`${t("ngay_di")}`}
        value={order?.detail?.departure_date}
      />
      {order?.detail?.option_types.length > 0 &&
        order?.detail?.option_types.map((opt: any, index: number) => (
          <OrderRow
            key={index}
            label={`${t("loai_ve")}`}
            value={`${opt?.name} - Số lượng (${opt?.quantity})`}
          />
        ))}
    </Fragment>
  );
}
