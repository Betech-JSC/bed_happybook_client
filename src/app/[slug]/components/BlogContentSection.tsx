import DisplayContentEditor from "@/components/base/DisplayContentEditor";
import TableOfContents from "../../tin-tuc/components/TableOfContents";
import { renderTextContent } from "@/utils/Helper";
import { PostType } from "@/types/post";

export default async function BlogContentSection({
    detail,
    language,
}: {
    detail: PostType;
    language: string;
}) {
    return (
        <>
            <div
                className="mb-8 pb-8 border-b-2 border-gray-200"
            >
                <DisplayContentEditor content={detail?.description} />
            </div>
            {detail?.toc && <TableOfContents toc={renderTextContent(detail?.toc)} />}
            {detail?.content && (
                <div className="post__detail_content md:max-w-[460px] lg:max-w-[820px] overflow-hidden">
                    <DisplayContentEditor content={renderTextContent(detail.content)} />
                </div>
            )}
        </>
    );
}

