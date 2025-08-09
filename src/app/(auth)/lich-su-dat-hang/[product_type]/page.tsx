import { isEmpty } from "lodash";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Pagination from "@/components/base/pagination";
import { SearchParamsProps } from "@/types/post";
import AccountSidebar from "../../components/AccountSidebar";
import OrderHistory from "../components/OrderHistory";
import { BookingProductApi } from "@/api/BookingProduct";
import { getServerT } from "@/lib/i18n/getServerT";

type ProductType =
  | "khach-san"
  | "tour"
  | "visa"
  | "du-thuyen"
  | "ve-vui-choi"
  | "combo"
  | "bao-hiem"
  | "fast-track";

interface ProductItem {
  label: string;
  type:
    | "hotel"
    | "tour"
    | "visa"
    | "yacht"
    | "ticket"
    | "combo"
    | "insurance"
    | "fast-track";
  path: string;
  page: string;
}

const products: Record<ProductType, ProductItem> = {
  "khach-san": {
    label: "Khách sạn",
    type: "hotel",
    path: "/lich-su-dat-hang/khach-san",
    page: "/khach-san",
  },
  tour: {
    label: "Tour du lịch",
    type: "tour",
    path: "/lich-su-dat-hang/tour",
    page: "/tours",
  },
  visa: {
    label: "Visa",
    type: "visa",
    path: "/lich-su-dat-hang/visa",
    page: "/visa",
  },
  "du-thuyen": {
    label: "Du thuyền",
    type: "yacht",
    path: "/lich-su-dat-hang/du-thuyen",
    page: "/du-thuyen",
  },
  "ve-vui-choi": {
    label: "Vé vui chơi",
    type: "ticket",
    path: "/lich-su-dat-hang/ve-vui-choi",
    page: "/ve-vui-choi",
  },
  "fast-track": {
    label: "Fast track",
    type: "fast-track",
    path: "/lich-su-dat-hang/fast-track",
    page: "/fast-track",
  },
  "bao-hiem": {
    label: "Bảo hiểm",
    type: "insurance",
    path: "/lich-su-dat-hang/bao-hiem",
    page: "/bao-hiem",
  },
  combo: {
    label: "Combo",
    type: "combo",
    path: "/lich-su-dat-hang/combo",
    page: "/combo",
  },
};

export default async function FlightBookingHistory({
  params,
  searchParams,
}: {
  params: { product_type: ProductType };
  searchParams: SearchParamsProps;
}) {
  const productType = params?.product_type;
  const product = products[productType];
  if (!product) notFound();

  const session = await getSession();
  const token = session.access_token;
  if (isEmpty(token)) {
    redirect("/dang-nhap");
  }
  const t = await getServerT();
  const currentPage = parseInt(searchParams?.page || "1");
  const response = await BookingProductApi.History(
    token,
    product.type,
    currentPage
  );
  if (response?.status === 401) {
    redirect("/dang-nhap");
  }
  const data = response?.payload?.data;
  const history = data?.data ?? [];
  const totalPages: number = data?.last_page;
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="my-8 flex flex-col lg:flex-row gap-4">
        <AccountSidebar userInfo={session.userInfo} />
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6 w-full border-[#AEBFFF] border">
          <OrderHistory
            title={`${t("lich_su_dat_hang")} (${product.label})`}
            product={product}
            data={history}
          />
          {/* Paginate */}
          {totalPages > 1 && currentPage <= totalPages && (
            <div className="mt-8">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
