import { fetchNewsDetail } from "@/api/news";
import { SearchParamsProps } from "@/types/post";
import { cache } from "react";

export const getCachedNewsDetail = cache(
    async (slug: string, searchParams: SearchParamsProps) => {
        return await fetchNewsDetail(slug, searchParams);
    }
);
