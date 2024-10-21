export default function SideBar() {
  return (
    <aside className="lg:col-span-3 bg-white p-4 rounded-2xl">
      <div className="pb-3 border-b border-gray-200">
        <h2 className="font-semibold">Sắp xếp</h2>
        <select
          name=""
          id=""
          className="w-full p-3 mt-3 border border-gray-300 rounded-lg"
        >
          <option value="">Đề xuất</option>
        </select>
      </div>
      <div className="mt-3 pb-3 border-b border-gray-200">
        <h2 className="font-semibold">Hiển thị giá</h2>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="price_1" />
          <label htmlFor="price_1">Giá bao gồm thuế phí</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="price_2" />
          <label htmlFor="price_2">Giá chưa bao gồm thuế phí</label>
        </div>
      </div>
      <div className="mt-3 pb-3 border-b border-gray-200">
        <h2 className="font-semibold">Sắp xếp</h2>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="sort_price_1" />
          <label htmlFor="sort_price_1">Giá thấp tới cao</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="sort_price_2" />
          <label htmlFor="sort_price_2">Thời gian khởi hành</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="sort_price_3" />
          <label htmlFor="sort_price_3">Hãng hàng không</label>
        </div>
      </div>
      <div className="mt-3 pb-3 border-b border-gray-200">
        <h2 className="font-semibold">Hãng hàng không</h2>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="airline_1" />
          <label htmlFor="airline_1">Bamboo Airline</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="airline_2" />
          <label htmlFor="airline_2">Vietjet Air</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="airline_3" />
          <label htmlFor="airline_3">Vietnam Airlines</label>
        </div>
        <div className="flex space-x-2 mt-3">
          <input type="checkbox" name="price" id="airline_4" />
          <label htmlFor="airline_4">Vietnam Airlines</label>
        </div>
      </div>
      <button className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium">
        Xóa bộ lọc
      </button>
    </aside>
  );
}
