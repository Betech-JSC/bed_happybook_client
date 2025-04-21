import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (id: number, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`/product/tours/detail/${id}?locale=${locale}`);
  },

  getDetailBySlug: (slug: string) =>
    http.get<any>(`/product/tours/tour-by-slug?slug=${slug}`),

  getCategory: (slug: string) => http.get<any>(`/product/tours/categories/${slug}`),

  getAll: () => http.get<any>("product/tours/all"),

  search: (url: string) => http.get<any>(url),
  getOptionsFilter: (typeTour: number | undefined) =>
    http.get<any>(`product/tours/options-filter?typeTour=${typeTour}`),

  getCountry: () => http.get<any>("/product/tours/list-country"),

  // Route::get('/list-area-by-country', [ProductTourController::class,'listAreaByCountry']);
  getAreaByCountry: (countryId: number) =>
    http.get<any>(`/product/tours/list-area-by-country?country_id=${countryId}`),

  // Route::get('/list-city-by-location', [ProductTourController::class,'listCityByLocation']);
  getCityByLocation: (locationId: number, areaId: number) =>
    http.get<any>(`/product/tours/list-city-by-location?location_id=${locationId}&area_id=${areaId}`),

  // Route::get('/list-district-by-city', [ProductTourController::class,'listDistrictByCity']);
  getDistrictByCity: (cityId: number, areaId: number, locationId: number) =>
    http.get<any>(`/product/tours/list-district-by-city?city_id=${cityId}&area_id=${areaId}&location_id=${locationId}`),

  getListCategoryTour: () => http.get<any>("/product/tours/categories"),
};

export { TourApi };
