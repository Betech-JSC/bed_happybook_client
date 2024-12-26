import { siteUrl } from "@/constants";

export function newsUrl(hasOrigin: boolean = false) {
  return `${hasOrigin ? siteUrl : ""}/tin-tuc`;
}

export function newsCategoryUrl(slug: string, hasOrigin: boolean = false) {
  return `${hasOrigin ? siteUrl : ""}/tin-tuc/${slug}`;
}

export function newsDetailUrl(slug: string, hasOrigin: boolean = false) {
  return `${hasOrigin ? siteUrl : ""}/tin-tuc/chi-tiet/${slug}`;
}

export function pageUrl(slug: string, hasOrigin: boolean = false) {
  return `${hasOrigin ? siteUrl : ""}/${slug}`;
}
