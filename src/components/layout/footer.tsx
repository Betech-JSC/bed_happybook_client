import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { GeneralInforPaths } from "@/constants/paths";

export default function Footer() {
  return (
    <footer className="bg-[#F9FAFB]">
      <div className="max__screen px-3 lg:px-[50px] xl:px-[80px] lg:mt-0  pt-12 pb-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="basis-1/2">
            <div className="pb-12">
              <Image
                src="/logo-footer.svg"
                alt="Icon"
                width={287}
                height={72}
              />
            </div>
            <p>
              <strong>Hotline vé máy bay:</strong> 0983.488.937 (Nội địa) -
              0367.008.027 (Quốc tế)
            </p>
            <p>
              <strong>Hotline Visa - hộ chiếu</strong> 0708.628.791 -
              0904.221.293
            </p>
            <p>
              <strong>Hotline Tour du lịch:</strong> 0708.628.791
            </p>
            <p>
              <strong>Email Chính thức:</strong> info@happybook.com.vn
            </p>
            <p>
              <strong>Email tuyển dụng - đăng ký CTV:</strong>{" "}
              HR@happybook.com.vn
            </p>
            <p>
              <strong>Email visa - hộ chiếu: </strong>
              visaonline@happybook.com.vn
            </p>
            <p>
              <strong>Trụ sở chính:</strong> Tầng 1, Phong Phú Tower, 93/10
              Quang Trung, KP.1, P.Hiệp Phú, TP.Thủ Đức, TP.HCM
            </p>
            <p>
              <strong>Chi nhánh 1:</strong> 124 Lê Quang Định, P.14, Q.Bình
              Thạnh, TP.HCM
            </p>
          </div>
          <div className="mt-12 lg:mt-0 basis-1/2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
            <div>
              <p>
                <strong>Về Happy Book</strong>
              </p>
              <p className={`mt-4 ${styles.text_hover_default}`}>
                <Link href="/ve-chung-toi">Về chúng tôi</Link>
              </p>
              <p className={`mt-3 ${styles.text_hover_default}`}>
                <Link href="/tin-tuc">Tin tức</Link>
              </p>
              <p className={`mt-3 ${styles.text_hover_default}`}>
                <Link href="/lien-he">Liên hệ chúng tôi</Link>
              </p>
              <p className={`mt-3 ${styles.text_hover_default}`}>
                <Link href="/dang-ky-ctv">Đăng ký CTV</Link>
              </p>
              <p className="mt-8 ">
                <strong>Theo dõi chúng tôi</strong>
              </p>
              <div className="flex space-x-3 mt-4">
                <button>
                  <Image
                    src="/social/fb.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
                <button>
                  <Image
                    src="/social/tiktok.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
                <button>
                  <Image
                    src="/social/zalo.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
                <button>
                  <Image
                    src="/social/ytb.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
            <div>
              <p>
                <strong>Dịch vụ</strong>
              </p>
              <Link
                href="/tours/tour-noi-dia"
                className={`block mt-4 ${styles.text_hover_default}`}
              >
                Tour nội địa
              </Link>
              <Link
                href="/tours/tour-quoc-te"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Tour quốc tế
              </Link>
              <Link
                href="/tours/tour-du-thuyen"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Tour du thuyền
              </Link>
              <Link
                href="/ve-may-bay"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Vé máy bay
              </Link>
              {/* <p className={`mt-3 ${styles.text_hover_default}`}>
                Vé máy bay quốc tế
              </p> */}
              <Link
                href="/visa"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Dịch vụ làm Visa
              </Link>
              <Link
                href="/dinh-cu"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Định cư
              </Link>
              <Link
                href="/khach-san"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Khách sạn
              </Link>
              <Link
                href="/combo"
                className={`block mt-3 ${styles.text_hover_default}`}
              >
                Combo
              </Link>
            </div>
            <div>
              <p>
                <strong>Khác</strong>
              </p>
              <p className={`mt-4 ${styles.text_hover_default} `}>
                <Link href="/tu-van-nhan-visa">Tư vấn visa</Link>
              </p>
              {GeneralInforPaths.map(
                (
                  item: { title: string; slug: string; url: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className={`mt-3 ${styles.text_hover_default} `}
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </div>
                )
              )}

              <p className="mt-8">
                <strong>Hình thức thanh toán</strong>
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <button>
                  <Image
                    src="/payment/1.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/2.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/3.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
                <button>
                  <Image
                    src="/payment/4.svg"
                    alt="Icon"
                    width={58}
                    height={40}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-center space-x-[66px]">
            <Image src="/certifi/1.png" alt="Icon" width={100} height={32} />
            <Image src="/certifi/2.png" alt="Icon" width={100} height={32} />
            <Image src="/certifi/3.png" alt="Icon" width={100} height={32} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="font-bold">CÔNG TY TNHH TMDV DU LỊCH HAPPYBOOK</p>
          <p className="text-[12px]">
            Mã số doanh nghiệp: 0314012158 do Sở Kế hoạch & Đầu tư TP HCM cấp
            ngày 15/09/2016 - Cấp thay đổi ngày 26/03/2024
          </p>
        </div>
      </div>
    </footer>
  );
}
