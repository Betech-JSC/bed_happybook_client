import AccountSidebar from "../components/AccountSidebar";
import { isEmpty } from "lodash";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { FlightApi } from "@/api/Flight";
import FlightBookingHistory from "../components/FlightBookingHistory";

export default async function FlightBookingHistoryIndex() {
  const session = await getSession();
  const token = session.access_token;
  if (isEmpty(token)) {
    redirect("/dang-nhap");
  }
  const response = await FlightApi.bookingHistory(token);
  if (response?.status === 401) {
    redirect("/dang-nhap");
  }
  const data = response?.payload?.data ?? [];
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
      <div className="my-8 flex flex-col lg:flex-row gap-4">
        <AccountSidebar userInfo={session.userInfo} />
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6 w-full border-[#AEBFFF] border">
          <FlightBookingHistory flights={data} airports={airportsData} />
        </div>
      </div>
    </main>
  );
}
