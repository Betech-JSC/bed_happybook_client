import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";
import { unstable_cache } from "next/cache";

const path = "/setting";

const isDev = process.env.NODE_ENV === "development";

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
    revalidate: isDev ? 1 : 60 * 60,
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
  getWelcomeSettings: () =>
    http.get<any>(
      `${path}?keys=welcome50k_vnd_discount_amount,welcome50k_usd_discount_amount,welcome10_fast-track_discount_percent,welcome10_yacht_discount_percent,welcome10_entertainment_ticket_discount_percent,welcome10_insurance_discount_percent,welcome10_visa_discount_percent`,
      { cache: "no-store" },
      10000,
      0
    ),
};

export { settingApi };
