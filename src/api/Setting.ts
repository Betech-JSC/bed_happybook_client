import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";
import { unstable_cache } from "next/cache";

const path = "/setting";

const getCachedMetaSeo = unstable_cache(
  async () => {
    const response = await http.get<any>(
      `${path}?keys=${[
        "seo_title",
        "seo_image",
        "seo_description",
        "seo_keywords",
        "seo_hotline",
        "seo_phone",
        "seo_address",
        "seo_opening_hours",
        "seo_link_twitter",
        "seo_link_fb",
      ].join(",")}`
    );
    return response?.payload?.data ?? {};
  },
  ["cached-setting-meta-seo"],
  {
    revalidate: 60 * 60,
  }
);

const settingApi = {
  getMetaSeo: () =>
    http.get<any>(
      `${path}?keys=${[
        "seo_title",
        "seo_image",
        "seo_description",
        "seo_keywords",
        "seo_hotline",
        "seo_phone",
        "seo_address",
        "seo_opening_hours",
        "seo_link_twitter",
        "seo_link_fb",
      ].join(",")}`
    ),
  getCachedMetaSeo: getCachedMetaSeo,
};

export { settingApi };
