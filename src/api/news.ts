import http from "@/lib/http";
import { PostType, CategoryPostsType, SearchParamsProps } from "@/types/post";

const getNewsApiBaseUrl = () =>
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_INTERNAL_ENDPOINT ||
      process.env.NEXT_PUBLIC_API_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;

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
  const baseUrl = getNewsApiBaseUrl();
  const locale = searchParams.locale || "vi";

  try {
    const response = await fetch(
      `${baseUrl}/news/${slug}?locale=${locale}`,
      {
        next: { revalidate: 0 },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      return null;
    }

    const data = result.data ?? result.payload?.data ?? null;
    return data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoryDetails = async (
  alias: string,
  searchParams: SearchParamsProps
): Promise<any> => {
  const baseUrl = getNewsApiBaseUrl();
  try {
    const response = await fetch(
      `${baseUrl}/news/categoryDetail/${alias}?page=${
        searchParams.page ?? ""
      }&locale=${searchParams.locale ?? "vi"}`,
      {
        next: { revalidate: 0 },
      }
    );
    const result = await response.json();
    return result.data ?? result.payload?.data ?? null;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoriesWithNews = async (): Promise<CategoryPostsType[]> => {
  const baseUrl = getNewsApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/news/categories-with-news`, {
      next: { revalidate: 0 },
    });
    const result = await response.json();
    return result.data ?? result.payload?.data ?? [];
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
