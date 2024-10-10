import Image from "next/image";

export default function FormContact() {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-x-8 md:space-y-0">
      <div className="w-full md:w-[40%]">
        <div className="bg-white rounded-xl px-4 py-3">
          <h3 className="text-28 font-bold">Liên hệ tư vấn</h3>
          <p className="mt-3">
            Nếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin về các chương
            trình định cư, hãy liên hệ ngay với chúng tôi để được tư vấn miễn
            phí và chi tiết nhất.
          </p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 mt-3 border-l-[6px] border-l-blue-700">
          <div className="flex space-x-4">
            <div>
              <Image
                src="/icon/contact/passport-outline.svg"
                alt="Icon"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold">Hotline Visa - hộ chiếu</p>
              <p className="text-base mt-2">0708.628.791 - 0904.221.293</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-3">
            <div>
              <Image
                src="/icon/contact/mail-01.svg"
                alt="Icon"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold">Email visa - hộ chiếu</p>
              <p className="text-base mt-2 break-all">
                visaonline@happybook.com.vn
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[60%]">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm">
            Hãy để lại thông tin của bạn bên dưới, chúng tôi sẽ liên hệ với bạn
            trong thời gian sớm nhất.
          </p>
          <div className="mt-4 rounded-xl">
            <div className="relative mt-4">
              <input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              <label
                htmlFor="fullName"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
              >
                Họ và tên <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    id="phone"
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="text"
                    placeholder="Nhập email"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="relative mt-4">
              <input
                id="fullName"
                type="text"
                placeholder="VISA"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              <label
                htmlFor="fullName"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
              >
                Diện VISA <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="mt-4">
              <textarea
                name=""
                id=""
                placeholder="Nội dung lời nhắn"
                className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
              ></textarea>
            </div>
            <div className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover">
              <button>Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
