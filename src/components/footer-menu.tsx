import styles from "@/styles/styles.module.scss";

export default function FooterMenu() {
  return (
    <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div>
        <p className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Vé máy bay phổ biến
        </p>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vietnam Airlines
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            VietJetAir
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Bamboo Airways
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Jetstar Pacific
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay giá rẻ
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay quốc tế
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay nội địa
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Điểm đến được yêu thích
        </p>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Hà Nội
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Đà Nẵng
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            TP. Hồ Chí Minh
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Phú Quốc
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Nha Trang
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Đà Lạt
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Bangkok
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Singapore
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Tokyo
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Seoul
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Khách sạn nổi bật
        </p>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn 5 sao
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Resort ven biển
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn trung tâm
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Homestay đẹp
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn tiện nghi
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Dịch vụ visa nổi bật
        </p>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Mỹ
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Canada
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Úc
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Hàn Quốc
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Nhật Bản
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa du lịch châu Âu
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa định cư
          </p>
          <p
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa công tác
          </p>
        </div>
      </div>
    </div>
  );
}
