import styles from "@/styles/styles.module.scss";

export default function FooterMenu() {
  return (
    <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div>
        <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Vé máy bay phổ biến
        </h2>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vietnam Airlines
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            VietJetAir
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Bamboo Airways
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Jetstar Pacific
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay giá rẻ
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay quốc tế
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Vé máy bay nội địa
          </h3>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Điểm đến được yêu thích
        </h2>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Hà Nội
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Đà Nẵng
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            TP. Hồ Chí Minh
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Phú Quốc
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Nha Trang
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Đà Lạt
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Bangkok
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Singapore
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Tokyo
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Seoul
          </h3>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Khách sạn nổi bật
        </h2>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn 5 sao
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Resort ven biển
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn trung tâm
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Homestay đẹp
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Khách sạn tiện nghi
          </h3>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
          Dịch vụ visa nổi bật
        </h2>
        <div className="grid grid-cols-5 gap-4 mt-3">
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Mỹ
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Canada
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Úc
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Hàn Quốc
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa đi Nhật Bản
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa du lịch châu Âu
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa định cư
          </h3>
          <h3
            className={`text-gray-700 font-medium ${styles.text_hover_default}`}
          >
            Visa công tác
          </h3>
        </div>
      </div>
    </div>
  );
}
