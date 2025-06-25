import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import CheckOutTourForm from "../../components/FormCheckOut";
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
        <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
          <CheckOutTourForm
            productId={detail.id}
            startDate={detail.start_date}
            depart_point={detail.depart_point}
            detail={detail}
          />
        </div>
      </div>
    </main>
  );
}
