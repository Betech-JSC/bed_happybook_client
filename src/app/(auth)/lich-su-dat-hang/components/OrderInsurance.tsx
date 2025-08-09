"use client";
import { useTranslation } from "@/hooks/useTranslation";
import OrderRow from "./OrderRow";

export default function OrderInsurance({ order }: { order: any }) {
  const { t } = useTranslation();
  return (
    <div className="divide-y">
      <OrderRow label={`${t("loai")}`} value={order?.insurance_type?.name} />
      <OrderRow label={`${t("so_luong")}`} value={order?.number_insured} />
      <OrderRow label={`${t("diem_di")}`} value={order?.from_address} />
      <OrderRow label={`${t("diem_den")}`} value={order?.to_address} />
    </div>
  );
}
