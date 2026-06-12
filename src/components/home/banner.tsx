import BannerSlide from "./BannerSlide";
import { getCachedBanner } from "@/app/utils/home-cached-api";
import { getServerLang } from "@/lib/session";

export default async function Banner() {
  const language = await getServerLang();
  const bannerData = (await getCachedBanner("home", language))?.payload?.data as any;
  if (!bannerData?.length) return;
  return <BannerSlide data={bannerData} />;
}
