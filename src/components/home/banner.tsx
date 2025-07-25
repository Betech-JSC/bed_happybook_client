import { BannerApi } from "@/api/Banner";
import BannerSlide from "./BannerSlide";

export default async function Banner() {
  const bannerData = (await BannerApi.getBannerPage("home"))?.payload
    ?.data as any;
  if (!bannerData?.length) return;
  return <BannerSlide data={bannerData} />;
}
