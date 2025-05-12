import Image from "next/image";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import { formatCurrency } from "@/lib/formatters";
import FormCheckOut from "../components/FormCheckout";

export default function InsuranceCheckout() {
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
                Bảo hiểm du lịch quốc tế
              </h1>
              <p className="mt-3 text-base text-white">
                (06/09/2024 - 09/09/2024) 4 Ngày
              </p>
            </div>
            <div className="mt-8 flex space-y-3 flex-wrap lg:flex-none lg:grid grid-cols-8 items-center justify-between bg-white px-3 py-6 lg:px-8 rounded-2xl relative">
              <div className="w-full lg:col-span-6">
                <div className="flex flex-col md:flex-row item-start gap-2 md:gap-8 text-center">
                  <div>
                    <Image
                      src="/insurance/brand-2.png"
                      width={205}
                      height={48}
                      alt={"Brand"}
                    />
                  </div>
                  <div className="text-left flex flex-col justify-between">
                    <p className="text-sm font-normal leading-snug text-gray-500">
                      Gói bảo hiểm
                    </p>
                    <p className="text-18 font-bold !leading-normal">
                      Du lịch quốc tế Toàn Cầu - Gói C
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1  text-center h-full">
                <div className="text-left flex flex-col justify-between h-full">
                  <p className="text-sm font-normal leading-snug text-gray-500">
                    Tổng tiền
                  </p>
                  <p className="text-18 font-bold !leading-normal">
                    {formatCurrency(243000)}
                  </p>
                </div>
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1  text-center">
                <Link
                  href="/bao-hiem"
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
            <FormCheckOut />
          </div>
        </div>
      </main>
    </Fragment>
  );
}
