import { PageApi } from "@/api/Page";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { getServerT } from "@/lib/i18n/getServerT";

export default async function FooterMenu({ page }: { page: string }) {
  const data = (await PageApi.footerMenu(page))?.payload as any;
  const t = await getServerT();
  return (
    <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
      {data?.flight?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
            {t("ve_may_bay")}
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.flight.map((item: any) => (
              <Link key={item.id} href={`/ve-may-bay/${item.alias}`}>
                <h3
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                  data-translate="true"
                >
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data?.locations_favorite?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
            {t("diem_den_duoc_yeu_thich")}
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.locations_favorite.map((item: any) => (
              <Link href={`/tours/tim-kiem?text=${item.name}`} key={item.id}>
                <h3
                  data-translate="true"
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
          <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
            {t("khach_san_noi_bat")}
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.hotel.map((hotel: any) => (
              <Link href={`/khach-san/${hotel.slug}`} key={hotel.id}>
                <h3
                  data-translate="true"
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
          <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
            {t("dich_vu_visa_noi_bat")}
          </h2>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {data.visa.map((visa: any) => (
              <Link href={`/visa/${visa.slug}`} key={visa.id}>
                <h3
                  data-translate="true"
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
