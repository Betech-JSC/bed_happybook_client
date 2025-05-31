import Image from "next/image";
import Link from "next/link";
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import CheckOutForm from "@/app/ve-vui-choi/components/FormCheckOut";
import { ProductTicket } from "@/api/ProductTicket";

export default async function TourCheckout({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const res = (await ProductTicket.detail(
    params.slug,
    searchParams.departDate ?? ""
  )) as any;
  const detail = res?.payload?.data;
  if (!detail) notFound();
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <CheckOutForm product={detail} />
      </div>
    </main>
  );
}
