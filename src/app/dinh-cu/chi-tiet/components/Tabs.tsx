import { renderTextContent } from "@/utils/Helper";

export default function Tabs({ data }: any) {
  return (
    <div className="w-full mt-6">
      <div className="mt-4 transition-all duration-300">
        <div className="bg-white rounded-2xl p-6">
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate
          >
            Tổng quan
          </h2>
          <div
            data-translate
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html: renderTextContent(data.content_gia_dich_vu),
            }}
          ></div>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-4">
          <h2
            className="pl-2 border-l-4 mb-4 border-[#F27145] text-22 font-bold"
            data-translate
          >
            Đối tượng thỏa điều kiện
          </h2>
          <div
            data-translate
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html: renderTextContent(data.content_tim_hieu_visa),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
