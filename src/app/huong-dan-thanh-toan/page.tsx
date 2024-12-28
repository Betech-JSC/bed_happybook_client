import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";

type post = {
  title: string;
  image: string;
  description: string | null;
  date: string;
};
export const metadata: Metadata = formatMetadata({
  title: "Hướng Dẫn Thanh Toán Tại HappyBook Travel ✈️",
  description:
    "Bạn cần đọc qua hướng dẫn thanh toán tại Happy Book để có thể hoàn thành các dịch vụ như thủ tục làm visa, đặt vé máy bay nội địa, vé máy bay đi quốc tế hay đặt tour du lịch tại đây. Chúng tôi cam kết những thông tin cung cấp trên hoàn toàn của chính chủ và không có sự lừa đảo nào hết nhé!",
  alternates: {
    canonical: pageUrl("huong-dan-thanh-toan", true),
  },
});

export default function PaymentInstructions() {
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <main className="bg-gray-100">
        <div className="base__content">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Hướng dẫn thanh toán
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse md:flex-row md:space-x-8 mt-4 pb-8">
            <div className="mt-4 md:mt-0 md:w-3/5 lg:w-[76%] p-6 bg-white rounded-2xl">
              <h3 className="pl-2 border-l-4 border-[#F27145] text-2xl md:text-3xl font-bold">
                Hướng dẫn thanh toán
              </h3>
              <p className="mt-4">
                Nội dung chuyển khoản quý khách hàng cần ghi rõ:MÃ ĐẶT CHỖ/MÃ
                ĐƠN HÀNG
              </p>
              <p className="text-22 text-gray-900 font-semibold mt-4">
                THÔNG TIN NGÂN HÀNG CỦA SỐ TÀI KHOẢN CÁ NHÂN
              </p>
              <div className="mt-4">
                <p className="text-base text-gray-900">
                  Nội dung chuyển khoản quý khách hàng cần ghi rõ: MÃ ĐẶT CHỖ/MÃ
                  ĐƠN HÀNG
                </p>
                <p className="text-base text-gray-900 mt-3">
                  THÔNG TIN NGÂN HÀNG CỦA SỐ TÀI KHOẢN CÁ NHÂN
                </p>
                <p className="text-base text-gray-900 mt-3">
                  ACB - Ngân hàng TMCP Á Châu - CN PGD Phước Bình
                </p>
                <p className="text-base text-gray-900 mt-1">
                  Số tài khoản: 223.702.679
                </p>
                <p className="text-base text-gray-900 mt-1">
                  Chủ tài khoản: VŨ THỊ VĂN
                </p>
                <p className="text-base text-gray-900 mt-3">
                  Happy Book CAM KẾT những thông tin chuyển khoản bên trên hoàn
                  toàn của chính chủ, nhân viên của Happy Book, nên bạn hoàn
                  toàn có thể an tâm.
                </p>
                <p className="text-base text-gray-900 mt-3">
                  Happy Book xin chân thành cảm ơn sự đóng góp và đồng hành của
                  tất cả các quý khách hàng đã tin tưởng tại chúng tôi. Happy
                  Book đảm bảo sẽ mang cho bạn đến những lựa chọn tốt nhất, trên
                  cả sự mong đợi nhé. Nếu có gặp khó khăn về vé máy bay hay làm
                  visa, bạn có thể liên hệ qua:
                </p>
              </div>
            </div>
            <div className="md:w-2/5 lg:w-[24%] max-h-[260px] bg-white rounded-2xl p-6 ">
              <div className="flex pl-3 text-base space-x-2 text-white font-semibold bg-blue-700 rounded-3xl h-[44px] items-center text__default_hover">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6663 1.89136V5.33348C11.6663 5.80018 11.6663 6.03354 11.7572 6.2118C11.8371 6.3686 11.9645 6.49609 12.1213 6.57598C12.2996 6.66681 12.533 6.66681 12.9997 6.66681H16.4418M11.6663 14.1667H6.66634M13.333 10.8334H6.66634M16.6663 8.3236V14.3334C16.6663 15.7335 16.6663 16.4336 16.3939 16.9684C16.1542 17.4388 15.7717 17.8212 15.3013 18.0609C14.7665 18.3334 14.0665 18.3334 12.6663 18.3334H7.33301C5.93288 18.3334 5.23281 18.3334 4.69803 18.0609C4.22763 17.8212 3.84517 17.4388 3.60549 16.9684C3.33301 16.4336 3.33301 15.7335 3.33301 14.3334V5.66675C3.33301 4.26662 3.33301 3.56655 3.60549 3.03177C3.84517 2.56137 4.22763 2.17892 4.69803 1.93923C5.23281 1.66675 5.93288 1.66675 7.33301 1.66675H10.0095C10.621 1.66675 10.9267 1.66675 11.2144 1.73582C11.4695 1.79707 11.7134 1.89808 11.9371 2.03515C12.1893 2.18975 12.4055 2.40594 12.8379 2.83832L15.4948 5.49517C15.9271 5.92755 16.1433 6.14374 16.2979 6.39604C16.435 6.61972 16.536 6.86358 16.5973 7.11867C16.6663 7.40639 16.6663 7.71213 16.6663 8.3236Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Link href="#" className="py-[10px]">
                  Hướng dẫn thanh toán
                </Link>
              </div>
              <div className="flex mt-3 text-base pl-3 space-x-2 text-gray-900 font-semibold rounded-3xl h-[44px] items-center text__default_hover">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6663 1.89136V5.33348C11.6663 5.80018 11.6663 6.03354 11.7572 6.2118C11.8371 6.3686 11.9645 6.49609 12.1213 6.57598C12.2996 6.66681 12.533 6.66681 12.9997 6.66681H16.4418M11.6663 14.1667H6.66634M13.333 10.8334H6.66634M16.6663 8.3236V14.3334C16.6663 15.7335 16.6663 16.4336 16.3939 16.9684C16.1542 17.4388 15.7717 17.8212 15.3013 18.0609C14.7665 18.3334 14.0665 18.3334 12.6663 18.3334H7.33301C5.93288 18.3334 5.23281 18.3334 4.69803 18.0609C4.22763 17.8212 3.84517 17.4388 3.60549 16.9684C3.33301 16.4336 3.33301 15.7335 3.33301 14.3334V5.66675C3.33301 4.26662 3.33301 3.56655 3.60549 3.03177C3.84517 2.56137 4.22763 2.17892 4.69803 1.93923C5.23281 1.66675 5.93288 1.66675 7.33301 1.66675H10.0095C10.621 1.66675 10.9267 1.66675 11.2144 1.73582C11.4695 1.79707 11.7134 1.89808 11.9371 2.03515C12.1893 2.18975 12.4055 2.40594 12.8379 2.83832L15.4948 5.49517C15.9271 5.92755 16.1433 6.14374 16.2979 6.39604C16.435 6.61972 16.536 6.86358 16.5973 7.11867C16.6663 7.40639 16.6663 7.71213 16.6663 8.3236Z"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Link href="#" className="py-[10px]">
                  Hướng dẫn đặt vé
                </Link>
              </div>
              <div className="flex mt-3 text-base pl-3 space-x-2 text-gray-900 font-semibold rounded-3xl h-[44px] items-center text__default_hover">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6663 1.89136V5.33348C11.6663 5.80018 11.6663 6.03354 11.7572 6.2118C11.8371 6.3686 11.9645 6.49609 12.1213 6.57598C12.2996 6.66681 12.533 6.66681 12.9997 6.66681H16.4418M11.6663 14.1667H6.66634M13.333 10.8334H6.66634M16.6663 8.3236V14.3334C16.6663 15.7335 16.6663 16.4336 16.3939 16.9684C16.1542 17.4388 15.7717 17.8212 15.3013 18.0609C14.7665 18.3334 14.0665 18.3334 12.6663 18.3334H7.33301C5.93288 18.3334 5.23281 18.3334 4.69803 18.0609C4.22763 17.8212 3.84517 17.4388 3.60549 16.9684C3.33301 16.4336 3.33301 15.7335 3.33301 14.3334V5.66675C3.33301 4.26662 3.33301 3.56655 3.60549 3.03177C3.84517 2.56137 4.22763 2.17892 4.69803 1.93923C5.23281 1.66675 5.93288 1.66675 7.33301 1.66675H10.0095C10.621 1.66675 10.9267 1.66675 11.2144 1.73582C11.4695 1.79707 11.7134 1.89808 11.9371 2.03515C12.1893 2.18975 12.4055 2.40594 12.8379 2.83832L15.4948 5.49517C15.9271 5.92755 16.1433 6.14374 16.2979 6.39604C16.435 6.61972 16.536 6.86358 16.5973 7.11867C16.6663 7.40639 16.6663 7.71213 16.6663 8.3236Z"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Link href="#" className="py-[10px]">
                  Thông tin chuyển khoản
                </Link>
              </div>
              <div className="flex mt-3 text-base pl-3 space-x-2 text-gray-900 font-semibold rounded-3xl h-[44px] items-center text__default_hover">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6663 1.89136V5.33348C11.6663 5.80018 11.6663 6.03354 11.7572 6.2118C11.8371 6.3686 11.9645 6.49609 12.1213 6.57598C12.2996 6.66681 12.533 6.66681 12.9997 6.66681H16.4418M11.6663 14.1667H6.66634M13.333 10.8334H6.66634M16.6663 8.3236V14.3334C16.6663 15.7335 16.6663 16.4336 16.3939 16.9684C16.1542 17.4388 15.7717 17.8212 15.3013 18.0609C14.7665 18.3334 14.0665 18.3334 12.6663 18.3334H7.33301C5.93288 18.3334 5.23281 18.3334 4.69803 18.0609C4.22763 17.8212 3.84517 17.4388 3.60549 16.9684C3.33301 16.4336 3.33301 15.7335 3.33301 14.3334V5.66675C3.33301 4.26662 3.33301 3.56655 3.60549 3.03177C3.84517 2.56137 4.22763 2.17892 4.69803 1.93923C5.23281 1.66675 5.93288 1.66675 7.33301 1.66675H10.0095C10.621 1.66675 10.9267 1.66675 11.2144 1.73582C11.4695 1.79707 11.7134 1.89808 11.9371 2.03515C12.1893 2.18975 12.4055 2.40594 12.8379 2.83832L15.4948 5.49517C15.9271 5.92755 16.1433 6.14374 16.2979 6.39604C16.435 6.61972 16.536 6.86358 16.5973 7.11867C16.6663 7.40639 16.6663 7.71213 16.6663 8.3236Z"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Link href="#" className="py-[10px]">
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
