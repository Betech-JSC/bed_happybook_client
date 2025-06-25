import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { HotelApi } from "@/api/Hotel";
import FormCheckOut from "@/app/khach-san/components/FormCheckOut";
import { renderTextContent } from "@/utils/Helper";

export default async function VisaCheckOut({
  params,
}: {
  params: { alias: string; roomId: string };
}) {
  const res = (await HotelApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();

  const room = detail.hotel?.rooms.find(
    (room: any) => room.id === parseInt(params.roomId)
  );
  if (!room) notFound();
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
          <FormCheckOut data={detail} room={room} detail={detail} />
        </div>
      </div>
    </main>
  );
}
