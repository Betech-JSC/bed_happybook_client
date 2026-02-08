import ContentByPage from "@/components/content-page/ContentByPage";
import { getCachedPageContent } from "../utils/cached-api";
import { getServerLang } from "@/lib/session";

export default async function ContentSection() {
    const language = await getServerLang();
    const contentPage = await getCachedPageContent(language);

    if (!contentPage?.content) return null;

    return (
        <div className="mt-8 rounded-2xl bg-gray-50 p-8">
            <ContentByPage data={contentPage} />
        </div>
    );
}
