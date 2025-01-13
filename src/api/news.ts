import http from "@/lib/http";
import { PostType, CategoryPostsType, SearchParamsProps } from "@/types/post";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

const newsApi = {
  fetchNewsIndex: (locale = "vi") =>
    http.get<any>(`news?locale=${locale}`, undefined, 3000),
  getLastedNewsByPage: (page: string = "") =>
    http.get<any>(`news/lastest-news-by-page?page=${page}`),
};

const fetchNewsDetail = async (
  slug: string,
  searchParams: SearchParamsProps
): Promise<PostType | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/${slug}?locale=${searchParams.locale ?? ""}`,
      {
        next: { revalidate: 0 },
      }
    );
    const result = await response.json();
    return result.data ?? null;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoryDetails = async (
  alias: string,
  searchParams: SearchParamsProps
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news/categoryDetail/${alias}?page=${
        searchParams.page ?? ""
      }&locale=${searchParams.locale ?? ""}`,
      {
        next: { revalidate: 0 },
      }
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoriesWithNews = async (): Promise<CategoryPostsType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/news/categories-with-news`, {
      next: { revalidate: 0 },
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return [];
  }
};

export {
  newsApi,
  fetchNewsDetail,
  fetchCategoryDetails,
  fetchCategoriesWithNews,
};
