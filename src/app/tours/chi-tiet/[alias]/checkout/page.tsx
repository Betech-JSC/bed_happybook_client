import Image from "next/image";
import Link from "next/link";
import CheckOutTourForm from "../../../components/FormCheckOut";
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import { formatCurrency, formatMoney } from "@/lib/formatters";

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
          <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 bg-white rounded-2xl">
            <div
              className="rounded-t-xl"
              style={{
                background:
                  "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
              }}
            >
              <h3 className="text-22 py-4 px-8 font-semibold text-white">
                Thông tin khách hàng
              </h3>
            </div>

            <div className="mt-4 pt-4 pb-8 px-4 md:px-8">
              <CheckOutTourForm />
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
              <Link
                href="#"
                className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors"
              >
                {detail.name}
              </Link>
              <div className="flex mt-4 space-x-2 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/clock.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>
                  {`${detail.day ? detail.day : ""} ngày ${
                    detail.night ? detail.night : ""
                  } đêm`}
                </span>
              </div>
              <div className="flex space-x-2 mt-3 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/flag.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>{detail.depart_point ?? ""}</span>
              </div>
              <div className="flex space-x-2 mt-3 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>{detail.destination_point ?? ""}</span>
              </div>
              <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
                <span className="text-xl lg:text-2xl text-primary font-bold">
                  {formatCurrency(
                    detail.discount_price
                      ? detail.price - detail.discount_price
                      : detail.price
                  )}
                </span>
                {/* <span>/ khách</span> */}
                <p className="text-blue-700 mt-3">+ 40 điểm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
