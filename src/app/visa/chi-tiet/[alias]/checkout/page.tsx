import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import FormCheckOut from "../../components/FormCheckOut";
import { VisaApi } from "@/api/Visa";

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
              <FormCheckOut />
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
              <div className="mt-6 mb-2">
                <div>
                  <span className="font-semibold">Mã visa:</span>{" "}
                  <span>{detail.product_visa.ma_visa}</span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Loại Visa:</span>{" "}
                  <span>{detail.product_visa.loai_visa}</span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Điểm Đến:</span>{" "}
                  <span>{detail.product_visa.diem_den}</span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Thời gian làm Visa:</span>{" "}
                  <span>{detail.product_visa.thoi_gian_lam_visa} ngày</span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Thời gian lưu trú:</span>{" "}
                  <span>{detail.product_visa.thoi_gian_luu_tru} ngày</span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Số lần nhập cảnh:</span>{" "}
                  <span>
                    {detail.product_visa.so_lan_nhap_canh} tháng 1 lần
                  </span>
                </div>
              </div>
              {detail.price > 0 && (
                <div className=" bg-gray-50 text-end p-2 rounded-lg mt-2">
                  <span className="text-xl lg:text-2xl text-primary font-bold">
                    {formatCurrency(
                      detail.discount_price
                        ? detail.price - detail.discount_price
                        : detail.price
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
