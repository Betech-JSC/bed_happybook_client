import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "/setting";

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
};

export { settingApi };
