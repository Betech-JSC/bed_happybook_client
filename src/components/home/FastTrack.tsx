import Image from "next/image";
import { HomeApi } from "@/api/Home";
import FastTrackTabs from "./FastTrackTabs";

export default async function HomeFastTrack() {
  const data =
    ((await HomeApi.index("fast-track"))?.payload?.data as any) ?? [];
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
            src="/bg-img/tour-noi-dia.png"
            width={1280}
            height={500}
            alt="Fast Track Happy Book"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          {/* Tabs */}
          <FastTrackTabs
            title="fast_track"
            defaultCategoryAlias=""
            data={data}
          />
        </div>
        {/* End */}
      </div>
    </div>
  );
}
