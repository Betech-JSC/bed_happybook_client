import AccountSidebar from "../components/AccountSidebar";
import { isEmpty } from "lodash";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { FlightApi } from "@/api/Flight";
import FlightBookingHistory from "../components/FlightBookingHistory";
import Pagination from "@/components/base/pagination";
import { SearchParamsProps } from "@/types/post";

export default async function FlightBookingHistoryIndex({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const session = await getSession();
  const token = session.access_token;
  if (isEmpty(token)) {
    redirect("/dang-nhap");
  }
  const currentPage = parseInt(searchParams?.page || "1");
  const response = await FlightApi.bookingHistory(token, currentPage);
  if (response?.status === 401) {
    redirect("/dang-nhap");
  }
  const data = response?.payload?.data;
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  const flights = data?.data ?? [];
  const totalPages: number = data.last_page;
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="my-8 flex flex-col lg:flex-row gap-4">
        <AccountSidebar userInfo={session.userInfo} />
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6 w-full border-[#AEBFFF] border">
          <FlightBookingHistory flights={flights} airports={airportsData} />
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
