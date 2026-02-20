"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { BookingProductApi } from "@/api/BookingProduct";
import { ProductFastTrackApi } from "@/api/ProductFastTrack";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { handleSessionStorage, renderTextContent } from "@/utils/Helper";
import DatePicker, { registerLocale } from "react-datepicker";
import { datePickerLocale } from "@/constants/language";
import { isEmpty } from "lodash";
import { format, parse } from "date-fns";
import DisplayPrice from "@/components/base/DisplayPrice";
import { useUser } from "@/contexts/UserContext";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { HttpError } from "@/lib/error";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";
import PhoneInput from "@/components/form/PhoneInput";
import {
  CheckOutYachtSchema,
  CheckOutYachtType,
} from "@/schemaValidations/checkOutYacht";
import Tooltip from "@/components/base/Tooltip";
import { Info } from "lucide-react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  price: number;
  name: string;
  minQty: number;
  quantity: number;
}

export default function CheckOutForm({
  product,
  ticketOptionId,
}: {
  product: any;
  ticketOptionId: number;
}) {
  const { t } = useTranslation();
  const { userInfo } = useUser();
  const router = useRouter();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errTicketOption, setErrTicketOption] = useState<string>("");
  const [customerType, setCustomerType] = useState<"personal" | "group">(
    "personal",
  );
  const [guestList, setGuestList] = useState<any[]>([]);
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [flightTime, setFlightTime] = useState<string>("");
  const [flightArrivalTime, setFlightArrivalTime] = useState<string>("");
  const [flightDate, setFlightDate] = useState<string>("");

  // Format time để đảm bảo format 24 giờ (HH:mm) - không có giây
  const formatTime24h = (time: string): string => {
    if (!time) return "";
    // Input type="time" trả về format HH:mm hoặc HH:mm:ss
    // Chúng ta chỉ cần HH:mm (không có giây)
    const parts = time.split(":");
    if (parts.length >= 2) {
      const hours = parts[0].padStart(2, "0");
      const minutes = parts[1].padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return time;
  };

  // Handle time change để đảm bảo format 24 giờ (HH:mm)
  const handleFlightTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Input type="time" với step="60" sẽ trả về format HH:mm (24 giờ)
    // Đảm bảo format đúng
    const formatted = formatTime24h(value);
    setFlightTime(formatted);
  };

  const handleFlightArrivalTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // Input type="time" với step="60" sẽ trả về format HH:mm (24 giờ)
    // Đảm bảo format đúng
    const formatted = formatTime24h(value);
    setFlightArrivalTime(formatted);
  };
  const [selectedAdditionalFees, setSelectedAdditionalFees] = useState<
    number[]
  >([]);
  const [additionalFees, setAdditionalFees] = useState<any[]>([]);
  const [loadingAdditionalFees, setLoadingAdditionalFees] =
    useState<boolean>(false);
  const [documents, setDocuments] = useState<{
    passport?: File[];
    visa?: File[];
  }>({});
  // Handle Voucher
  const {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    searchingVouchers,
    setVoucherErrors,
    handleApplyVoucher,
    handleSearch,
  } = useVoucherManager("fast-track");
  const yachtOptionSelected = useMemo(() => {
    return product?.fast_track?.options.find(
      (item: any) => item.id === ticketOptionId,
    );
  }, [product, ticketOptionId]);

  // Xác định loại dịch vụ (đón hay tiễn) dựa trên tên option
  const serviceType = useMemo(() => {
    const optionName = (yachtOptionSelected?.name || "").toLowerCase();
    return {
      isDonService: optionName.includes("đón"),
      isTienService: optionName.includes("tiễn"),
    };
  }, [yachtOptionSelected]);

  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutYachtSchema(messages, generateInvoice),
  );
  const dayMap: Record<string, string> = {
    monday: "Thứ Hai",
    tuesday: "Ba",
    wednesday: "Tư",
    thursday: "Năm",
    friday: "Sáu",
    saturday: "Bảy",
    sunday: "Chủ nhật",
  };
  const daysOpeningRaw = product?.fast_track?.opening_days;
  const daysOpening = Array.isArray(daysOpeningRaw)
    ? daysOpeningRaw
    : typeof daysOpeningRaw === "string"
      ? JSON.parse(daysOpeningRaw)
      : [];
  const isFullWeek = daysOpening.length === 7;
  const displayDaysOpening = isFullWeek
    ? "Mỗi ngày"
    : daysOpening
      .map((day: any) => dayMap[day])
      .filter(Boolean)
      .join(", ");
  const parsedTimeOpening = parse(
    product?.fast_track?.opening_time,
    "HH:mm:ss",
    new Date(),
  );
  const displayTimeOpening = format(parsedTimeOpening, "HH:mm");

  useEffect(() => {
    if (product?.ticket_prices) {
      const initialTickets: Ticket[] = [...product.ticket_prices]
        .sort((a, b) => {
          return (b?.day_price || 0) - (a?.day_price || 0);
        })
        .map((item: any, index: number) => ({
          id: item.id,
          title: item?.type?.name || "",
          description: item?.type?.description || "",
          price: item?.day_price || 0,
          name: `number_${item.id}`,
          minQty: 0,
          quantity: index ? 0 : 1,
        }));

      setTickets(initialTickets);
    }
  }, [product?.ticket_prices]);

  // Fetch additional fees from API
  useEffect(() => {
    const fetchAdditionalFees = async () => {
      try {
        setLoadingAdditionalFees(true);
        const response = await ProductFastTrackApi.getAdditionalFees();
        if (response?.status === 200 && response?.payload?.data) {
          const fees = Array.isArray(response.payload.data)
            ? response.payload.data
            : [];

          // Filter only active fees and sort
          const sortedFees = fees
            .filter((fee: any) => fee.status === 1 || fee.status === true)
            .sort((a: any, b: any) => {
              if (a.sort_order !== b.sort_order) {
                return (a.sort_order || 0) - (b.sort_order || 0);
              }
              return (b.id || 0) - (a.id || 0);
            });

          setAdditionalFees(sortedFees);
        }
      } catch (error) {
        console.error("Error fetching additional fees:", error);
        // Fallback to product.additional_fees if API fails
        if (product?.additional_fees) {
          const fees = Array.isArray(product.additional_fees)
            ? product.additional_fees
            : [];
          const sortedFees = fees
            .filter((fee: any) => fee.status === 1 || fee.status === true)
            .sort((a: any, b: any) => {
              if (a.sort_order !== b.sort_order) {
                return (a.sort_order || 0) - (b.sort_order || 0);
              }
              return (b.id || 0) - (a.id || 0);
            });
          setAdditionalFees(sortedFees);
        }
      } finally {
        setLoadingAdditionalFees(false);
      }
    };

    fetchAdditionalFees();
  }, [product?.additional_fees]);

  useEffect(() => {
    setSchemaForm(CheckOutYachtSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckOutYachtType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      full_name: userInfo?.name,
      phone: userInfo?.phone?.toString(),
      email: userInfo?.email,
      gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      checkBoxGenerateInvoice: false,
      depart_date: searchParams.get("departDate")
        ? new Date(searchParams.get("departDate") ?? "")
        : new Date(),
    },
  });

  const onSubmit = async (data: CheckOutYachtType) => {
    const isSelectedTicketOption = tickets.find(
      (item: any) => item.quantity > 0,
    );
    if (isEmpty(isSelectedTicketOption)) {
      setErrTicketOption("Vui lòng chọn ít nhất 1 loại vé");
      toast.error(toaStrMsg.formNotValid);
      return;
    } else {
      setErrTicketOption("");
    }

    // Validate giờ bay/giờ đáp dựa trên dịch vụ
    if (serviceType.isDonService && !flightArrivalTime) {
      toast.error(t("vui_long_nhap_gio_dap_cho_dich_vu_don_san_bay"));
      return;
    }

    if (serviceType.isTienService && !flightTime) {
      toast.error(t("vui_long_nhap_gio_bay_cho_dich_vu_tien_san_bay"));
      return;
    }

    try {
      setLoading(true);
      const ticketsBooking = tickets.map((item: any, index: number) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      // Chỉ gửi guest_list khi là "group" và có dữ liệu
      const shouldSendGuestList =
        customerType === "group" &&
        guestList.length > 0 &&
        guestList.some((guest) => guest.name || guest.phone || guest.email);

      const formatData = {
        is_invoice: generateInvoice,
        product_id: product?.id,
        booking: {
          departure_date: format(data.depart_date, "yyyy-MM-dd"),
          ticket_option_id: ticketOptionId,
          tickets: ticketsBooking,
          customer_type: customerType, // Luôn gửi customer_type (mặc định là "personal")
          ...(shouldSendGuestList && { guest_list: guestList }),
          ...(flightNumber && { flight_number: flightNumber }),
          ...(flightTime && { flight_time: flightTime }),
          ...(flightArrivalTime && { flight_arrival_time: flightArrivalTime }),
          ...(flightDate && { flight_date: flightDate }),
          ...(selectedAdditionalFees.length > 0 && {
            additional_fees: selectedAdditionalFees.map((id) => ({ id })),
          }),
        },
        contact: {
          email: data.email,
          full_name: data.full_name,
          gender: data.gender,
          phone: data.phone,
          note: data.note ? data.note : "",
        },
        invoice: data.invoice,
        customer_id: userInfo?.id,
        voucher_program_ids: voucherProgramIds,
      };
      if (!generateInvoice) {
        delete formatData.invoice;
      }
      const respon = await BookingProductApi.FastTrack(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);

        // Merge thêm thông tin từ form và product vào response để hiển thị đầy đủ
        const responseData = respon?.payload?.data || {};
        const enrichedData = {
          ...responseData,
          // Đảm bảo có thông tin liên hệ
          full_name: responseData.full_name || data.full_name,
          phone: responseData.phone || data.phone,
          email: responseData.email || data.email,
          gender: responseData.gender || data.gender,
          note: responseData.note || data.note || "",
          // Merge thông tin booking
          booking: {
            ...responseData.booking,
            customer_type: customerType,
            ...(shouldSendGuestList && { guest_list: guestList }),
            ...(flightNumber && { flight_number: flightNumber }),
            ...(flightTime && { flight_time: flightTime }),
            ...(flightArrivalTime && {
              flight_arrival_time: flightArrivalTime,
            }),
            ...(flightDate && { flight_date: flightDate }),
            // Thêm thông tin vé với name từ tickets
            tickets: tickets
              .filter((t: Ticket) => t.quantity > 0)
              .map((t: Ticket) => ({
                id: t.id,
                quantity: t.quantity,
                name: t.title,
                price: t.price,
              })),
            // Thêm thông tin phụ phí với name từ additionalFees
            ...(selectedAdditionalFees.length > 0 && {
              additional_fees: additionalFees
                .filter((fee: any) => selectedAdditionalFees.includes(fee.id))
                .map((fee: any) => ({
                  id: fee.id,
                  name: fee.name,
                  description: fee.description,
                  price: fee.price,
                })),
            }),
          },
          // Đảm bảo có thông tin product
          product: responseData.product || {
            id: product?.id,
            name: product?.name,
            image_url: product?.image_url,
            image_location:
              product?.image_location || product?.gallery?.[0]?.image_location,
            currency: product?.currency,
          },
        };

        // Lưu data đầy đủ vào sessionStorage để hiển thị ở page thanh toán
        handleSessionStorage("save", "bookingFastTrack", enrichedData);

        setTimeout(() => {
          router.push("/fast-track/thong-tin-dat-cho");
        }, 1500);
      } else {
        toast.error(toaStrMsg.sendFailed);
      }
    } catch (error: any) {
      if (
        error instanceof HttpError &&
        error.payload?.errors?.voucher_programs
      ) {
        setVoucherErrors(error.payload.errors.voucher_programs);
        toast.error(toaStrMsg.inValidVouchers);
      } else {
        toast.error(toaStrMsg.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCount = (id: number, delta: number) => {
    setErrTicketOption("");
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const newQty = Math.max(ticket.minQty, ticket.quantity + delta);
          return { ...ticket, quantity: newQty };
        }
        return ticket;
      }),
    );
  };

  // Tính tổng số lượng vé đã chọn
  const totalTicketQuantity = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  // Tính tổng giá vé
  const ticketsPrice = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity * ticket.price,
    0,
  );

  // Tính tổng phụ phí đã chọn
  // Lưu ý: "Phụ phí giờ bay thêm" cần tính theo quantity (150,000 VND × quantity)
  const additionalFeesPrice = useMemo(() => {
    const totalQuantity = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0,
    );

    return additionalFees
      .filter((fee: any) => selectedAdditionalFees.includes(fee.id))
      .reduce((sum: number, fee: any) => {
        const feeName = (fee.name || "").toLowerCase();
        const isNightTimeFee =
          feeName.includes("phụ phí giờ bay thêm") ||
          feeName.includes("phu phi gio bay them");

        // Nếu là "Phụ phí giờ bay thêm", tính theo quantity
        if (isNightTimeFee) {
          return sum + 150000 * totalQuantity;
        }

        // Các phụ phí khác: tính theo giá đơn vị
        return sum + Number(fee.price || 0);
      }, 0);
  }, [additionalFees, selectedAdditionalFees, tickets]);

  // Kiểm tra xem thời gian có đáp ứng điều kiện phụ phí giờ bay thêm không
  const shouldApplyNightTimeSurcharge = useMemo(() => {
    // Kiểm tra điều kiện cơ bản
    if (!tickets || tickets.length === 0 || !yachtOptionSelected) {
      return false;
    }

    // Tính tổng quantity của tất cả tickets
    const totalQuantity = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0,
    );
    if (totalQuantity === 0) {
      return false;
    }

    // Lấy name của option để xác định đón hay tiễn
    const optionName = (yachtOptionSelected.name || "").toLowerCase();
    let timeToCheck: string | null = null;

    // Xác định giờ cần kiểm tra dựa vào option name
    if (optionName.includes("đón")) {
      timeToCheck = flightArrivalTime; // Đón: kiểm tra giờ hạ cánh
    } else if (optionName.includes("tiễn")) {
      timeToCheck = flightTime; // Tiễn: kiểm tra giờ khởi hành
    } else {
      // Nếu không có "đón" hoặc "tiễn" trong option name thì không tính
      return false;
    }

    // Nếu chưa nhập giờ thì không tính
    if (!timeToCheck || timeToCheck.trim() === "") {
      return false;
    }

    // Parse time (format: "HH:mm" hoặc "HH:mm:ss")
    const timeParts = timeToCheck.split(":");
    if (timeParts.length === 0 || !timeParts[0]) {
      return false;
    }

    const hour = parseInt(timeParts[0], 10);
    if (isNaN(hour)) {
      return false;
    }

    // Kiểm tra nếu giờ trong khung 23:00 - 05:59
    return hour >= 23 || hour < 6;
  }, [tickets, flightTime, flightArrivalTime, yachtOptionSelected]);

  // Tự động tích/bỏ tích "Phụ phí giờ bay thêm" dựa trên thời gian
  useEffect(() => {
    // Tìm "Phụ phí giờ bay thêm" trong additionalFees
    const nightTimeFee = additionalFees.find((fee: any) => {
      const feeName = (fee.name || "").toLowerCase();
      return (
        feeName.includes("phụ phí giờ bay thêm") ||
        feeName.includes("phu phi gio bay them")
      );
    });

    if (!nightTimeFee) {
      return; // Không có phụ phí này trong danh sách
    }

    const isCurrentlySelected = selectedAdditionalFees.includes(
      nightTimeFee.id,
    );

    // Nếu thời gian đáp ứng điều kiện và chưa được tích → Tự động tích
    if (shouldApplyNightTimeSurcharge && !isCurrentlySelected) {
      setSelectedAdditionalFees((prev) => [...prev, nightTimeFee.id]);
    }
    // Nếu thời gian không đáp ứng điều kiện và đã được tích → Tự động bỏ tích
    else if (!shouldApplyNightTimeSurcharge && isCurrentlySelected) {
      setSelectedAdditionalFees((prev) =>
        prev.filter((id) => id !== nightTimeFee.id),
      );
    }
  }, [shouldApplyNightTimeSurcharge, additionalFees, selectedAdditionalFees]);

  // Tổng chi phí = giá vé + phụ phí (phụ phí giờ bay thêm đã được tự động tích vào additional fees nếu đáp ứng điều kiện)
  const totalPrice = ticketsPrice + additionalFeesPrice;
  // const totalPrice = 2000; => test case

  // Đồng bộ guestList với số lượng vé đã chọn
  useEffect(() => {
    if (customerType === "group" && totalTicketQuantity > 0) {
      setGuestList((prevGuestList) => {
        const currentGuestCount = prevGuestList.length;
        if (totalTicketQuantity > currentGuestCount) {
          // Thêm khách nếu số lượng vé tăng
          const newGuests = Array(totalTicketQuantity - currentGuestCount)
            .fill(null)
            .map(() => ({ name: "", phone: "", email: "" }));
          return [...prevGuestList, ...newGuests];
        } else if (totalTicketQuantity < currentGuestCount) {
          // Xóa khách nếu số lượng vé giảm
          return prevGuestList.slice(0, totalTicketQuantity);
        }
        return prevGuestList;
      });
    } else if (customerType === "personal") {
      // Cá nhân: không cần guestList
      setGuestList([]);
    }
  }, [totalTicketQuantity, customerType]);

  const handleCustomerTypeChange = (type: "personal" | "group") => {
    setCustomerType(type);
    if (type === "personal") {
      // Cá nhân: không cần nhập thông tin khách riêng, dùng thông tin từ form liên hệ
      setGuestList([]);
    } else {
      // Đoàn: tạo guestList khớp với số lượng vé đã chọn
      const guestCount = Math.max(totalTicketQuantity, 1);
      setGuestList(
        Array(guestCount)
          .fill(null)
          .map(() => ({ name: "", phone: "", email: "" })),
      );
    }
  };

  const handleGuestListChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...guestList];
    updated[index] = { ...updated[index], [field]: value };
    setGuestList(updated);
  };

  const toggleAdditionalFee = (feeId: number) => {
    setSelectedAdditionalFees((prev) =>
      prev.includes(feeId)
        ? prev.filter((id) => id !== feeId)
        : [...prev, feeId],
    );
  };

  return (
    <div className="flex flex-col-reverse items-start lg:flex-row lg:space-x-8 lg:mt-4 pb-8">
      <div className="w-full lg:w-8/12 mt-4 lg:mt-0 rounded-2xl">
        <div
          className="rounded-t-xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <h3 className="text-22 py-4 px-8 font-semibold text-white">
            {t("thong_tin_don_hang")}
          </h3>
        </div>

        <form className="rounded-xl mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-4 rounded-xl">
            <p
              className="text-blue-700 text-base font-medium"
              data-translate="true"
            >
              {yachtOptionSelected?.name}
            </p>
            <div className="mt-1">
              {tickets.map(
                (ticket, index: number) =>
                  ticket.price > 0 && (
                    <div
                      key={index}
                      className="flex space-x-2 justify-between items-start py-4 border-b last:border-none"
                    >
                      <div>
                        <div
                          className="font-semibold text-base"
                          data-translate="true"
                        >
                          {renderTextContent(ticket.title)}
                        </div>
                        <div
                          className="text-sm text-gray-500 mt-1"
                          data-translate="true"
                        >
                          {!isEmpty(ticket.description)
                            ? renderTextContent(ticket.description)
                            : ""}
                        </div>
                      </div>
                      <div className="flex items-start md:w-[30%] justify-between">
                        <div>
                          <DisplayPrice
                            className={`!text-base mr-4 text-black !font-normal`}
                            price={ticket.price}
                            currency={product?.currency}
                          />

                          <p className="text-sm text-gray-500 mt-1">
                            {t("gia")} / {t("khach")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className={`w-6 h-6 font-medium text-xl rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center
                          ${ticket.quantity <= ticket.minQty
                                ? "cursor-not-allowed opacity-50"
                                : ""
                              } `}
                            onClick={() => updateCount(ticket.id, -1)}
                            disabled={ticket.quantity <= ticket.minQty}
                          >
                            <span className="mb-1">-</span>
                          </button>
                          <span className="w-8 outline-none text-center text-18 text-blue-700 font-bold">
                            {ticket.quantity}
                          </span>

                          <button
                            type="button"
                            className={`w-6 h-6 text-xl font-medium rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center 
                           ${ticket.quantity >= 20
                                ? "cursor-not-allowed opacity-50"
                                : ""
                              }`}
                            onClick={() => updateCount(ticket.id, 1)}
                            disabled={ticket.quantity >= 20}
                          >
                            <span className="mb-1">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
              )}
              {errTicketOption && (
                <p className="text-red-600 mt-2">{errTicketOption}</p>
              )}
            </div>
          </div>

          {/* Additional Fees Section - Hiển thị danh sách phụ phí từ bảng product_fast_track_additional_fees */}
          {additionalFees.length > 0 && (
            <div className="mt-6 bg-white p-4 rounded-xl">
              <p className="text-18 font-bold mb-4" data-translate="true">
                Phụ phí thêm
              </p>
              <div className="space-y-3">
                {additionalFees
                  .filter((fee: any) => {
                    // Kiểm tra xem có phải "Phụ phí giờ bay thêm" không
                    const feeName = (fee.name || "").toLowerCase();
                    const isNightTimeFee =
                      feeName.includes("phụ phí giờ bay thêm") ||
                      feeName.includes("phu phi gio bay them");

                    // Nếu là phụ phí giờ bay thêm, chỉ hiển thị khi thời gian đáp ứng điều kiện
                    if (isNightTimeFee) {
                      return shouldApplyNightTimeSurcharge;
                    }

                    // Các phụ phí khác luôn hiển thị
                    return true;
                  })
                  .map((fee: any) => (
                    <div
                      key={fee.id}
                      className={`flex items-start justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedAdditionalFees.includes(fee.id)
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      onClick={() => toggleAdditionalFee(fee.id)}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedAdditionalFees.includes(fee.id)}
                          onChange={() => toggleAdditionalFee(fee.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 cursor-pointer w-4 h-4"
                        />
                        <div className="flex-1 flex items-center gap-3">
                          <div
                            className="font-medium text-base text-gray-900"
                            data-translate="true"
                          >
                            {renderTextContent(fee.name)}
                          </div>
                          {fee.description && (
                            <Tooltip
                              contentClassName="max-w-[280px] md:max-w-[400px] w-max"
                              content={
                                <div>
                                  <div
                                    className="text-sm text-gray-300"
                                    data-translate="true"
                                    dangerouslySetInnerHTML={{
                                      __html: fee.description,
                                    }}
                                  />

                                </div>
                              }
                              position="top"
                              delay={300}
                            >
                              <button className="flex items-center justify-center">
                                <Info />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <DisplayPrice
                        className="!text-base !font-semibold text-blue-600 ml-4 flex-shrink-0"
                        price={fee.price}
                        currency={product?.currency}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Customer Type and Guest Information - Optional */}
          <div className="mt-6 bg-white p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-18 font-bold" data-translate="true">
                Phân loại khách
              </p>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Tùy chọn
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4" data-translate="true">
              Chọn loại khách để nhập thông tin bổ sung (nếu cần)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleCustomerTypeChange("personal")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${customerType === "personal"
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                <div className="font-semibold" data-translate="true">
                  Đón/Tiễn cá nhân
                </div>
                <div
                  className="text-xs text-gray-500 mt-1"
                  data-translate="true"
                >
                  Sử dụng thông tin từ form liên hệ
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleCustomerTypeChange("group")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${customerType === "group"
                    ? "border-blue-600 bg-blue-50 shadow-sm"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
              >
                <div className="font-semibold" data-translate="true">
                  Đón/Tiễn đoàn
                </div>
                <div
                  className="text-xs text-gray-500 mt-1"
                  data-translate="true"
                >
                  Nhập thông tin cho nhiều khách
                </div>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setCustomerType("personal");
                setGuestList([]);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
              data-translate="true"
            >
              Đặt lại về mặc định
            </button>

            {/* Chỉ hiển thị form nhập thông tin khách khi chọn "group" */}
            {customerType === "group" && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold" data-translate="true">
                    Danh sách thông tin khách ({totalTicketQuantity} khách)
                  </p>
                  {totalTicketQuantity > 0 && (
                    <span className="text-xs text-gray-500">
                      Số lượng khách tự động khớp với số vé đã chọn
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {guestList.map((guest, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-sm">
                          Khách {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                            <span data-translate="true">Họ và tên</span>
                          </label>
                          <input
                            type="text"
                            value={guest.name}
                            onChange={(e) =>
                              handleGuestListChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập họ và tên"
                            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5 bg-white"
                          />
                        </div>
                        <div className="relative">
                          <PhoneInput
                            value={guest.phone || ""}
                            onChange={(value) =>
                              handleGuestListChange(index, "phone", value)
                            }
                            placeholder="Nhập số điện thoại"
                            defaultCountry="VN"
                            label="Số điện thoại"
                          />
                        </div>
                        <div className="relative">
                          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                            <span data-translate="true">Email</span>
                          </label>
                          <input
                            type="email"
                            value={guest.email}
                            onChange={(e) =>
                              handleGuestListChange(
                                index,
                                "email",
                                e.target.value,
                              )
                            }
                            placeholder="Nhập email"
                            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flight Information - Optional */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <p className="text-18 font-bold" data-translate="true">
                  Thông tin chuyến bay
                </p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Tùy chọn
                </span>
              </div>

              {/* Thông báo về phụ phí giờ bay thêm */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium text-blue-900 mb-1"
                      data-translate="true"
                    >
                      {t("luu_y_phu_phi_gio_bay_them")}
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                      <li data-translate="true">
                        {t("doi_voi_dich_vu_don_san_bay")}
                      </li>
                      <li data-translate="true">
                        {t("doi_voi_dich_vu_tien_san_bay")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                    <span data-translate="true">Số hiệu chuyến bay</span>
                  </label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="VD: VN123"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                  />
                </div>
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                    <span data-translate="true">Giờ bay</span>
                    {serviceType.isTienService && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="time"
                    value={flightTime}
                    onChange={handleFlightTimeChange}
                    step="60"
                    className={`text-sm w-full border rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5 ${serviceType.isTienService && !flightTime
                        ? "border-red-300"
                        : "border-gray-300"
                      }`}
                  />
                </div>
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                    <span data-translate="true">Giờ đáp</span>
                    {serviceType.isDonService && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="time"
                    value={flightArrivalTime}
                    onChange={handleFlightArrivalTimeChange}
                    step="60"
                    className={`text-sm w-full border rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5 ${serviceType.isDonService && !flightArrivalTime
                        ? "border-red-300"
                        : "border-gray-300"
                      }`}
                  />
                </div>
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-600">
                    <span data-translate="true">Ngày bay</span>
                  </label>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-18 font-bold">{t("thong_tin_lien_he")}</p>
            <div className="mt-4 bg-white py-4 px-6 rounded-xl">
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    <span data-translate="true">Họ và tên</span>
                    <span className="text-red-500">*</span>
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
                    <span data-translate="true">Giới tính</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <select
                      id="gender"
                      className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                      {...register("gender")}
                    >
                      <option value="" data-translate="true">
                        Vui lòng chọn giới tính
                      </option>
                      <option value="male" data-translate="true">
                        Nam
                      </option>
                      <option value="female" data-translate="true">
                        Nữ
                      </option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Nhập số điện thoại"
                          error={errors.phone?.message}
                          defaultCountry="VN"
                          label="Số điện thoại"
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-tranlsate={true}>Email</span>
                      <span className="text-red-500">*</span>
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
              <GenerateInvoiceForm
                register={register}
                errors={errors}
                generateInvoice={generateInvoice}
                setGenerateInvoice={setGenerateInvoice}
              />
            </div>
            <LoadingButton
              style="mt-6"
              isLoading={loading}
              text="Thanh toán"
              disabled={loading}
            />
          </div>
        </form>
      </div>
      <div className="w-full lg:w-4/12 bg-white rounded-2xl">
        <div className="py-4 px-3 lg:px-6">
          <div className="pb-4 border-b border-gray-200">
            <h1
              className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
              data-translate="true"
            >
              {product?.name}
            </h1>
            <div className="flex space-x-2 mt-2 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/clock.svg"
                alt="Thời gian"
                width={18}
                height={18}
              />
              <span data-translate="true">
                Mở {displayTimeOpening} | {displayDaysOpening}
              </span>
            </div>
            <div className="flex space-x-2 mt-3 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/marker-pin-01.svg"
                alt="Địa điểm"
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.fast_track?.address)}
              </span>
            </div>
            {tickets?.map((item: any) => (
              <div key={item.id} className="mt-2 flex justify-between">
                <span data-translate="true">{item.title}</span>
                <div className="font-bold text-sm flex gap-1">
                  <DisplayPrice
                    className={`!font-bold !text-sm text-black`}
                    price={item.price}
                    currency={product?.currency}
                  />
                  <span>{` x ${item.quantity}`}</span>
                </div>
              </div>
            ))}
            {selectedAdditionalFees.length > 0 && (
              <>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold mb-2" data-translate="true">
                    Phụ phí
                  </p>
                  {additionalFees
                    .filter((fee: any) =>
                      selectedAdditionalFees.includes(fee.id),
                    )
                    .map((fee: any) => (
                      <div key={fee.id} className="mt-2 flex justify-between">
                        <span data-translate="true">{fee.name}</span>
                        <DisplayPrice
                          className="!font-bold !text-sm text-black"
                          price={fee.price}
                          currency={product?.currency}
                        />
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
          <div className="pt-4 border-t">
            <VoucherProgram
              totalPrice={totalPrice}
              onApplyVoucher={handleApplyVoucher}
              vouchersData={vouchersData}
              voucherErrors={voucherErrors}
              currency={product?.currency?.code ?? "VND"}
              onSearch={handleSearch}
              isSearching={searchingVouchers}
            />
          </div>
          <div className="mt-4">
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={totalPrice}
                totalDiscount={totalDiscount}
                currency={product?.currency}
              />
            ) : (
              totalPrice > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={"Tổng cộng"}
                    price={totalPrice}
                    currency={product?.currency}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
