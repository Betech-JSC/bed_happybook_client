import Image from "next/image";
import Link from "next/link";

export default function TourCheckout() {
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                  <div>
                    <Image
                      src="/icon/calendar.svg"
                      alt="Icon"
                      className="h-5"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex items-center w-full relative">
                    <label
                      htmlFor="service"
                      className="absolute top-0 left-0 h-4 translate-y-1 font-medium text-xs "
                    >
                      Ngày khởi hành
                    </label>
                    <input
                      id="service"
                      type="text"
                      placeholder="14/08/2024"
                      className="text-sm w-full rounded-lg pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary "
                    />
                  </div>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                  <div>
                    <Image
                      src="/icon/place.svg"
                      alt="Icon"
                      className="h-5"
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className="flex items-center w-full relative">
                    <label
                      htmlFor="service"
                      className="absolute top-0 left-0 h-4 translate-y-1 font-medium text-xs "
                    >
                      Điểm khởi hành
                    </label>
                    <input
                      id="service"
                      type="text"
                      placeholder="Hồ Chí Minh"
                      className="text-sm w-full rounded-lg pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary "
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <label
                    htmlFor="service"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Người lớn
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="service"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Trẻ em (2-12)
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="service"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Em bé {"(<2)"}
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mt-4 rounded-xl">
                  <form className="mt-3 rounded-xl ">
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          placeholder="Nhập họ và tên"
                          title="Nhập họ và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="gender"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="gender"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        >
                          <option value="">Vui lòng chọn giới tính</option>
                          <option value="">Nam</option>
                          <option value="">Nữ</option>
                          <option value="">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="relative">
                          <label
                            htmlFor="phone"
                            className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="phone"
                            type="text"
                            title="Nhập số điện thoại"
                            placeholder="Nhập số điện thoại"
                            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                          />
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="email"
                            className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            type="text"
                            title="Nhập email"
                            placeholder="Nhập email"
                            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <textarea
                        placeholder="Yêu cầu đặc biệt"
                        className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                      ></textarea>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Tôi muốn xuất hóa đơn</span>
                    </div>
                    <button
                      className={`mt-7 w-full max-w-[240px] bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover `}
                    >
                      Gửi yêu cầu
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
            <div className="overflow-hidden rounded-t-2xl">
              <Image
                className="cursor-pointer w-full h-60 md:h-40 lg:h-[230px] rounded-t-2xl hover:scale-110 ease-in duration-300"
                src={`/tour/detail/gallery/2.png`}
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
                HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long 5N4Đ (Tour
                bao gồm máy bay)
              </Link>
              <div className="flex mt-4 space-x-2 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/clock.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>2 ngày 1 đêm</span>
              </div>
              <div className="flex space-x-2 mt-3 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/flag.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>Khởi hành từ Hồ Chí Minh Thứ 6, Thứ 7 hàng tuần</span>
              </div>
              <div className="flex space-x-2 mt-3 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span>
                  Hồ Chí Minh - Cù lao Thới Sơn - Cồn Phụng - Chợ nổi Cái Răng
                </span>
              </div>
              <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
                <span className="text-xl lg:text-2xl text-primary font-bold">
                  7.004.927 vnđ
                </span>
                <span>/ khách</span>
                <p className="text-blue-700 mt-3">+ 40 điểm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
