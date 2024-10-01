import { PostType, categoryPostsType } from "@/types/post";

const API_BASE_URL = "http://happy-book-api.test";

const fetchLastestNews = async (): Promise<PostType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/news?limit=3`, {
      cache: "reload",
    });
    const result = await response.json();
    return result.data.data ?? [];
  } catch (error) {
    console.error("Error fetching news data:", error);
    return [];
  }
};

const fetchNewsDetail = async (slug: string): Promise<PostType | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/news/${slug}`, {
      cache: "reload",
    });
    const result = await response.json();
    return result.data ?? null;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoryDetails = async (slug: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/news/categoryDetail/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return null;
  }
};

const fetchCategoriesWithNews = async (): Promise<categoryPostsType[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/news/categories-with-news`
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching news data:", error);
    return [];
  }
};

export {
  fetchLastestNews,
  fetchNewsDetail,
  fetchCategoryDetails,
  fetchCategoriesWithNews,
};
