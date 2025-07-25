import { HomeApi } from "@/api/Home";
import { getServerT } from "@/lib/i18n/getServerT";
import Image from "next/image";
import Link from "next/link";
import TourTabs from "./TourTabs";

export default async function TourQuocTe() {
  const data =
    ((await HomeApi.index("tour-international"))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  const t = await getServerT();
  return (
    <div className="hidden lg:block px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative mt-12 px-6 py-8 rounded-3xl">
        {/* Background */}
        <div
          className="absolute inset-0 hidden lg:block rounded-3xl"
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
            src="/bg-img/tour-quoc-te.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between">
            <div>
              <h2 className="text-[32px] font-bold">{t("tour_quoc_te")}</h2>
            </div>
            <Link
              href="/tours/tour-quoc-te"
              className="flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">
                {" "}
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
          <p className="text-16 font-medium mt-3">
            {t("trai_nghiem_sac_vang_va_kham_pha_van_hoa_mua_thu")}
          </p>
          {/* Tabs */}
          <TourTabs data={data} />
        </div>
        {/* End */}
      </div>
    </div>
  );
}
