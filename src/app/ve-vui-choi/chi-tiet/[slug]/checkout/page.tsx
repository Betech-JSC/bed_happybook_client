import Image from "next/image";
import Link from "next/link";
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import CheckOutForm from "@/app/ve-vui-choi/components/FormCheckOut";

export default async function TourCheckout({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await TourApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;
  if (!detail) {
    notFound();
  }
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <CheckOutForm productId={1} />
      </div>
    </main>
  );
}
