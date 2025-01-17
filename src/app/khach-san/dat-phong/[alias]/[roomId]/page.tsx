import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { HotelApi } from "@/api/Hotel";
import FormCheckOut from "@/app/khach-san/components/FormCheckOut";

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
          <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 rounded-2xl">
            <div
              className="rounded-t-xl"
              style={{
                background:
                  "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
              }}
            >
              <h3 className="text-22 py-4 px-8 font-semibold text-white">
                Thông tin đơn hàng
              </h3>
            </div>

            <div className="mt-4">
              <FormCheckOut data={detail} />
            </div>
          </div>
          <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
            <div className="overflow-hidden rounded-t-2xl">
              <Image
                className="cursor-pointer w-full h-60 md:h-40 lg:h-[230px] rounded-t-2xl hover:scale-110 ease-in duration-300"
                src={`${detail.image_url}/${detail.image_location}`}
                alt="Image"
                width={410}
                height={230}
                sizes="100vw"
              />
            </div>

            <div className="py-4 px-3 lg:px-6">
              <p className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors text-blue-700 ">
                {detail.name}
              </p>
              <div className="mt-2 flex space-x-1">
                {Array.from({ length: 5 }, (_, index) =>
                  detail.rating !== undefined && index < detail.rating ? (
                    <Image
                      key={index}
                      className="w-4 h-4"
                      src="/icon/starFull.svg"
                      alt="Icon"
                      width={10}
                      height={10}
                    />
                  ) : (
                    <Image
                      key={index}
                      className="w-4 h-4"
                      src="/icon/star.svg"
                      alt="Icon"
                      width={10}
                      height={10}
                    />
                  )
                )}
              </div>
              <p className="mt-4 text-18 font-bold leading-6">{room.name}</p>
              {detail.hotel.amenity_service.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-4 leading-6">
                  {detail.hotel.amenity_service.map((item: any) => (
                    <li key={item.id}>{item.hotel_amenity_service.name}</li>
                  ))}
                </ul>
              )}
              <div></div>
              {/* <div className="mt-6 flex w-full">
                <div className="w-1/2">
                  <p className="font-bold">Nhận phòng</p>
                  <p className="mt-2">02/09/2024</p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold">Trả phòng</p>
                  <p className="mt-2">05/09/2024</p>
                </div>
              </div> */}
              {room.price > 0 && (
                <div className="flex justify-between border-t border-solid border-gray-200 text-end pt-4 rounded-lg mt-5">
                  <span className="text-sm text-gray-500">Tổng cộng</span>
                  <span className="text-xl lg:text-2xl text-primary font-bold">
                    {formatCurrency(
                      room.discount_price
                        ? room.price - room.discount_price
                        : room.price
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
