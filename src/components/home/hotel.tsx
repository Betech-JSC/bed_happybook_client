import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import HotelTabs from "@/app/khach-san/components/HotelTabs";
import { getCachedHomeIndex } from "@/app/utils/home-cached-api";
import { getServerT } from "@/lib/i18n/getServerT";

export default async function Hotel() {
  const data =
    ((await getCachedHomeIndex("hotel"))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  const t = await getServerT();

  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative lg:mb-8 lg:mt-12 lg:px-6 py-6 lg:py-8">
        {/* Background */}
        <div
          className="rounded-3xl absolute inset-0 hidden lg:block"
          style={{
            background: "#FCFCFD",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        ></div>
        {/* Background Image */}
        <div className="absolute inset-0 z-[2] hidden lg:block">
          <Image
            src="/bg-img/hotel.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className={`relative z-10 ${styles.hide__background_mb}`}>
          <div className="flex justify-between">
            <div>
              <h2 className="text-[24px] lg:text-[32px] font-bold">
                {t("da_dang_lua_chon_khach_san")}
              </h2>
            </div>
            <Link
              href="/khach-san"
              className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">
                {t("xem_tat_ca")}
              </button>
              <Image
                className=" hover:scale-110 ease-in duration-300"
                src="/icon/chevron-right.svg"
                alt="Icon"
                width={20}
                height={20}
              />
            </Link>
          </div>
          <p className="text-sm lg:text-base font-medium mt-3">
            {/* Dịch vụ làm visa nhanh chóng, uy tín, hỗ trợ 24/7. Tỷ lệ đậu cao! */}
          </p>
          <Link
            href="/khach-san"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
          >
            <button className="text-[#175CD3] font-medium">
              {t("xem_tat_ca")}
            </button>
            <Image
              className=" hover:scale-110 ease-in duration-300"
              src="/icon/chevron-right.svg"
              alt="Icon"
              width={20}
              height={20}
            />
          </Link>
          {/* Tabs */}
          <HotelTabs data={data} />
        </div>
        {/* End */}
      </div>
    </div>
  );
}
