import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { VisaApi } from "@/api/Visa";
import FormCheckOut from "@/app/visa/components/FormCheckOut";
import { displayProductPrice, renderTextContent } from "@/utils/Helper";
import DisplayPrice from "@/components/base/DisplayPrice";
import { isEmpty } from "lodash";

export default async function VisaCheckOut({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await VisaApi.detail(params.alias)) as any;
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
