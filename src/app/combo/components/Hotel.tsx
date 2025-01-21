import { formatCurrency } from "@/lib/formatters";
import { getLabelRatingProduct } from "@/utils/Helper";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function Hotel({ data }: any) {
  return (
    <Fragment>
      <div className="bg-white p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 justify-between">
          <div className="md:w-10/12">
            <h3 className="font-bold text-2xl">{data?.hotelOfCompo?.name}</h3>
            <div className="flex space-x-2 items-center mt-3">
              <Image
                className="w-4 h-4"
                src="/icon/marker-pin-01.svg"
                alt="Icon"
                width={18}
                height={18}
              />
              <span className="text-sm">
                {data?.hotelOfCompo?.hotel?.address}
              </span>
            </div>
          </div>
          <div className="flex mt-3 md:mt-0 space-x-1 md:w-2/12 md:justify-end">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
              {data.hotelOfCompo?.hotel?.average_rating ?? 0}
            </span>
            <div className="flex flex-col space-y-1">
              <span className="text-primary text-sm font-semibold">
                {getLabelRatingProduct(
                  data.hotelOfCompo?.hotel?.average_rating
                )}
              </span>
              <span className="text-gray-500 text-xs">
                {data.hotelOfCompo?.hotel?.total_rating ?? 0} đánh giá
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-18 font-semibold">Tiện nghi dịch vụ</p>
          {data.hotelOfCompo?.hotel?.amenity_service.length > 0 ? (
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4 leading-6">
              {data.hotelOfCompo.hotel.amenity_service.map((item: any) => (
                <li key={item.id}>{item.hotel_amenity_service.name}</li>
              ))}
            </ul>
          ) : (
            <span className="mt-2">Nội dung đang cập nhật...</span>
          )}
        </div>
      </div>
      <div className="rounded-2xl mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.hotelOfCompo?.hotel?.rooms.length > 0 &&
          data.hotelOfCompo?.hotel?.rooms.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl">
              <div className="p-3 flex flex-col justify-between h-full">
                <div className="flex-grow">
                  <Link
                    href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi"
                    className="block overflow-hidden rounded-xl"
                  >
                    <Image
                      className="cursor-pointer rounded-lg hover:scale-110 ease-in duration-300"
                      src={`${data.image_url}/${item.image_location}`}
                      alt="Image"
                      width={416}
                      height={256}
                    />
                  </Link>
                  <Link
                    href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi"
                    className="mt-2 text-18 font-semibold line-clamp-3 text__default_hover"
                  >
                    <h3> {item.name}</h3>
                  </Link>
                  {item.description ? (
                    <div
                      className="mt-3 p-2 rounded-lg bg-gray-100 leading-5"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    ></div>
                  ) : (
                    <div className="mt-2">Nội dung đang cập nhật...</div>
                  )}
                </div>
                <div>
                  <div className="mt-4 text-right">
                    {item.discount_price > 0 && (
                      <p className="text-gray-500">
                        {formatCurrency(item.discount_price)}
                      </p>
                    )}
                    <p>
                      <span className="text-gray-500">Tổng:</span>{" "}
                      <span className="mt-2 text-22 font-semibold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      bao gồm thuế phí
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/khach-san/dat-phong/${data?.hotelOfCompo?.slug}/${item.id}`}
                      className="bg-gray-50 text__default_hover py-3 border border-gray-300 rounded-lg inline-flex w-full items-center"
                    >
                      <button className="mx-auto text-base font-medium">
                        Đặt phòng
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Thông tin về nơi lưu trú này
          </h2>
          <h3 className="mt-4 text-22 font-semibold">
            {data?.hotelOfCompo?.name ?? ""}
          </h3>
          <div
            className="mt-3 leading-6"
            dangerouslySetInnerHTML={{
              __html: data?.hotelOfCompo?.hotel?.reside_information,
            }}
          ></div>

          {/* <div className="w-full mt-4 text-center">
            <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
              Xem thêm
            </button>
          </div> */}
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tiện nghi, dịch vụ nơi lưu trú
          </h2>
          {data.hotelOfCompo?.hotel?.amenity_service.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4 leading-6">
              {data.hotelOfCompo.hotel.amenity_service.map((item: any) => (
                <li key={item.id}>{item.hotel_amenity_service.name}</li>
              ))}
            </ul>
          ) : (
            <span className="mt-2">Nội dung đang cập nhật...</span>
          )}
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tiện nghi phòng
          </h2>
          {data.hotelOfCompo?.hotel?.amenities.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4 leading-6">
              {data.hotelOfCompo.hotel.amenities.map((item: any) => (
                <li key={item.id}>{item.hotel_amenity.name}</li>
              ))}
            </ul>
          ) : (
            <span className="mt-2">Nội dung đang cập nhật...</span>
          )}
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Chính sách
          </h2>
          <div
            className="mt-4 leading-6"
            dangerouslySetInnerHTML={{
              __html:
                data?.hotelOfCompo?.hotel?.policy ?? "Nội dung đang cập nhật",
            }}
          ></div>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Thông tin quan trọng
          </h2>
          <div
            className="mt-4 leading-6"
            dangerouslySetInnerHTML={{
              __html:
                data?.hotelOfCompo?.hotel?.information ??
                "Nội dung đang cập nhật",
            }}
          ></div>
        </div>
      </div>
    </Fragment>
  );
}
