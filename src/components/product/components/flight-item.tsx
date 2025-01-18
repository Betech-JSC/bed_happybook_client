import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { buildSearch } from "@/utils/Helper";
import { format, isValid } from "date-fns";

export default function FlightItem({ data }: any) {
  if (!data) return;
  const pararmSearch = {
    tripType: "oneWay",
    cheapest: 0,
    StartPoint: data.flight.data_diem_di.ma_dia_diem,
    EndPoint: data.flight.data_diem_den.ma_dia_diem,
    DepartDate: isValid(new Date(data.flight.ngay_khoi_hanh))
      ? format(data.flight.ngay_khoi_hanh, "ddMMyyyy")
      : format(new Date(), "ddMMyyyy"),
    ReturnDate: "",
    Adt: 1,
    Chd: 0,
    Inf: 0,
    from: data.flight.data_diem_di.ten_dia_diem,
    to: data.flight.data_diem_den.ten_dia_diem,
  };
  const querySerach = `/ve-may-bay/tim-kiem-ve${buildSearch(pararmSearch)}`;
  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={querySerach}>
          <Image
            className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
            src={`${data.image_url}/${data.image_location}`}
            alt="Image"
            width={200}
            height={160}
            style={{ height: 220, width: "100%" }}
          />
          {/* {type == 1 && (
            <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
              <span>Khứ hồi</span>
            </div>
          )} */}
        </Link>
      </div>
      <div className="py-3 px-4">
        <div className="flex text-sm h-5">
          <Image
            src={`${data.image_url}/${data.flight.data_hang_bay?.logo}`}
            alt="Airline logo"
            width={60}
            height={24}
          />
          <p className="ml-2">{data.flight.data_hang_bay.name}</p>
        </div>
        <Link
          href={querySerach}
          className={`text-base min-h-6 font-semibold line-clamp-1 mt-2 ${styles.text_hover_default}`}
        >
          <h3>{`${data.flight.data_diem_di.ten_dia_diem} - ${data.flight.data_diem_den.ten_dia_diem}`}</h3>
        </Link>
        <p className="flex space-x-2 mt-2">
          <span>{data.flight.data_diem_di.ngay_khoi_hanh}</span>
        </p>
        <div className="text-right mt-2">
          <span className="text-[#F27145] font-semibold text-base lg:text-xl">
            {formatCurrency(data.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
