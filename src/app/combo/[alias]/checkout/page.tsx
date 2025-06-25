import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { ComboApi } from "@/api/Combo";
import FormCheckOut from "@/app/combo/components/FormCheckOut";
import { renderTextContent } from "@/utils/Helper";

export default async function ComboCheckout({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await ComboApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;

  if (!detail) {
    notFound();
  }
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
          <FormCheckOut productId={detail.id} detail={detail} />
        </div>
      </div>
    </main>
  );
}
