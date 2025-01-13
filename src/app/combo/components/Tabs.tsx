export default function Tabs({ data }: any) {
  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-2xl p-6">
        <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
          COMBO BAO GỒM
        </h2>
        <div
          className="mt-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: data?.compo?.description ?? "Nội dung đang cập nhật...",
          }}
        ></div>
      </div>
      <div className="bg-white rounded-2xl p-6 mt-4">
        <h2 className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold">
          ĐIỀU KIỆN ÁP DỤNG
        </h2>
        <div
          className="mt-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: data?.compo?.requirements ?? "Nội dung đang cập nhật...",
          }}
        ></div>
      </div>
    </div>
  );
}
