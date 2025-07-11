import { notFound } from "next/navigation";
import { ProductYachtApi } from "@/api/ProductYacht";
import CheckOutForm from "@/app/du-thuyen/components/FormCheckOut";

export default async function TourCheckout({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const res = (await ProductYachtApi.detail(
    params.slug,
    searchParams.departDate ?? ""
  )) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();

  const optionSelectedId = Number(searchParams.option) || 0;

  const optionSelected = detail?.yacht?.options.find(
    (item: any) => item.id === optionSelectedId
  );

  if (!optionSelected || !optionSelected?.prices?.length) {
    notFound();
  }

  const newDetail = {
    ...detail,
    ticket_prices: optionSelected.prices,
  };
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <CheckOutForm product={newDetail} ticketOptionId={optionSelected.id} />
      </div>
    </main>
  );
}
