import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import Link from "next/link";

export default function FormCheckOut() {
  return (
    <form>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
            <span data-translate="true">Nơi đi</span>
          </label>
          <input
            type="text"
            placeholder="Việt Nam"
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
        </div>
        <div className="relative">
          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
            <span data-translate="true">Nơi đến</span>
          </label>
          <input
            type="text"
            placeholder="Việt Nam"
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
        </div>
      </div>
      <div className="mt-6">
        <p className="text-22 font-bold">Thông tin người mua bảo hiểm</p>
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Ngày sinh"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Số CCCD"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="col-span-2 relative">
              <input
                type="text"
                placeholder="Địa chỉ"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-1 relative">
              <input
                type="text"
                placeholder="Số điện thoại"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-1 relative">
              <input
                type="text"
                placeholder="Email"
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <input
                id="informationBySelf"
                type="checkbox"
                className="w-4 h-4"
                name="insurance_buyer_infor"
              />
              <label htmlFor="informationBySelf" className="text-sm">
                Bản thân
              </label>
            </div>
            <div className="flex space-x-2 cursor-pointer">
              <input
                id="informationByBuyer"
                type="checkbox"
                className="w-4 h-4"
                name="insurance_buyer_infor"
              />
              <label htmlFor="informationByBuyer" className="text-sm">
                Thông tin liên hệ theo người mua
              </label>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center p-4 rounded-lg bg-gray-100">
              <div className="w-[62%]">
                <p>
                  Để thuận tiện việc nhập Danh sách khách đoàn, Quý khách có thể
                  tải mẫu Excel, điền thông tin và tải lên.
                </p>
              </div>
              <div className="w-[38%] flex gap-4 justify-end">
                <button className="flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white">
                  <Image
                    src="/icon/download.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                  <p>Tải danh sách mẫu</p>
                </button>
                <button className="flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white">
                  <Image
                    src="/icon/download.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                  <p>Chọn danh sách</p>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-22 font-bold">Thông tin người mua bảo hiểm</p>
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="relative">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Giới tính</span>{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                  <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5">
                    <option value="" data-translate="true" disabled={true}>
                      Vui lòng chọn giới tính
                    </option>
                    <option value="male" data-translate="true">
                      Nam
                    </option>
                    <option value="female" data-translate="true">
                      Nữ
                    </option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ngày sinh"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Số CCCD"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="relative">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Mua cho</span>
                </label>
                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                  <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5">
                    <option value="" data-translate="true">
                      Bản thân
                    </option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Số CCCD"
                  className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    name="termsOfUse"
                    id="termsOfUse"
                  />
                  <label className="text-sm" htmlFor="termsOfUse">
                    Tôi xác nhận thông tin trên và chấp nhận các của{" "}
                    <Link
                      className="text-blue-700 font-semibold underline"
                      href="/thong-tin-chung/dieu-khoan-su-dung"
                      target="_blank"
                    >
                      Điều khoản sử dụng website
                    </Link>
                  </label>
                </div>
                <div className="w-[300px]">
                  <LoadingButton text="Đặt đơn bảo hiểm" isLoading={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
