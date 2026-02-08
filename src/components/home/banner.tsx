import BannerSlide from "./BannerSlide";
import { getCachedBanner } from "@/app/utils/home-cached-api";

export default async function Banner() {
  const bannerData = (await getCachedBanner("home"))?.payload?.data as any;
  if (!bannerData?.length) return;
  return <BannerSlide data={bannerData} />;
}
