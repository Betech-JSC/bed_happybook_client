"use client";

import { renderTextContent } from "@/utils/Helper";
import "@/styles/ckeditor-content.scss";
import { useEffect, useState } from "react";
import { translateText } from "@/utils/translateApi";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Tabs({ data }: any) {
  const { language } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState<string[]>([]);
  useEffect(() => {
    translateText(
      [
        renderTextContent(data?.combo?.description),
        renderTextContent(data?.combo?.requirements),
      ],
      language
    ).then((dataTranslate) => {
      setTranslatedContent(dataTranslate);
    });
  }, [data, language]);

  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
          data-translate="true"
        >
          COMBO BAO GỒM
        </h2>
        <div className="ckeditor_container mt-4">
          <div
            className="cke_editable"
            dangerouslySetInnerHTML={{
              __html: translatedContent[0],
            }}
          ></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 mt-4">
        <h2
          className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold"
          data-translate="true"
        >
          ĐIỀU KIỆN ÁP DỤNG
        </h2>
        <div className="ckeditor_container mt-4">
          <div
            className="cke_editable"
            dangerouslySetInnerHTML={{
              __html: translatedContent[1],
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
