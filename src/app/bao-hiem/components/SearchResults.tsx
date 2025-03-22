"use client";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useRef, useState } from "react";

export default function SearchResults({ items }: any) {
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toggleShowDetail = useCallback(
    (id: number) => {
      setShowDetail(showDetail === id ? null : id);
    },
    [showDetail]
  );
  return (
    <Fragment>
      {Array.from({ length: 9 }, (_, index) => (
        <div className="mb-6 last:mb-0  h-fit" key={index}>
          <div className="grid grid-cols-8 items-start justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
            <div className="col-span-6">
              <div className="flex flex-col md:flex-row item-start gap-2 md:gap-4 text-center md:text-left mb-3">
                <div>
                  <Image
                    src="/insurance/brand.png"
                    width={174}
                    height={58}
                    alt={"Brand"}
                    className=""
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="text-18 font-bold !leading-normal">
                    Du lịch quốc tế Toàn Cầu - Gói C
                  </h3>
                  <p className="text-sm font-normal leading-snug text-gray-500">
                    Bảo hiểm PVI
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-2 w-full md:col-span-2 text-center md:text-right md:pl-8 xl:pr-8">
              <div className="flex flex-col justify-between float-end gap-2">
                <button
                  type="button"
                  onClick={() => router.push("bao-hiem/checkout")}
                  className="max-w-32 block text-center w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                >
                  Chọn
                </button>
                <button
                  type="button"
                  onClick={() => toggleShowDetail(index)}
                  className="text-blue-700 font-medium text-base border-b border-b-blue-700"
                >
                  Xem quyền lợi
                </button>
              </div>
            </div>
          </div>
          <div
            ref={contentRef}
            style={{
              maxHeight: showDetail === index ? "500px" : "0px",
            }}
            className={`bg-gray-100 border-2 rounded-2xl relative transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${
              showDetail === index
                ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
                : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
            } overflow-y-auto rounded-lg`}
          >
            <div className="flex flex-col justify-between py-3 px-4 md:px-6 bg-white rounded-lg">
              <div className="pb-1">
                <p className="text-blue-700 text-22 font-bold mb-4">
                  Quyền lợi bảo hiểm
                </p>
                <div className="mt-2 py-4">
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>Personal accident/ Tai nạn cá nhân</p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Death or permanent disability due to accident/Tử vong hoặc
                      thương tật vĩnh viễn do tai nạn
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Sum Insured applies for Insureds aged from 16 to 65 years
                      old / Số tiền bảo hiểm áp dụng cho Người được bảo hiểm từ
                      16 đến 65 tuổi
                    </p>
                    <p className="mt-1 text-primary text-base font-bold">
                      {formatCurrency(1000000000)}
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Sum Insured applies for Insureds aged from 06 weeks old to
                      15 years old / Số tiền bảo hiểm áp dụng cho Người được bảo
                      hiểm từ 06 tuần tuổi đến 15 tuổi
                    </p>
                    <p className="mt-1 text-primary text-base font-bold">
                      {formatCurrency(500000000)}
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Sum Insured applies for Insureds aged from 66 to 80 years
                      old / Số tiền bảo hiểm áp dụng cho Người được bảo hiểm từ
                      66 đến 80 tuổi
                    </p>
                    <p className="mt-1 text-primary text-base font-bold">
                      {formatCurrency(300000000)}
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Medical expenses arising from treatment at hospitals /Chi
                      phí do điều trị y tế tại bệnh viện
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Medical expenses arising from treatment at hospitals /Chi
                      phí do điều trị y tế tại bệnh viện
                    </p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-b-gray-200">
                    <p>
                      Medical expenses arising from treatment at hospitals /Chi
                      phí do điều trị y tế tại bệnh viện
                    </p>
                  </div>
                  <div className="pb-4 border-b border-b-gray-200">
                    <p>
                      Medical expenses arising from treatment at hospitals /Chi
                      phí do điều trị y tế tại bệnh viện
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
}
