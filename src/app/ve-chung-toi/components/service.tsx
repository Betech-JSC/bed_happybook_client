import Image from "next/image";
import AboutUs from "@/styles/aboutUs.module.scss";
export default function Service() {
  return (
    <div className=" bg-[#F9FAFB]">
      <div className="py-8 px-3 lg:px-[50px] xl:px-[80px] max__screen">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[32px] font-bold">
              Dịch Vụ “Nổi Bật” Của Chúng Tôi
            </h2>
            <p className="font-medium">
              HappyBook cam kết mang đến cho quý khách hàng những dịch vụ tốt
              nhất với chi phí hợp lý, bao gồm:
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                Đại lý vé máy bay
              </p>
              <p className="mt-2 leading-6 text-justify">
                HappyBook là đơn vị chuyên xử lý vé đoàn, vé quốc tế đặc biệt
                các chặng bay Úc/ Châu Âu/Mỹ/Canada với giá cực kì tốt giảm sâu
                tới 50%
              </p>
              <p className="mt-3 leading-6 text-justify">
                Hệ thống đặt vé happy book.com.vn cung cấp vé máy bay của tất cả
                các hãng hàng không nội địa và quốc tế với thao tác đơn giản, hỗ
                trợ 24/7
              </p>
            </div>
          </div>
          <div className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-1.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                Hồ sơ visa
              </p>
              <p className="mt-2 leading-6 text-justify">
                Hỗ trợ tư vấn hồ sơ visa các nước: Ấn Độ - Dubai - Trung Quốc -
                Nhật - Hàn - Đài - Úc - Châu Âu - Mỹ - Canada,...
              </p>
              <p className="mt-3 leading-6 text-justify">
                Chúng tôi tự hào là đơn vị xử lý hồ sơ Visa khách hàng một cách
                logic, giúp tỉ lệ đậu cao nhất với chi phí xử lý cực kỳ cạnh
                tranh
              </p>
            </div>
          </div>
          <div className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-2.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                Khách sạn
              </p>
              <p className="mt-2 leading-6 text-justify">
                HappyBook hợp tác ký hợp đồng đại lý với hơn 1000 khách sạn trên
                toàn quốc, tập trung chủ yếu khách sạn 4 sao 5 sao, khu resort
                nghỉ dưỡng, Combo Vé máy bay và khách sạn của Happy Book tập
                trung dòng sản phẩm cao cấp phù hợp với nhóm, gia đình giúp
                khách hàng có những trải nghiệm hài lòng
              </p>
            </div>
          </div>
          <div className={AboutUs.service_item}>
            <div>
              <Image
                src="/about-us/Icon-3.png"
                alt="Partner"
                width={56}
                height={56}
              />
            </div>
            <div className="mt-2">
              <p className="font-semibold text-[22px] text-color-primary">
                Tour du lịch
              </p>
              <p className="mt-2 leading-6 text-justify">
                HappBook cung cấp các tour du lịch quốc tế chất lượng, giá cả
                cạnh tranh nhất. Các Tour nổi bật: Thái Lan, Trung Quốc, Hàn
                Quốc, Nhật Bản, Châu Âu, Mỹ,...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
