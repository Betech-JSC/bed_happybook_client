import type { Metadata } from "next";
import CheckoutPage from "./CheckoutPage";

export const metadata: Metadata = {
  title: "Thanh toán eSIM | HappyBook Travel",
  description: "Điền thông tin và hoàn tất thanh toán mua eSIM du lịch quốc tế.",
};

export default function Page() {
  return <CheckoutPage />;
}
