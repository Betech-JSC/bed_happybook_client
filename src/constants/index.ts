export const siteUrl = process.env.SITE_URL || "https://happybooktravel.com";

export const apiUrl = process.env.API_URL || "https://api.happybooktravel.com";

export const cmsUrl =
  process.env.NEXT_PUBLIC_CMS_URL ||
  process.env.CMS_URL ||
  apiUrl.replace(/\/api\/v1\/?$/, "");
