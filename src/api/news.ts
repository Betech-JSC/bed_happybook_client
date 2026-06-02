import http from "@/lib/http";
import { PostType, CategoryPostsType, SearchParamsProps } from "@/types/post";

const getNewsApiBaseUrl = () =>
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_INTERNAL_ENDPOINT ||
    process.env.NEXT_PUBLIC_API_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;

const toTimestamp = (value?: string | null) => {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortNewsByCreatedAtDesc = <T extends Partial<PostType>>(items: T[] = []) =>
  [...items].sort((a, b) => {
    const createdDiff = toTimestamp(b.created_at) - toTimestamp(a.created_at);
    if (createdDiff !== 0) return createdDiff;

    const updatedDiff = toTimestamp(b.updated_at) - toTimestamp(a.updated_at);
    if (updatedDiff !== 0) return updatedDiff;

    return Number(b.id ?? 0) - Number(a.id ?? 0);
  });

const normalizeCategoryNews = (category: CategoryPostsType): CategoryPostsType => ({
  ...category,
  news: sortNewsByCreatedAtDesc(category.news ?? []),
});

const normalizeNewsIndexData = (data: any) => {
  if (!data) return data;

  return {
    ...data,
    lastestPosts: sortNewsByCreatedAtDesc(data.lastestPosts ?? []),
    categoriesWithPosts: Array.isArray(data.categoriesWithPosts)
      ? data.categoriesWithPosts.map(normalizeCategoryNews)
      : data.categoriesWithPosts,
  };
};

const normalizeCategoryDetailData = (data: any) => {
  if (!data?.news?.data) return data;

  return {
    ...data,
    news: {
      ...data.news,
      data: sortNewsByCreatedAtDesc(data.news.data),
    },
  };
};

const newsApi = {
  fetchNewsIndex: async (locale = "vi") => {
    const response = (await http.get<any>(`news?locale=${locale}&is_happybook=1`, undefined, 3600)) ?? {
      payload: {},
    };

    return {
      ...response,
      payload: {
        ...response.payload,
        data: normalizeNewsIndexData(response?.payload?.data),
      },
    };
  },
  getLastedNewsByPage: async (page: string = "", locale = "vi") => {
    const response = (await http.get<any>(
      `news/lastest-news-by-page?page=${page}&locale=${locale}&is_happybook=1`
    )) ?? { payload: {} };

    return {
      ...response,
      payload: {
        ...response.payload,
        data: sortNewsByCreatedAtDesc(response?.payload?.data ?? []),
      },
    };
  },
};

const fetchNewsDetail = async (
  slug: string,
  searchParams: SearchParamsProps
): Promise<PostType | null> => {
  const baseUrl = getNewsApiBaseUrl();
  const locale = searchParams.locale || "vi";

  try {
    const response = await fetch(
      `${baseUrl}/news/${slug}?locale=${locale}&is_happybook=1`,
      {
        next: { revalidate: 0 },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      return null;
    }

    const data = result.data ?? result.payload?.data ?? null;
    return normalizeCategoryDetailData(data);
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
      `${baseUrl}/news/categoryDetail/${alias}?page=${searchParams.page ?? ""
      }&locale=${searchParams.locale ?? "vi"}&is_happybook=1`,
      {
        next: { revalidate: 3600 },
      }
    );
    const result = await response.json();
    const data = result.data ?? result.payload?.data ?? null;
    return normalizeCategoryDetailData(data);
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoriesWithNews = async (locale = "vi"): Promise<CategoryPostsType[]> => {
  const baseUrl = getNewsApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/news/categories?locale=${locale}&is_happybook=1`, {
      next: { revalidate: 3600 },
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
