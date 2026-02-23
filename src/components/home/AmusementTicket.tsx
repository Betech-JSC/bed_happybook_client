import Image from "next/image";
import { HomeApi } from "@/api/Home";
import AmusementTicketTabs from "./AmusementTicketTabs";

export default async function HomeAmusementTicket() {
  const data = ((await HomeApi.index("ticket"))?.payload?.data as any) ?? [];
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
            src="/bg-img/tour-quoc-te.png"
            width={1280}
            height={500}
            alt="Vé vui chơi Happy Book"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          {/* Tabs */}
          <AmusementTicketTabs title="ve_vui_choi" data={data} />
        </div>
        {/* End */}
      </div>
    </div>
  );
}
