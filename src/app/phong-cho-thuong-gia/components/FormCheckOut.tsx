"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { BookingProductApi } from "@/api/BookingProduct";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
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
  // Tổng số khách (gộp chung người lớn và trẻ em)
  const [adults, setAdults] = useState<number>(
    Math.max(1, (Number(searchParams.get("adults")) || 1) + (Number(searchParams.get("children")) || 0)),
  );
  const childrenCount = 0;

  const handleAdultsChange = (value: React.SetStateAction<number>) => {
    setAdults((prev) => {
      const newVal = typeof value === "function" ? (value as Function)(prev) : value;
      setTickets((prevTickets) =>
        prevTickets.map((t, index) =>
          index === 0 ? { ...t, quantity: newVal } : t
        )
      );
      return newVal;
    });
  };

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
  } = useVoucherManager("business-lounge");
  const yachtOptionSelected = useMemo(() => {
    return product?.business_lounge?.options.find(
      (item: any) => item.id === ticketOptionId,
    );
  }, [product, ticketOptionId]);

  const childPolicy = useMemo(() => {
    const desc = product?.business_lounge?.description || "";
    // Nhãn nhận diện đa ngôn ngữ: VI gốc + biến thể EN (mô tả EN do biên tập
    // hoặc dịch). API trả description theo locale nên ở cờ EN phải khớp nhãn EN.
    // Bắt linh hoạt mọi markup CKEditor: có/không <strong>/<b>, dấu cách trước
    // ':', dấu ':' trong/ngoài thẻ in đậm, nội dung xuống nhiều dòng.
    const labels =
      "Phụ phí trẻ em|Children(?:'s)? surcharge|Child(?:ren)? (?:surcharge|policy|fee)";
    const block = desc.match(
      new RegExp(`(?:${labels})[\\s\\S]*?(?:</li>|</p>|$)`, "i"),
    );
    if (!block) return "";
    const body = block[0]
      .replace(/<\/?(?:li|p|strong|b|span)[^>]*>/gi, "") // bỏ thẻ bọc
      .replace(new RegExp(`^\\s*(?:${labels})\\s*:?\\s*`, "i"), "") // bỏ nhãn + ':'
      .trim();
    return body;
  }, [product]);

  // Xác định loại dịch vụ (đón hay tiễn) dựa trên tên option
  const serviceType = useMemo(() => {
    const optionName = (yachtOptionSelected?.name || "").toLowerCase();
    return {
      isDonService: optionName.includes("đón"),
      isTienService: optionName.includes("tiễn"),
    };
  }, [yachtOptionSelected]);
  const isBusinessLounge = !!product?.business_lounge?.is_business_lounge;

  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutYachtSchema(messages, generateInvoice),
  );
  const dayMap: Record<string, string> = {
    monday: t("thu_hai"),
    tuesday: t("thu_ba"),
    wednesday: t("thu_tu"),
    thursday: t("thu_nam"),
    friday: t("thu_sau"),
    saturday: t("thu_bay"),
    sunday: t("chu_nhat"),
  };
  const daysOpeningRaw = product?.business_lounge?.opening_days;
  const daysOpening = Array.isArray(daysOpeningRaw)
    ? daysOpeningRaw
    : typeof daysOpeningRaw === "string"
      ? JSON.parse(daysOpeningRaw)
      : [];
  const isFullWeek = daysOpening.length === 7;
  const displayDaysOpening = isFullWeek
    ? t("moi_ngay")
    : daysOpening
      .map((day: any) => dayMap[day])
      .filter(Boolean)
      .join(", ");
  let displayTimeOpening = product?.business_lounge?.opening_time;
  try {
    if (displayTimeOpening && displayTimeOpening.includes(":")) {
      const parsedTimeOpening = parse(displayTimeOpening, "HH:mm:ss", new Date());
      if (!isNaN(parsedTimeOpening.getTime())) {
        displayTimeOpening = format(parsedTimeOpening, "HH:mm");
      }
    }
  } catch (error) {
  }

  useEffect(() => {
    if (product?.ticket_prices) {
      // Tính toán số lượng khách ban đầu từ searchParams để tránh dependency warning với adults
      const initialAdults = Math.max(
        1,
        (Number(searchParams.get("adults")) || 1) +
          (Number(searchParams.get("children")) || 0)
      );

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
          quantity: index ? 0 : initialAdults,
        }));

      setTickets(initialTickets);
    }
  }, [product?.ticket_prices, searchParams]);

  // Business Lounge does not have additional fees
  useEffect(() => {
    setAdditionalFees([]);
  }, []);

  useEffect(() => {
    setSchemaForm(CheckOutYachtSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  useEffect(() => {
    if (language) {
      registerLocale(language, datePickerLocale[language as keyof typeof datePickerLocale]);
    }
  }, [language]);

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
      setErrTicketOption(t("vui_long_chon_it_nhat_1_loai_ve"));
      toast.error(toaStrMsg.formNotValid);
      return;
    } else {
      setErrTicketOption("");
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
          adults,
          children: childrenCount,
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
      const respon = await BookingProductApi.BusinessLounge(formatData);
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
        handleSessionStorage("save", "bookingData", enrichedData);

        setTimeout(() => {
          router.push("/phong-cho-thuong-gia/thong-tin-dat-cho");
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
      prev.map((ticket, index) => {
        if (ticket.id === id) {
          const newQty = Math.max(ticket.minQty, ticket.quantity + delta);
          // Đồng bộ ngược lại adults khi thay đổi số lượng vé
          if (index === 0) {
            setAdults(newQty);
          }
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
  }, [shouldApplyNightTimeSurcharge, additionalFees, selectedAdditionalFees, isBusinessLounge]);

  // Tổng chi phí: áp tỷ lệ giảm giá (discount_price/price) lên giá vé cho KHỚP với
  // giá từng vé đang hiển thị, rồi cộng phụ phí. Giá cuối = giá đã giảm.
  const productDiscountRatio =
    product?.discount_price > 0 && product?.price > 0
      ? product.discount_price / product.price
      : 0;
  const totalPrice = Math.max(
    0,
    ticketsPrice * (1 - productDiscountRatio) + additionalFeesPrice
  );
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

            {/* Số khách (gộp chung người lớn và trẻ em) */}
            <div className="mt-2 py-4 border-b">
              <div className="font-semibold text-base mb-3">{t("so_khach")}</div>
              <div className="flex flex-col gap-3 max-w-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{t("so_khach")}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAdultsChange((v: number) => Math.max(1, v - 1))}
                      disabled={adults <= 1}
                      className="w-7 h-7 rounded-sm border border-blue-700 text-blue-700 text-xl font-medium flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="mb-1">-</span>
                    </button>
                    <span className="w-8 text-center text-18 text-blue-700 font-bold">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdultsChange((v: number) => Math.min(20, v + 1))}
                      disabled={adults >= 20}
                      className="w-7 h-7 rounded-sm border border-blue-700 text-blue-700 text-xl font-medium flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="mb-1">+</span>
                    </button>
                  </div>
                </div>
              </div>
              {childPolicy && (
                <div className="mt-4 p-3.5 bg-[#F8F9FA] border border-gray-200 rounded-xl flex items-start space-x-3 text-gray-800 text-sm max-w-md shadow-sm transition-all duration-200">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block mb-1">
                      {language === "vi" ? "Chính sách trẻ em:" : "Child Policy:"}
                    </span>
                    <span className="text-gray-700 leading-relaxed" data-translate="true" dangerouslySetInnerHTML={{ __html: childPolicy }} />
                    <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-100 pt-1.5">
                      {language === "vi" 
                        ? "* Trẻ em không thuộc diện miễn phí cần tính vào tổng số lượng khách bằng cách tăng số lượng khách ở trên."
                        : "* Children not eligible for free entry must be included in the total guest count above."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-1">
              {tickets.map(
                (ticket, index: number) =>
                  ticket.price > 0 && (
                    <div
                      key={index}
                      className="flex space-x-2 justify-between items-center py-4 border-b last:border-none"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div
                          className="font-semibold text-base text-gray-900 truncate"
                          data-translate="true"
                        >
                          {renderTextContent(ticket.title)}
                        </div>
                        {(() => {
                          const desc = (ticket.description || "").trim().toLowerCase();
                          const title = (ticket.title || "").trim().toLowerCase();
                          const isDuplicate = !desc || desc === title || desc === "1 khách" || desc === "1 guest" || desc === "1 khach";
                          if (isDuplicate) return null;
                          return (
                            <div
                              className="text-sm text-gray-500 mt-1"
                              data-translate="true"
                            >
                              {renderTextContent(ticket.description)}
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0 md:w-[35%] justify-between">
                        <div className="text-end">
                          {(() => {
                            const hasDiscount =
                              product?.discount_price > 0 && product?.price > 0;
                            if (hasDiscount) {
                              const discountRatio = product.discount_price / product.price;
                              const sale = ticket.price * (1 - discountRatio);
                              const original = ticket.price;
                              return (
                                <div className="flex items-baseline justify-end gap-2">
                                  {original > sale && (
                                    <DisplayPrice
                                      price={original}
                                      currency={product?.currency}
                                      className="!text-gray-400 !line-through !font-normal !text-[13px]"
                                    />
                                  )}
                                  <DisplayPrice
                                    price={sale}
                                    currency={product?.currency}
                                    className="!text-[#F27145] !font-extrabold !text-base md:text-lg"
                                  />
                                </div>
                              );
                            }
                            return (
                              <DisplayPrice
                                className={`!text-base text-black !font-normal`}
                                price={ticket.price}
                                currency={product?.currency}
                              />
                            );
                          })()}

                          <p className="text-xs text-gray-400 mt-0.5">
                            {t("gia")} / {t("khach")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-sm border border-gray-200">
                          <button
                            type="button"
                            className={`w-6 h-6 font-medium text-lg rounded-sm text-blue-700 bg-white hover:bg-gray-100 flex items-center justify-center transition-colors
                          ${ticket.quantity <= ticket.minQty
                                ? "cursor-not-allowed opacity-50"
                                : ""
                              } `}
                            onClick={() => updateCount(ticket.id, -1)}
                            disabled={ticket.quantity <= ticket.minQty}
                          >
                            <span className="mb-0.5">-</span>
                          </button>
                          <span className="w-8 outline-none text-center text-16 text-blue-700 font-bold">
                            {ticket.quantity}
                          </span>

                          <button
                            type="button"
                            className={`w-6 h-6 text-lg font-medium rounded-sm text-blue-700 bg-white hover:bg-gray-100 flex items-center justify-center transition-colors 
                           ${ticket.quantity >= 20
                                ? "cursor-not-allowed opacity-50"
                                : ""
                              }`}
                            onClick={() => updateCount(ticket.id, 1)}
                            disabled={ticket.quantity >= 20}
                          >
                            <span className="mb-0.5">+</span>
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

          {/* Additional Fees Section - Hiển thị danh sách phụ phí từ bảng product_business_lounge_additional_fees */}
          {!isBusinessLounge && additionalFees.length > 0 && (
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

          {/* Thông tin sử dụng (Sân bay & Ngày sử dụng) */}
          <div className="mt-6 bg-white p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/icon/calendar.svg"
                  alt="Calendar"
                  width={18}
                  height={18}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800" data-translate="true">
                Thông tin sử dụng
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-500">
                  <span data-translate="true">Sân bay</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={product?.business_lounge?.airport_name || ""}
                  className="text-sm w-full border border-gray-200 rounded-xl pt-6 pb-2.5 bg-gray-100/80 indent-3.5 cursor-not-allowed font-medium text-gray-700 focus:outline-none"
                />
              </div>

              <Controller
                name="depart_date"
                control={control}
                render={({ field }) => (
                  <div className="relative group">
                    <label
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-500"
                      htmlFor="depart_date"
                    >
                      <span data-translate="true">
                        Ngày sử dụng
                      </span>
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <DatePicker
                      id="depart_date"
                      dateFormat={"dd/MM/yyyy"}
                      className="text-sm w-full border border-gray-200 rounded-xl pt-6 pb-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 indent-3.5 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                      selected={field.value}
                      onChange={(date: Date | null) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      minDate={new Date()}
                      locale={
                        datePickerLocale[
                        language as keyof typeof datePickerLocale
                        ]
                      }
                    />
                  </div>
                )}
              />
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
                    placeholder={t("nhap_ho_va_ten")}
                    title={t("nhap_ho_va_ten")}
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
                          placeholder={t("nhap_so_dien_thoai")}
                          error={errors.phone?.message}
                          defaultCountry="VN"
                          label={t("so_dien_thoai")}
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
                      title={t("nhap_email")}
                      {...register("email")}
                      placeholder={t("nhap_email")}
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
                  placeholder={t("yeu_cau_dac_biet")}
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
              text={t("thanh_toan")}
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
                alt={t("thoi_gian")}
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
                alt={t("dia_diem")}
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.business_lounge?.address)}
              </span>
            </div>
            {tickets?.map((item: any) => (
              <div key={item.id} className="mt-2 flex justify-between">
                <span data-translate="true">{item.title}</span>
                <div className="font-bold text-sm flex gap-1">
                  {(() => {
                    const hasDiscount =
                      product?.discount_price > 0 && product?.price > 0;
                    if (hasDiscount) {
                      const discountRatio = product.discount_price / product.price;
                      const sale = item.price * (1 - discountRatio);
                      const original = item.price;
                      return (
                        <div className="flex items-baseline gap-1.5">
                          {original > sale && (
                            <DisplayPrice
                              price={original}
                              currency={product?.currency}
                              className="!text-gray-400 !line-through !font-normal !text-[11px]"
                            />
                          )}
                          <DisplayPrice
                            price={sale}
                            currency={product?.currency}
                            className="!text-[#F27145] !font-bold !text-sm"
                          />
                        </div>
                      );
                    }
                    return (
                      <DisplayPrice
                        className={`!font-bold !text-sm text-black`}
                        price={item.price}
                        currency={product?.currency}
                      />
                    );
                  })()}
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
            {/* Removed direct discount row as requested */}
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
            {((product?.discount_price || 0) + totalDiscount) > 0 ? (
              <DisplayPriceWithDiscount
                price={Math.max(0, totalPrice - totalDiscount)}
                originalPrice={ticketsPrice + additionalFeesPrice}
                currency={product?.currency}
              />
            ) : (
              totalPrice > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={t("tong_cong")}
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
