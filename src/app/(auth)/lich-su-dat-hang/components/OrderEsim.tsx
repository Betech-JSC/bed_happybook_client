"use client";
import { Fragment } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import OrderRow from "./OrderRow";

export default function OrderEsim({ order }: { order: any }) {
  const { t } = useTranslation();
  const contactName = order?.contact?.contact_name ?? order?.contact?.name ?? "";
  const contactPhone = order?.contact?.contact_phone ?? order?.contact?.phone ?? "";
  const contactEmail = order?.contact?.contact_email ?? order?.contact?.email ?? "";
  const contactDisplay = [contactName, contactPhone, contactEmail]
    .filter((value) => Boolean(value && `${value}`.trim()))
    .join(" - ");

  return (
    <Fragment>
      <OrderRow label={t("ma_don_hang")} value={order?.order_code} />
      {order?.items?.length > 0 &&
        order.items.map((item: any, index: number) => {
          const snapshotDisplay = [
            item?.package_title_snapshot ?? item?.variant_title_snapshot ?? "",
            item?.destination_snapshot ?? "",
          ]
            .filter((value) => Boolean(value && `${value}`.trim()))
            .join(" - ");

          return (
            <OrderRow
              key={index}
              label={index === 0 ? t("goi_du_lieu") : ""}
              value={snapshotDisplay}
            />
          );
        })}
      {contactDisplay && (
        <OrderRow
          label={t("khach_hang")}
          value={contactDisplay}
        />
      )}
    </Fragment>
  );
}
