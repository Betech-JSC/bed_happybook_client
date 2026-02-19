import Image from "next/image";
import VisaTabs from "@/app/visa/components/VisaTabs";
import { HomeApi } from "@/api/Home";

export default async function VisaService() {
  const data = ((await HomeApi.index("visa"))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative py-6 lg:mt-12 lg:px-6 lg:py-8 rounded-3xl">
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
            src="/bg-img/visa.png"
            width={1280}
            height={500}
            alt="Dịch vụ Visa Happy Book"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          {/* <div className="flex justify-between">
            <div>
              <h2 className="text-[24px] lg:text-[32px] font-bold">
                {t("dich_vu_visa_noi_bat")}
              </h2>
            </div>
            <Link
              href="visa/tim-kiem?text=tat-ca-visa-noi-bat"
              className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
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
          <p className="text-sm lg:text-16 font-medium mt-3">
            {t("dich_vu_lam_visa_nhanh_chong_uy_tin_ho_tro_247_ty_le_dau_cao")}
          </p>
          <Link
            href="visa/tim-kiem?text=tat-ca-visa-noi-bat"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
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
          </Link> */}
          {/* Tabs */}
          <VisaTabs
            title="dich_vu_visa_noi_bat"
            defaultCategoryAlias="tim-kiem?text=tat-ca-visa-noi-bat"
            data={data}
          />
        </div>
        {/* End */}
      </div>
    </div>
  );
}
