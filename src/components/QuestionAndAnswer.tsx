import Image from "next/image";

export default function QuestionAndAnswer() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
        Hỏi đáp
      </h3>
      <div className="p-3 mt-8 border border-gray-300 rounded-lg">
        <div>
          <textarea
            className="w-full outline-none"
            name=""
            id=""
            rows={4}
            placeholder="Mời bạn nhập thắc mắc hoặc ý kiến của bạn"
          ></textarea>
        </div>
        <div className="bg-gray-50 rounded-2xl flex flex-wrap lg:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-3 p-5 lg:p-3 items-center">
          <div className="rounded-2xl w-full lg:w-[40%]">
            <div className="border-gray-300 border rounded-lg">
              <input
                className="outline-none w-full px-4 py-[10px] max-h-11 rounded-lg"
                style={{
                  boxShadow: "0px 1px 2px 0px #1018280D",
                }}
                type="text"
                placeholder="Tên của bạn *"
              />
            </div>
          </div>
          <div className="rounded-2xl w-full lg:w-[40%]">
            <div className="border border-gray-300 rounded-lg">
              <input
                className="outline-none w-full px-4 py-[10px] max-h-11 rounded-lg"
                style={{
                  boxShadow: "0px 1px 2px 0px #1018280D",
                }}
                type="text"
                placeholder="Email *"
              />
            </div>
          </div>
          <div className="w-full lg:w-[20%] bg-blue-600 max-h-11 text__default_hover p-[10px] text-white rounded-lg inline-flex items-center">
            <button className="mx-auto text-base font-medium">
              Gửi câu hỏi
            </button>
          </div>
        </div>
      </div>
      {/* Q & A */}
      <div className="mt-8">
        <div className="mt-5">
          <div className="flex space-x-4">
            <div className="w-2/12 md:w-1/12 flex space-x-2">
              <div className="h-8 w-8 md:w-11 md:h-11 rounded-full bg-[#4E6EB3] text-white place-content-center text-center">
                <p className="text-base md:text-2xl font-medium">Q</p>
              </div>
            </div>
            <div className="w-7/12 md:w-8/12">
              <div className="flex space-x-3 items-center">
                <p className="text-sm md:text-18 font-semibold">Natasia</p>
                <p className="w-4 h-[2px] bg-gray-300"></p>
                <p className="text-sm">19/04/2024</p>
              </div>
              <div className="text-sm md:text-base mt-1">
                Khoảng giữa T11/2024 có tour này ko a ?
              </div>
            </div>
            <div className="w-3/12">
              <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                <Image
                  className=" cursor-pointer h-3 w-3 md:h-4 md:w-4"
                  src="/icon/corner-up-left.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />
                <p className="text-sm md:text-18 text-blue-700 font-semibold">
                  Trả lời
                </p>
              </button>
            </div>
          </div>
          <div className="px-3 mt-4 border-l border-gray-300">
            <div className="flex space-x-4">
              <div className="w-2/12 md:w-1/12 flex space-x-2">
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#F27145] text-white place-content-center text-center">
                  <p className="text-base md:text-2xl font-medium">A</p>
                </div>
              </div>
              <div className="w-8/12">
                <p className="text-sm md:text-18 font-semibold">
                  HappyBook Travel
                </p>
                <div className="text-sm md:text-base">
                  <p className="mb-3">Dạ chào anh</p>
                  <p className="mb-3">
                    Tháng 10 đang là mùa lá đỏ bên Hàn Quốc rồi ạ. HappyBook sẽ
                    liên hệ với anh qua sđt cung cấp để tư vấn tour chi tiết ạ.
                  </p>
                  <p className="mt-3">Cảm ơn anh.</p>
                </div>
              </div>
              <div className="w-2/12 md:w-3/12">
                <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                  <Image
                    className=" cursor-pointer h-4 w-4"
                    src="/icon/corner-up-left.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex space-x-4">
            <div className="w-2/12 md:w-1/12 flex space-x-2">
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#4E6EB3] text-white place-content-center text-center">
                <p className="text-base md:text-2xl font-medium">Q</p>
              </div>
            </div>
            <div className="w-7/12 md:8/12">
              <div className="flex space-x-3 items-center">
                <p className="text-sm md:text-18 font-semibold">Le Phuong</p>
                <p className="w-4 h-[2px] bg-gray-300"></p>
                <p className="text-sm">19/04/2024</p>
              </div>
              <div className="text-sm md:text-base mt-1">
                mình muốn đặt tour
              </div>
            </div>
            <div className="w-3/12">
              <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                <Image
                  className="cursor-pointer h-3 w-3 md:h-4 md:w-4"
                  src="/icon/corner-up-left.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />
                <p className="text-sm md:text-18 text-blue-700 font-semibold">
                  Trả lời
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex space-x-4">
            <div className="w-2/12 md:w-1/12 flex space-x-2">
              <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#4E6EB3] text-white place-content-center text-center">
                <p className="text-base md:text-2xl font-medium">Q</p>
              </div>
            </div>
            <div className="w-7/12">
              <div className="flex space-x-3 items-center">
                <p className="text-sm md:text-18 font-semibold">Diễm</p>
                <p className="w-4 h-[2px] bg-gray-300"></p>
                <p className="text-sm">19/04/2024</p>
              </div>
              <div className="text-sm md:text-base mt-1">
                còn nhiều nhận tour cuối tháng 11 không ạ
              </div>
            </div>
            <div className="w-3/12">
              <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                <Image
                  className="cursor-pointer h-3 w-3 md:h-4 md:w-4"
                  src="/icon/corner-up-left.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />
                <p className="text-sm md:text-18 text-blue-700 font-semibold">
                  Trả lời
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
