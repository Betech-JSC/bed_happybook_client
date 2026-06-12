import Link from "next/link";
import type { Metadata } from "next";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

function getMetadata(lang: string) {
  const isVi = lang === "vi";
  return formatMetadata({
    title: isVi ? "Đặt Vé Tàu Hỏa Trực Tuyến - Hỗ Trợ 24/7" : "Book Train Tickets Online - Support 24/7",
    description: isVi 
      ? "Đặt vé tàu hỏa trực tuyến nhanh chóng, tiện lợi. Hỗ trợ tư vấn thông tin hành trình và đặt vé qua Zalo OA 24/7."
      : "Book train tickets online quickly and conveniently. Support for journey information and booking via Zalo OA 24/7.",
    alternates: {
      canonical: pageUrl("ve-tau", true),
    },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  return getMetadata(language);
}

export default async function TrainTicketPage() {
  const language = await getServerLang();
  const t = await getServerT();
  const isVi = language === "vi";
  const metadata = getMetadata(language);

  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: isVi ? "Vé tàu" : "Train Ticket",
        },
      ]}
    >
      <main className="bg-gray-50 min-h-screen pb-16 mt-[68px] lg:mt-[132px]">
        {/* Banner Section */}
        <div
          className="h-[240px] md:h-[320px] w-full relative flex items-center justify-center text-white"
          style={{
            backgroundImage: "linear-gradient(180deg, #04349A 0%, #1755DC 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative text-center z-[1] px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isVi ? "Dịch Vụ Đặt Vé Tàu Hỏa" : "Train Ticket Booking Service"}
            </h1>
            <p className="text-sm md:text-base opacity-90 max-w-xl mx-auto font-medium">
              {isVi 
                ? "Kết nối các tuyến đường sắt Bắc Nam nhanh chóng và an toàn." 
                : "Connecting North-South railway lines quickly and safely."}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-3 lg:px-[80px] pt-3 max__screen mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumb className="py-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700 hover:underline">
                    {t("trang_chu")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <p className="text-gray-700 font-medium">
                  {isVi ? "Vé tàu" : "Train Ticket"}
                </p>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Contact Box */}
          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 max-w-[800px] mx-auto text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image src="/icon/Ticket.svg" alt="Train Ticket" width={32} height={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isVi ? "Thông Báo Đặt Vé" : "Booking Notice"}
            </h2>

            <div className="text-gray-600 leading-relaxed space-y-4 mb-8 text-left md:text-center max-w-[620px] mx-auto">
              <p className="font-medium text-base">
                {isVi
                  ? "Hiện tại hệ thống đang nâng cấp tính năng tự động đặt vé tàu hỏa trực tuyến."
                  : "We are currently upgrading the automated online train ticket booking system."}
              </p>
              <p>
                {isVi
                  ? "Để kiểm tra lịch trình, giá vé và được hỗ trợ đặt vé nhanh nhất, Quý khách vui lòng liên hệ trực tiếp với bộ phận chăm sóc khách hàng của HappyBook qua Zalo Official Account (Zalo OA)."
                  : "To check schedules, ticket prices, and for the fastest booking assistance, please contact HappyBook customer support directly via our Zalo Official Account (Zalo OA)."}
              </p>
              <p className="text-sm text-gray-500">
                {isVi
                  ? "*Đội ngũ hỗ trợ của chúng tôi hoạt động 24/7 để phục vụ Quý khách."
                  : "*Our support team is available 24/7 to serve you."}
              </p>
            </div>

            <a
              href="https://zalo.me/2451421179976954585/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[#0068FF] hover:bg-[#0052cc] text-white font-semibold px-8 py-4 rounded-2xl shadow-md duration-300 transition-all text-lg w-full sm:w-auto"
            >
              <Image src="/language/vi.svg" alt="Zalo" width={20} height={20} className="rounded-full bg-white" />
              <span>{isVi ? "Liên hệ qua Zalo OA" : "Contact via Zalo OA"}</span>
            </a>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
