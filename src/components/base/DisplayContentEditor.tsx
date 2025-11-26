"use client";

import { renderTextContent } from "@/utils/Helper";
import "@/styles/ckeditor-content.scss";
import { Fragment, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DisplayContentEditor({
  content,
  autoTranslate = false,
}: {
  content: string | undefined | null;
  autoTranslate?: boolean;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: any) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");

      // ❌ Không can thiệp link null
      if (!href) return;

      // ❌ Link ngoài → mở bình thường
      if (href.startsWith("http://") || href.startsWith("https://")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        return;
      }

      // ❌ Link mailto, tel → giữ nguyên
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // ❌ Anchor trong trang (scroll)
      if (href.startsWith("#")) return;

      // ✔ Link nội bộ → không reload, navigate SPA
      if (href.startsWith("/")) {
        e.preventDefault();
        router.push(href);
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [router]);

  return (
    <Fragment>
      {autoTranslate ? (
        <div
          ref={ref}
          data-translate="true"
          className="ckeditor_content_container"
          dangerouslySetInnerHTML={{ __html: renderTextContent(content) }}
        />
      ) : (
        <div
          ref={ref}
          className="ckeditor_content_container"
          dangerouslySetInnerHTML={{ __html: renderTextContent(content) }}
        />
      )}
    </Fragment>
  );
}
