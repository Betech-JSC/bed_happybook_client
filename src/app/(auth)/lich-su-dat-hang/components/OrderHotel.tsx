"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { Fragment } from "react";
import OrderRow from "./OrderRow";

export default function OrderHotel({ order }: { order: any }) {
  const { t } = useTranslation();
  return (
    <Fragment>
      <OrderRow label={`${t("phong")}`} value={order?.detail?.room?.name} />
      <OrderRow
        label={`${t("ngay_nhan_phong")}`}
        value={order?.detail?.checkin_date}
      />
      <OrderRow
        label={`${t("ngay_tra_phong")}`}
        value={order?.detail?.checkout_date}
      />
      <OrderRow
        label={`${t("nguoi_lon")}`}
        value={`Số lượng (${order?.detail?.number_adult})`}
      />
      {order?.detail?.number_child > 0 && (
        <OrderRow
          label={`${t("tre_em")}`}
          value={`Số lượng (${order?.detail?.number_child})`}
        />
      )}
      {order?.detail?.number_baby > 0 && (
        <OrderRow
          label={`${t("tre_em")}`}
          value={`Số lượng (${order?.detail?.number_baby})`}
        />
      )}
    </Fragment>
  );
}
