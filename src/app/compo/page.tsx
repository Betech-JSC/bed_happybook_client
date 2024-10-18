import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import TourItem from "@/components/tour-item";
import FAQ from "@/components/FAQ";
import { getCdnUrl } from "@/utils/cdnHelper";

export const metadata: Metadata = {
  title: "Combo du lịch",
  description: "Happy Book",
};
type tourItem = {
  title: string;
  image: string;
  category: string;
  hot: number;
  duration: string;
  price: string;
  vehicle: string;
};
const arrTours: tourItem[] = [];
const tour: tourItem = {
  title: "COMBO 4N3Đ BÃI DÀI + KHÁCH SẠN 4* SUNKISS NHA TRANG",
  image: "",
  category: "Du lịch nội địa",
  hot: 0,
  duration: "3 ngày 2 đêm",
  price: "800.000",
  vehicle: "",
};
for (var i = 1; i < 15; i++) {
  const tourItem = { ...tour };
  if (i == 1 || i == 5 || i == 9 || i == 13) {
    tourItem.hot = 1;
    tourItem.vehicle = "bus";
  }
  if (i == 4 || i == 8 || i == 12) {
    tourItem.vehicle = "aboth";
  }
  tourItem.image = `/compo/tours/${i}.png`;
  arrTours.push(tourItem);
}

export default function CompoTour() {
  return (
    <main>
      <div className="relative h-[400px] lg:h-[500px]">
        <div className="absolute inset-0">
          <Image
            priority
            src={`/compo/bg-header.jpeg`}
            width={1900}
            height={600}
            className="object-cover w-full h-full"
            alt="Background"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        {/* Search */}
        <div className="base__content h-full relative place-content-center">
          <span className="text-32 font-bold text-white mb-6 block">
            Combo du lịch
          </span>
        </div>
      </div>
      <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          {/* Tours */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h3 className="text-32 font-bold">Combo du lịch nội địa</h3>
            <div className="flex my-4 md:my-0 space-x-3 items-center">
              <span>Sắp xếp</span>
              <div className="w-40 bg-white border border-gray-200 rounded-lg">
                <select
                  className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                  name=""
                  id=""
                >
                  <option value="">Mới nhất</option>
                  <option value="">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {arrTours.map((tour, index) => (
              <div key={index}>
                <TourItem {...tour} />
              </div>
            ))}
          </div>

          {/* Blog */}
          <div className="mt-8 rounded-2xl bg-gray-50 p-8">
            <h3 className="text-2xl font-bold">
              Tour Trong Nước - Khám Phá Vẻ Đẹp Việt Nam
            </h3>
            <p className="mt-6 line-clamp-3	">
              Việt Nam, với thiên nhiên hùng vĩ và văn hóa đa dạng, là điểm đến
              lý tưởng cho những chuyến tour trong nước. Từ núi rừng Tây Bắc
              hùng vĩ, đồng bằng sông Cửu Long mênh mông, đến bãi biển miền
              Trung tuyệt đẹp, mỗi vùng đất đều mang đến trải nghiệm đáng nhớ.
              <span className="block mt-4">
                Khi lựa chọn tour du lịch trong nước cùng HappyBook, bạn sẽ được
                khám phá các địa điểm nổi tiếng như Hà Nội cổ kính, Đà Nẵng năng
                động, Nha Trang biển xanh, hay Phú Quốc thiên đường nhiệt đới.
                Ngoài ra, các dịch vụ hỗ trợ chuyên nghiệp của chúng tôi sẽ đảm
                bảo hành trình của bạn luôn trọn vẹn và thú vị.
              </span>
            </p>
            <button className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center">
              <span className="font-medium group-hover:text-primary duration-300">
                Xem thêm
              </span>
              <svg
                className="group-hover:stroke-primary stroke-blue-700 duration-300"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Faq */}
          <div className="my-8">
            <FAQ />
          </div>
          <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
            <h3 className="text-32 font-bold text-center">
              Vì sao nên chọn HappyBook
            </h3>
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="flex items-center space-x-3 h-20">
                  <Image
                    src={`${getCdnUrl("/tour/adviser.svg")}`}
                    alt="Icon"
                    className="h-11 w-11"
                    width={44}
                    height={44}
                  ></Image>
                  <div>
                    <p className="text-18 font-semibold mb-1 text-gray-900">
                      Đội ngũ Happybook tư vấn
                    </p>
                    <p className="text-18 font-semibold mb-1 text-gray-900">
                      hỗ trợ nhiệt tình 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 h-20">
                  <Image
                    src="/tour/developers.svg"
                    alt="Icon"
                    className="h-11 w-11"
                    width={44}
                    height={44}
                  ></Image>
                  <div>
                    <p className="text-18 font-semibold mb-1 text-gray-900">
                      Đơn vị hơn 8 năm kinh nghiệm.
                    </p>
                    <p className="text-18 font-semibold text-gray-900">
                      Lấy chữ tín làm đầu
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 h-20">
                  <Image
                    src="/tour/product-icon.svg"
                    alt="Icon"
                    className="h-11 w-11"
                    width={44}
                    height={44}
                  ></Image>
                  <div>
                    <p className="text-18 font-semibold mb-1 text-gray-900">
                      Sản phẩm đa dạng,
                    </p>
                    <p className="text-18 font-semibold text-gray-900">
                      giá cả tốt nhất
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
