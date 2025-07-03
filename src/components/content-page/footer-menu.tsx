import { PageApi } from "@/api/Page";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { buildSearch } from "@/utils/Helper";

export default async function FooterMenu({ page }: { page: string }) {
  const data = (await PageApi.footerMenu(page))?.payload as any;
  const buildSearchFlight = (flightItem: any) => {
    const pararmSearch = {
      tripType: "oneWay",
      cheapest: 0,
      StartPoint: flightItem.flight.data_diem_di.ma_dia_diem,
      EndPoint: flightItem.flight.data_diem_den.ma_dia_diem,
      DepartDate: isValid(new Date(flightItem.flight.ngay_khoi_hanh))
        ? format(flightItem.flight.ngay_khoi_hanh, "ddMMyyyy")
        : format(new Date(), "ddMMyyyy"),
      ReturnDate: "",
      Adt: 1,
      Chd: 0,
      Inf: 0,
      from: flightItem.flight.data_diem_di.ten_dia_diem,
      to: flightItem.flight.data_diem_den.ten_dia_diem,
    };
    return `/ve-may-bay/tim-kiem-ve${buildSearch(pararmSearch)}`;
  };

  return (
    <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      {data?.flight?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]"
            data-translate
          >
            Vé máy bay phổ biến
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.flight.map((item: any) => (
              <Link key={item.id} href={buildSearchFlight(item)}>
                <h3
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                  data-translate
                >
                  {`${item.flight.data_diem_di.ten_dia_diem} - ${item.flight.data_diem_den.ten_dia_diem}`}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.locations_favorite?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]"
            data-translate
          >
            Điểm đến được yêu thích
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.locations_favorite.map((item: any) => (
              <Link href={`/tours/tim-kiem?text=${item.name}`} key={item.id}>
                <h3
                  data-translate
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.hotel?.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]"
            data-translate
          >
            Khách sạn nổi bật
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.hotel.map((hotel: any) => (
              <Link href={`/khach-san/${hotel.slug}`} key={hotel.id}>
                <h3
                  data-translate
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  {hotel.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.visa?.length > 0 && (
        <div className="mb-0">
          <h2
            className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]"
            data-translate
          >
            Dịch vụ visa nổi bật
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.visa.map((visa: any) => (
              <Link href={`/visa/${visa.slug}-${visa.id}`} key={visa.id}>
                <h3
                  data-translate
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  {visa.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
