"use client";
import {
  CheckOutTourBody,
  CheckOutTourType,
} from "@/schemaValidations/checkOutTour.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { BookingProductApi } from "@/api/BookingProduct";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
interface Ticket {
  id: number;
  title: string;
  description: string;
  price: number;
}

const tickets: Ticket[] = [
  { id: 1, title: "Người lớn", description: "Cao từ 140cm", price: 500000 },
  {
    id: 2,
    title: "Trẻ em",
    description: "Cao từ 100cm - 139cm",
    price: 300000,
  },
];

export default function CheckOutForm({
  productId,
}: {
  productId: number | string;
}) {
  const router = useRouter();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutTourBody(generateInvoice)
  );

  useEffect(() => {
    setSchemaForm(CheckOutTourBody(generateInvoice));
  }, [generateInvoice]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckOutTourType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = async (data: CheckOutTourType) => {
    try {
      setLoading(true);
      const formatData = {
        is_invoice: generateInvoice,
        product_id: productId,
        booking: {
          departure_date: format(data.depart_date, "dd/MM/yyyy"),
          number_adult: data.atd,
          number_child: data.chd,
          number_baby: data.inf,
        },
        contact: {
          email: data.email,
          full_name: data.full_name,
          gender: data.gender,
          phone: data.phone,
          note: data.note ? data.note : "",
        },
        invoice: data.invoice,
      };
      const respon = await BookingProductApi.Tour(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success("Gửi yêu cầu thành công!");
        setTimeout(() => {
          router.push("/tours");
        }, 1500);
      } else {
        toast.error("Gửi yêu cầu thất bại!");
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const [counts, setCounts] = useState<{ [key: number]: number }>({
    1: 1,
    2: 1,
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    let ticketPrice = 0;
    tickets.map((item: any) => {
      ticketPrice += item.price;
    });
    setTotalPrice(ticketPrice);
  }, []);

  const updateCount = (id: number, delta: number, ticketPrice: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
    if (delta === 1) {
      setTotalPrice(totalPrice + ticketPrice);
    } else if (delta === -1) {
      setTotalPrice(totalPrice - ticketPrice);
    }
  };
  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
      <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 rounded-2xl">
        <div
          className="rounded-t-xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <h3 className="text-22 py-4 px-8 font-semibold text-white">
            Thông tin đơn hàng
          </h3>
        </div>

        <form className="rounded-xl mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-4 rounded-xl">
            <p className="text-blue-700 text-base font-medium">
              Vé vào cửa tiêu chuẩn Vinwonders Hà Nội Wave Park - Ocean Pack 2
            </p>
            <div>
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex justify-between items-center py-4 border-b last:border-none"
                >
                  <div>
                    <div className="font-semibold text-base">
                      {ticket.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ticket.description}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div>
                      <span className="text-base mr-4">
                        {formatCurrency(ticket.price)}
                      </span>
                      <p className="text-sm text-gray-500">Giá / Khách</p>
                    </div>
                    <div className="flex items-center ">
                      <button
                        type="button"
                        className={`w-6 h-6 font-medium text-xl rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center
                          ${
                            counts[ticket.id] <= 1
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          } `}
                        onClick={() => updateCount(ticket.id, -1, ticket.price)}
                        disabled={counts[ticket.id] <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-18 text-blue-700 font-bold">
                        {counts[ticket.id]}
                      </span>
                      <button
                        type="button"
                        className={`w-6 h-6 text-xl font-medium rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center 
                           ${
                             counts[ticket.id] >= 20
                               ? "cursor-not-allowed opacity-50"
                               : ""
                           }`}
                        onClick={() => updateCount(ticket.id, 1, ticket.price)}
                        disabled={counts[ticket.id] >= 20}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-18 font-bold">Thông tin liên hệ</p>
            <div className="mt-4 bg-white py-4 px-6 rounded-xl">
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("full_name")}
                    placeholder="Nhập họ và tên"
                    title="Nhập họ và tên"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.full_name && (
                    <p className="text-red-600">{errors.full_name.message}</p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  >
                    <option value="">Vui lòng chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone")}
                      title="Nhập số điện thoại"
                      placeholder="Nhập số điện thoại"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.phone && (
                      <p className="text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      title="Nhập email"
                      {...register("email")}
                      placeholder="Nhập email"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />{" "}
                    {errors.email && (
                      <p className="text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Yêu cầu đặc biệt"
                  {...register("note")}
                  className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                ></textarea>
              </div>

              <div className="mt-2 flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("checkBoxGenerateInvoice")}
                  checked={generateInvoice}
                  onChange={(e) => {
                    setGenerateInvoice(e.target.checked);
                  }}
                  className="w-4 h-4"
                />
                <span
                  className="text-sm"
                  onClick={() => {
                    setGenerateInvoice(!generateInvoice);
                  }}
                >
                  Tôi muốn xuất hóa đơn
                </span>
              </div>
              {/* generateInvoice */}
              {generateInvoice && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_company_name"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Tên công ty <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_company_name"
                        type="text"
                        {...register(`invoice.company_name`)}
                        placeholder="Nhập tên công ty"
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.company_name && (
                        <p className="text-red-600">
                          {errors.invoice?.company_name?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_company_address"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_company_address"
                        type="text"
                        placeholder="Nhập địa chỉ công ty"
                        {...register(`invoice.address`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.address && (
                        <p className="text-red-600">
                          {errors.invoice?.address?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_city"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Thành phố <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_city"
                        type="text"
                        placeholder="Nhập thành phố"
                        {...register(`invoice.city`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.city && (
                        <p className="text-red-600">
                          {errors.invoice?.city?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_tax_code"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Mã số thuế <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_tax_code"
                        type="text"
                        placeholder="Nhập mã số thuế"
                        {...register(`invoice.mst`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.mst && (
                        <p className="text-red-600">
                          {errors.invoice?.mst?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_recipient_name"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Người nhận hóa đơn
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_recipient_name"
                        type="text"
                        placeholder="Nhập họ và tên người nhận"
                        {...register(`invoice.contact_name`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.contact_name && (
                        <p className="text-red-600">
                          {errors.invoice?.contact_name?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_phone"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_phone"
                        type="text"
                        placeholder="Nhập số điện thoại người nhận"
                        {...register(`invoice.phone`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.phone && (
                        <p className="text-red-600">
                          {errors.invoice?.phone?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="GenerateInvoice_email"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="GenerateInvoice_email"
                        type="text"
                        placeholder="Nhập Email"
                        {...register(`invoice.email`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.invoice?.email && (
                        <p className="text-red-600">
                          {errors.invoice?.email?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <LoadingButton
              style="mt-6"
              isLoading={loading}
              text="Gửi yêu cầu"
              disabled={loading}
            />
          </div>
        </form>
      </div>
      <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
        <div className="py-4 px-3 lg:px-6">
          <div className="pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
              Vé VinWonders Phú Quốc
            </h1>
            <div className="flex space-x-2 mt-2 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/clock.svg"
                alt="Icon"
                width={18}
                height={18}
              />
              <span>Mở | Thứ, 10:00-19:30</span>
            </div>
            <div className="flex space-x-2 mt-3 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/marker-pin-01.svg"
                alt="Icon"
                width={18}
                height={18}
              />
              <span>Khu Bãi Dài, Phú Quốc, Kiên Giang 92512, Vietnam</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Vé người lớn</span>
              <span className="font-bold text-sm">
                {`${formatCurrency(tickets[0].price)} x ${counts[1]}`}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Vé trẻ em</span>
              <span className="font-bold text-sm">
                {`${formatCurrency(tickets[1].price)} x ${counts[2]}`}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <span>Tổng cộng</span>
            <span className="font-bold text-base text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
