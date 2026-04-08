import { notFound } from "next/navigation";
import { isMatch, parse, isBefore, startOfDay } from "date-fns";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import CheckOutForm from "../../components/FormCheckOut";

export default async function TourCheckout({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const departDate = searchParams.departDate ?? "";
  if (
    !departDate ||
    !isMatch(departDate, "yyyy-MM-dd") ||
    isBefore(
      parse(departDate, "yyyy-MM-dd", new Date()),
      startOfDay(new Date())
    )
  ) {
    notFound();
  }

  const res = (await ProductBusinessLoungeApi.detail(
    params.slug,
    departDate
  )) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();

  const optionSelectedId = Number(searchParams.option) || 0;

  const optionSelected = detail?.business_lounge?.options.find(
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
      <div className="base__content">
        <CheckOutForm product={newDetail} ticketOptionId={optionSelected.id} />
      </div>
    </main>
  );
}
