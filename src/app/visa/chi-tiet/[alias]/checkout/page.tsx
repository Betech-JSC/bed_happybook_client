import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { VisaApi } from "@/api/Visa";
import FormCheckOut from "@/app/visa/components/FormCheckOut";
import { renderTextContent } from "@/utils/Helper";

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
              <h3
                className="text-22 py-4 px-8 font-semibold text-white"
                data-translate="true"
              >
                Thông tin đơn hàng
              </h3>
            </div>

            <div className="mt-4">
              <FormCheckOut productId={detail.id} />
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
                data-translate="true"
              >
                {renderTextContent(detail.name)}
              </Link>
              <div className="mt-6 mb-2">
                <div>
                  <span className="font-semibold" data-translate="true">
                    Mã visa:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.ma_visa)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold" data-translate="true">
                    Loại Visa:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.loai_visa)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold" data-translate="true">
                    Điểm Đến:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.diem_den)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold" data-translate="true">
                    Thời gian làm Visa:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.thoi_gian_lam_visa)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold" data-translate="true">
                    Thời gian lưu trú:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.thoi_gian_luu_tru)}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="font-semibold" data-translate="true">
                    Số lần nhập cảnh:
                  </span>{" "}
                  <span data-translate="true">
                    {renderTextContent(detail.product_visa.so_lan_nhap_canh)}
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
