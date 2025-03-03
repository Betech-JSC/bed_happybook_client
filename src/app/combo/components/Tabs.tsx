import { renderTextContent } from "@/utils/Helper";

export default function Tabs({ data }: any) {
  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
          data-translate={true}
        >
          COMBO BAO GỒM
        </h2>
        <div
          data-translate={true}
          className="mt-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: renderTextContent(data?.combo?.description),
          }}
        ></div>
      </div>
      <div className="bg-white rounded-2xl p-6 mt-4">
        <h2
          className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold"
          data-translate={true}
        >
          ĐIỀU KIỆN ÁP DỤNG
        </h2>
        <div
          className="mt-4 leading-6"
          data-translate={true}
          dangerouslySetInnerHTML={{
            __html: renderTextContent(data?.combo?.requirements),
          }}
        ></div>
      </div>
    </div>
  );
}
