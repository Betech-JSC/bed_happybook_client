import styles from "@/styles/styles.module.scss";
import { Pacifico } from "next/font/google";
import Image from "next/image";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["vietnamese"],
  display: "swap",
});

export default function VisaSteps() {
  return (
    <div className="relative bg-cover bg-center py-12 md:px-3 lg:px-[50px] xl:px[80px]">
      <div className="absolute inset-0 z-[2] w-full">
        <Image
          src="/visa-step-2.png"
          width={1440}
          height={518}
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="px-3 md:px-0 relative z-10 container mx-auto text-center text-white">
        <h2
          className={`${pacifico.className} ${styles.pacifico_font} text-3xl font-normal mb-5`}
          data-translate="true"
        >
          Các bước làm visa tại HappyBook Travel
        </h2>
        <p className="mb-8 lg:w-[40%] mx-auto" data-translate="true">
          Làm visa đơn giản và nhanh chóng, với đội ngũ chuyên nghiệp hỗ trợ
          chuyên nghiệp từ khâu chuẩn bị hồ sơ đến khi nhận visa.
        </p>
        <ul
          className={`h-[666px] md:mt-[64px] md:h-auto md:space-x-3 ${styles.progressbar}`}
        >
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] text-left ml-[86px] md:ml-0 md:text-center md:w-auto ">
              <p
                className={` ${pacifico.className} ${styles.progressbar__step_title}`}
                data-translate="true"
              >
                Đăng ký
              </p>
              <p
                className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3"
                data-translate="true"
              >
                Điền form thông tin đơn giản, nhanh chóng. Thông tin được bảo
                mật.
              </p>
            </div>
          </li>
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p
                className={` ${pacifico.className} ${styles.progressbar__step_title}`}
                data-translate="true"
              >
                Liên hệ
              </p>

              <div
                className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3"
                data-translate="true"
              >
                Nhân viên sẽ liên hệ với bạn trong vòng 2h làm việc qua
                zalo/call. Hoặc bạn liên hệ hotline{" "}
                <a href="tel:1900633437" className="inline-block">
                  1900.633.437 - Nhấn phím (2){" "}
                </a>
                (zalo/call).
              </div>
            </div>
          </li>
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p
                className={` ${pacifico.className} ${styles.progressbar__step_title}`}
                data-translate="true"
              >
                Tư vấn
              </p>

              <p
                className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3"
                data-translate="true"
              >
                Tư vấn hoàn thiện hồ sơ: nhân viên visa giàu kinh nghiệm của
                Happy book sẽ đồng hành hướng dẫn, hỗ trợ bạn suốt quá trình
                chuẩn bị hồ sơ.
              </p>
            </div>
          </li>
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p
                className={` ${pacifico.className} ${styles.progressbar__step_title}`}
                data-translate="true"
              >
                Nộp hồ sơ
              </p>

              <p
                className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3"
                data-translate="true"
              >
                Sau khi hồ sơ đã hoàn chỉnh, nhân viên Happy book nộp hồ sơ visa
                lên Lãnh sự quán các nước.
              </p>
            </div>
          </li>
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p
                className={` ${pacifico.className} ${styles.progressbar__step_title}`}
                data-translate="true"
              >
                Đợi kết quả
              </p>

              <p
                className="text-sm font-normal lg:min-w-[200px] m-w-[220px] mt-3"
                data-translate="true"
              >
                Sau quá trình đợi LSQ xét duyệt hồ sơ, nhân viên Happybook sẽ
                thông báo kết quả và chuyển phát hồ sơ cho khách hàng.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
