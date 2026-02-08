import DisplayContentEditor from "@/components/base/DisplayContentEditor";
import TableOfContents from "../../tin-tuc/components/TableOfContents";
import { renderTextContent } from "@/utils/Helper";
import { translateText } from "@/utils/translateApi";
import { PostType } from "@/types/post";

export default async function BlogContentSection({
    detail,
    language,
}: {
    detail: PostType;
    language: string;
}) {
    let translateData: any = {};

    // Blocking translation logic moved here
    await translateText(
        [renderTextContent(detail.content), renderTextContent(detail.toc)],
        language
    ).then((data) => {
        translateData.content = data[0];
        translateData.toc = data[1];
    });

    return (
        <>
            <div
                data-translate="true"
                className="mb-8 pb-8 border-b-2 border-gray-200"
            >
                <DisplayContentEditor content={detail?.description} />
            </div>
            <TableOfContents toc={translateData?.toc} />
            {translateData?.content && (
                <div className="post__detail_content md:max-w-[460px] lg:max-w-[820px] overflow-hidden">
                    <DisplayContentEditor content={translateData.content} />
                </div>
            )}
        </>
    );
}
