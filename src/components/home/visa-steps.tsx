import styles from "@/styles/styles.module.scss";

export default function VisaSteps() {
  return (
    <div
      className="relative bg-cover bg-center py-12 md:px-3 lg:px-[50px] xl:px[80px]"
      // style={{ backgroundImage: 'url("/path-to-your-image.jpg")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="px-3 md:px-0 relative z-10 container mx-auto text-center text-white">
        <h2
          className={`${styles.pacifico_font} text-3xl font-normal mb-5 pacifico_font`}
        >
          Các bước làm visa tại Happy Book Travel
        </h2>
        <p className="mb-8 lg:w-[40%] mx-auto">
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
                className={`text-[28px] font-normal mt-2 md:mt-5 ${styles.pacifico_font}`}
              >
                Đăng ký
              </p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">
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
                className={`text-[28px] font-normal mt-2 md:mt-5 ${styles.pacifico_font}`}
              >
                Liên hệ
              </p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">
                Nhân viên sẽ liên hệ với bạn trong vòng 2h làm việc qua
                zalo/call. Hoặc bạn liên hệ hotline 0708.628.791 (zalo/call).
              </p>
            </div>
          </li>
          <li
            className={`flex w-[303px] md:w-auto flex-col basis-1/5 items-center relative ${styles.progressbar__step}`}
          >
            <div className="w-[240px] md:w-auto text-left ml-[86px] md:ml-0 md:text-center">
              <p
                className={`text-[28px] font-normal mt-2 md:mt-5 ${styles.pacifico_font}`}
              >
                Tư vấn
              </p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">
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
                className={`text-[28px] font-normal mt-2 md:mt-5 ${styles.pacifico_font}`}
              >
                Nộp hồ sơ
              </p>

              <p className="text-sm font-normal max-w-1/2 lg:min-w-[200px] m-w-[220px] mt-3">
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
                className={`text-[28px] font-normal mt-2 md:mt-5 ${styles.pacifico_font}`}
              >
                Đợi kết quả
              </p>

              <p className="text-sm font-normal lg:min-w-[200px] m-w-[220px] mt-3">
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
