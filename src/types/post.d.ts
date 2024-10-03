export interface PostType {
  id: number;
  alias: string;
  locale: string;
  category_id: number;
  keywords: string;
  image_url: string;
  image_location: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string | null;
  };
  new_relation: PostType[];
}
export interface CategoryPostsType {
  id: number;
  name: string;
  alias: string;
  news: PostType[] | [];
}
export interface SidebarProps {
  categories: categoryPostsType[];
  news: PostType[];
}

export interface SearchParamsProps {
  page?: string;
  locale?: string;
}
