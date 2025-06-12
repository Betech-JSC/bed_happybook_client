import { renderTextContent } from "@/utils/Helper";
import "@/styles/ckeditor-content.scss";
import { Fragment } from "react";

export default function DisplayContentEditor({
  content,
  autoTranslate = false,
}: {
  content: string | undefined | null;
  autoTranslate?: boolean;
}) {
  return (
    <Fragment>
      {autoTranslate ? (
        <div
          data-translate="true"
          className="ckeditor_content_container"
          dangerouslySetInnerHTML={{
            __html: renderTextContent(content),
          }}
        ></div>
      ) : (
        <div
          className="ckeditor_content_container"
          dangerouslySetInnerHTML={{
            __html: renderTextContent(content),
          }}
        ></div>
      )}
    </Fragment>
  );
}
