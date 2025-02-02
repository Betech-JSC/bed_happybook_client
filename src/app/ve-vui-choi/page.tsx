import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import Search from "./components/Search";

export default function EntertainmentTickets() {
  const optionsFilter = [
    {
      label: "Điểm vui chơi",
      name: "vevuichoi",
      option: [
        {
          value: 1,
          label: "Phú Quốc",
        },
        {
          value: 2,
          label: "Hạ Long",
        },
        {
          value: 3,
          label: "Nha Trang",
        },
      ],
    },
  ];
  return (
    <div className="bg-gray-100">
      <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
        <Breadcrumb className="pt-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-blue-700">
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <p className="text-blue-700">Vé vui chơi</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Suspense>
          <Search optionsFilter={optionsFilter} />
        </Suspense>
      </div>
    </div>
  );
}
