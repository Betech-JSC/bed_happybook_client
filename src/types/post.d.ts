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
  meta_title: string;
  meta_description: string;
  meta_robots: string;
  canonical_link: string;
  meta_image: string;
  ordering: number;
  created_at: string;
  updated_at: string;
  category: CategoryPostsType;
  new_relation: PostType[];
  categories_relation: CategoryPostsType[];
}
export interface CategoryPostsType {
  id: number;
  name: string;
  alias: string;
  parent_id: number;
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
