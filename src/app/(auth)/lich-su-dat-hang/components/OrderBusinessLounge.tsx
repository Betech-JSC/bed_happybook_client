"use client";

import { Fragment } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import OrderRow from "./OrderRow";

export default function OrderBusinessLounge({ order }: { order: any }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <OrderRow label={t("ngay_di")} value={order?.detail?.departure_date} />
      {order?.detail?.flight_number && (
        <OrderRow label="Số hiệu chuyến bay" value={order?.detail?.flight_number} />
      )}
      {order?.detail?.flight_time && (
        <OrderRow label={t("gio_bay")} value={order?.detail?.flight_time} />
      )}
      {order?.detail?.flight_arrival_time && (
        <OrderRow label={t("gio_dap")} value={order?.detail?.flight_arrival_time} />
      )}
      {order?.detail?.flight_date && (
        <OrderRow label="Ngày bay" value={order?.detail?.flight_date} />
      )}
      {order?.detail?.option_types?.length > 0 &&
        order.detail.option_types.map((opt: any, index: number) => (
          <OrderRow
            key={index}
            label={index === 0 ? t("loai_ve") : ""}
            value={`${opt?.name} - Số lượng (${opt?.quantity})`}
          />
        ))}
    </Fragment>
  );
}
