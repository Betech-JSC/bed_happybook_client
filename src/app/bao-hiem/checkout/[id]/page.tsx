import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { formatCurrency } from "@/lib/formatters";
import FormCheckOut from "../../components/FormCheckout";
import { ProductInsurance } from "@/api/ProductInsurance";
import { notFound } from "next/navigation";
import { isEmpty } from "lodash";
import { differenceInDays, parse, format } from "date-fns";
import DisplayImage from "@/components/base/DisplayImage";

export default async function InsuranceCheckout({
  params,
  searchParams,
}: {
  params: { id: string | number };
  searchParams: { [key: string]: string | string[] };
}) {
  const safeParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    safeParams[key] = Array.isArray(value) ? value[0] : value;
  });
  const queryString = new URLSearchParams(safeParams).toString();
  const types = ["domestic", "international"];

  const startDate = parse(safeParams.departDate, "ddMMyyyy", new Date());
  const endDate = parse(safeParams.returnDate, "ddMMyyyy", new Date());

  const diffDate = differenceInDays(endDate, startDate);
  const detail =
    ((await ProductInsurance.detail(params.id))?.payload?.data as any) ?? null;

  const matchedInsurance = detail?.insurance_package_prices?.find(
    (item: any) => diffDate >= item.day_start && diffDate <= item.day_end
  );
  const totalFee =
    parseInt(matchedInsurance.price) * (parseInt(safeParams.guests) ?? 1);
  if (isEmpty(detail) || !matchedInsurance) {
    notFound();
  }
  return (
    <Fragment>
      <div className="relative h-max pb-14">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-12 relative">
            <div className="text-center">
              <h1 className="text-2xl lg:text-32 text-white font-bold">
                Bảo hiểm du lịch{" "}
                {types.includes(safeParams.type)
                  ? safeParams.type === "domestic"
                    ? "nội địa"
                    : "quốc tế"
                  : ""}
              </h1>
              <p className="mt-3 text-base text-white">
                {`(${format(startDate, "dd/MM/yyyy")} - ${format(
                  endDate,
                  "dd/MM/yyyy"
                )}) `}
                {diffDate > 0 && `${diffDate} Ngày`}
              </p>
            </div>
            <div className="mt-8 flex space-y-3 flex-wrap lg:flex-none lg:grid grid-cols-8 items-center justify-between bg-white px-3 py-6 lg:px-8 rounded-2xl relative">
              <div className="w-full lg:col-span-6">
                <div className="flex flex-col md:flex-row item-start gap-2 md:gap-8 text-center">
                  <div>
                    {!isEmpty(detail.image) ? (
                      <DisplayImage
                        imagePath={detail.image ?? ""}
                        width={205}
                        height={48}
                        alt={"Brand"}
                        classStyle="max-w-[205px] max-h-[48px]"
                      />
                    ) : (
                      <Image
                        src="/default-image.png"
                        width={205}
                        height={48}
                        alt={"Brand"}
                        className="max-w-[205px] max-h-[48px] object-cover rounded-sm"
                      />
                    )}
                  </div>
                  <div className="text-left flex flex-col justify-between">
                    <p className="text-sm font-normal leading-snug text-gray-500">
                      Gói bảo hiểm
                    </p>
                    <p className="text-18 font-bold !leading-normal">
                      {detail.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1  text-center h-full">
                <div className="text-left flex flex-col justify-between h-full">
                  <p className="text-sm font-normal leading-snug text-gray-500">
                    Tổng tiền
                  </p>
                  <p
                    id="totalInsurcePrice"
                    className="text-18 font-bold !leading-normal"
                  >
                    {formatCurrency(totalFee)}
                  </p>
                </div>
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1  text-center">
                <Link
                  href={`/bao-hiem?${queryString}`}
                  className="lg:max-w-32 block text-center w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                >
                  Đổi gói
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="w-full bg-gray-100 relative z-2 rounded-2xl pb-4 lg:pb-12">
        <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen relative top-[-30px]">
          <div className="px-3 py-5 lg:px-8 bg-white rounded-2xl">
            <FormCheckOut detail={detail} matchedInsurance={matchedInsurance} />
          </div>
        </div>
      </main>
    </Fragment>
  );
}
