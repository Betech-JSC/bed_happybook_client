import { siteUrl } from "@/constants";
import { isBoolean } from "lodash";

export enum BlogTypes {
  NEWS = "tin-tuc",
  VISA = "visa",
  TOURS = "tours",
  HOTEL = "khach-san",
  SETTLE = "dinh-cu",
  COMPO = "compo",
  YACHT = "du-thuyen",
  TICKET = "ve-vui-choi",
}

export enum ProductTypes {
  VISA = "visa",
  TOURS = "tours",
  HOTEL = "khach-san",
  SETTLE = "dinh-cu",
}

export function pageUrl(
  slug: string,
  type: Omit<BlogTypes, BlogTypes.HOTEL> | null | boolean = null,
  hasOrigin: boolean = false
) {
  if (isBoolean(type)) {
    hasOrigin = type;
    type = null;
  }

  return `${hasOrigin ? siteUrl : ""}/${type ? `${type}/` : ""}${slug}`;
}

export function blogUrl(
  type: BlogTypes,
  slug: string,
  hasOrigin: boolean = false
) {
  return pageUrl(`${slug}`, type, hasOrigin);
}

export function productUrl(
  type: ProductTypes,
  slug: string,
  hasOrigin: boolean = false
) {
  return pageUrl(`${slug}`, type, hasOrigin);
}
