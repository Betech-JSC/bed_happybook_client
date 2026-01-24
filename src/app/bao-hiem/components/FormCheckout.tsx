"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import LoadingButton from "@/components/base/LoadingButton";
import { toastMessages, validationMessages } from "@/lib/messages";
import {
  checkOutInsuranceSchema,
  checkOutInsuranceType,
} from "@/schemaValidations/checkOutInsurance.schema";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ProductInsurance } from "@/api/ProductInsurance";
import { InsuranceInfoType, SearchForm } from "@/types/insurance";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse, isValid, previousDay } from "date-fns";
import { isEmpty, isNumber } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import "@/styles/flightBooking.scss";
import ExcelUploader from "./ExcelUploader";
import { formatCurrency } from "@/lib/formatters";
import { useUser } from "@/contexts/UserContext";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import DisplayImage from "@/components/base/DisplayImage";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { HttpError } from "@/lib/error";
import PhoneInput from "@/components/form/PhoneInput";

const defaultInsuranceInfo = {
  gender: "male",
  name: "",
  birthday: null,
  citizenId: "",
  buyFor: "self",
  address: "",
  phone: "",
  email: "",
};
export default function FormCheckOut({
  detail,
  matchedInsurance,
  startDate,
  endDate,
  diffDate,
  totalFee,
  currencyFormatDisplay,
  queryString,
}: any) {
  const { userInfo } = useUser();
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const searchParams = useSearchParams();
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const [buyerBuyForSelf, setBuyerBuyForSelf] = useState<boolean>(true);
  const [contactByBuyer, setContactByBuyer] = useState<boolean>(true);
  const [height, setHeight] = useState<number | string>(0);
  const insuranceDetailRef = useRef<HTMLDivElement>(null);
  const insuranceTypes = ["domestic", "international"];
  const [showInsuranceDetails, setShowInsuranceDetails] = useState<number[]>(
    [],
  );
  const [insuredInfoList, setInsuredInfoList] = useState<InsuranceInfoType[]>(
    [],
  );
  const [insuranceBuyerInfo, setInsuranceBuyerInfo] =
    useState<InsuranceInfoType>(defaultInsuranceInfo);

  const [searchForm, setSearchForm] = useState<SearchForm>({
    departurePlace: "",
    destinationPlace: "",
    departureDate: null,
    returnDate: null,
    guests: 1,
    type: "",
  });
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
  } = useVoucherManager("insurance");

  useEffect(() => {
    const departDate = parse(
      searchParams.get("departure_date") ?? "",
      "ddMMyyyy",
      new Date(),
    );
    const returnDate = parse(
      searchParams.get("return_date") ?? "",
      "ddMMyyyy",
      new Date(),
    );
    const totalGuests = isNumber(parseInt(searchParams.get("guests") ?? "1"))
      ? parseInt(searchParams.get("guests") ?? "1")
      : 1;
    setSearchForm({
      departurePlace: searchParams.get("departure") ?? "",
      destinationPlace: searchParams.get("destination") ?? "",
      departureDate: isValid(departDate) ? departDate : null,
      returnDate: isValid(returnDate) ? returnDate : null,
      guests: isNumber(parseInt(searchParams.get("guests") ?? "1"))
        ? parseInt(searchParams.get("guests") ?? "1")
        : 1,
      type: searchParams.get("type") ?? "",
    });

    setInsuredInfoList(
      Array.from({ length: totalGuests }, () => ({
        ...defaultInsuranceInfo,
      })),
    );
  }, [searchParams]);

  const [schemaForm, setSchemaForm] = useState(() =>
    checkOutInsuranceSchema(messages, generateInvoice, contactByBuyer),
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,

    formState: { errors },
  } = useForm<checkOutInsuranceType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
      from_address: searchParams.get("departure") ?? "",
      to_address: searchParams.get("destination") ?? "",
      number_insured: isNumber(parseInt(searchParams.get("guests") ?? "1"))
        ? parseInt(searchParams.get("guests") ?? "1")
        : 1,
    },
  });

  useEffect(() => {
    setSchemaForm(
      checkOutInsuranceSchema(messages, generateInvoice, contactByBuyer),
    );
  }, [contactByBuyer, generateInvoice, messages]);

  const onSubmit = async (formData: checkOutInsuranceType) => {
    try {
      setLoading(true);
      const genderMap: Record<string, boolean> = {
        male: true,
        female: false,
      };

      formData.insured_info = formData.insured_info.map((item: any) => ({
        ...item,
        gender: genderMap[item.gender] || false,
      }));
      let finalData = {
        ...formData,
        insurance_package_id: detail.id,
        has_invoice: generateInvoice,
        insurance_type_id: detail.insurance_type_id,
        contactByBuyer: contactByBuyer,
        customer_id: userInfo?.id,
        voucher_program_ids: voucherProgramIds,
        insurance_package_price_id: matchedInsurance?.id,
        depart_date: format(startDate, "yyyy-MM-dd"),
        return_date: format(endDate, "yyyy-MM-dd"),
      };
      const respon = await ProductInsurance.booking(finalData);
      if (respon?.status === 200) {
        reset();
        setInsuredInfoList([]);
        toast.success(toaStrMsg.sendSuccess);
        setTimeout(() => {
          router.push("/");
        }, 1200);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (insuranceBuyerInfo.birthday) {
        setValue("birthday_buyer", insuranceBuyerInfo.birthday);
      }
    }, 50);
    if (buyerBuyForSelf) {
      setInsuredInfoList((prev) => {
        const updated = [...prev];
        updated[0] = { ...insuranceBuyerInfo, buyFor: "self" };
        return updated;
      });
    } else {
      setInsuredInfoList((prev) => {
        const updated = [...prev];
        updated[0] = { ...updated[0], buyFor: "member" };
        return updated;
      });
    }
    return () => clearTimeout(timer);
  }, [insuranceBuyerInfo, buyerBuyForSelf, setValue]);

  const handleUploadSuccess = (data: any[]) => {
    setInsuredInfoList(data);
    setSearchForm((prev) => ({
      ...prev,
      guests: data.length,
    }));
    if (data?.length > 0) {
      if (buyerBuyForSelf) {
        const firstCustomer = data[0];
        firstCustomer.birthday = new Date(firstCustomer.birthday);
        setInsuranceBuyerInfo(firstCustomer);
        reset({
          name_buyer: firstCustomer.name,
          birthday_buyer: new Date(firstCustomer.birthday),
          address_buyer: firstCustomer.address,
          passport_number_buyer: firstCustomer.citizenId,
          phone_buyer: firstCustomer.phone,
          email_buyer: firstCustomer.email,
        });
      }
      const totalPriceEL = document.getElementById("totalInsurcePrice");
      if (totalPriceEL) {
        const totalFee = parseInt(matchedInsurance.price) * data.length;
        totalPriceEL.textContent = `${formatCurrency(totalFee)}`;
      }
    }
  };

  useEffect(() => {
    const formatted = insuredInfoList.map((item) => {
      return {
        ...item,
        birthday: item.birthday ? new Date(item.birthday) : undefined,
      };
    });

    setValue("insured_info", formatted as any);
  }, [insuredInfoList, setValue]);

  const toggleShowInsuranceDetails = useCallback(
    (itemId: any) => {
      if (showInsuranceDetails.includes(itemId)) {
        setShowInsuranceDetails(
          showInsuranceDetails.filter((item) => item !== itemId),
        );
      } else {
        setShowInsuranceDetails((prev) => [...prev, itemId]);
      }
    },
    [showInsuranceDetails],
  );

  useEffect(() => {
    if (!insuranceDetailRef.current) return;
    setHeight(
      insuranceDetailRef ? insuranceDetailRef.current.scrollHeight + 200 : 0,
    );
  }, [showInsuranceDetails]);

  useEffect(() => {
    if (!contactByBuyer) {
      setShowInsuranceDetails(
        Array.from({ length: searchForm.guests }, (_, i) => i + 1),
      );
    } else {
      setShowInsuranceDetails([]);
    }
  }, [contactByBuyer, searchForm]);

  return (
    <Fragment>
      <div className="relative h-max pb-14">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-12 relative">
            <div className="text-center">
              <h1 className="text-2xl lg:text-32 text-white font-bold">
                Bảo hiểm du lịch{" "}
              </h1>
              <p className="mt-3 text-base text-white">
                {`(${format(startDate, "dd/MM/yyyy")} - ${format(
                  endDate,
                  "dd/MM/yyyy",
                )}) `}
                {diffDate > 0 && `${diffDate} Ngày`}
              </p>
            </div>
            <div className="mt-8 flex space-y-3 gap-4 flex-wrap lg:flex-none lg:grid grid-cols-8 items-center justify-between bg-white px-3 py-6 lg:px-8 rounded-2xl relative">
              <div className="w-full lg:col-span-3">
                <div className="flex flex-col md:flex-row item-start gap-2 md:gap-8 text-center">
                  <div className="w-full md:w-[120px] flex-shrink-0">
                    {!isEmpty(detail?.insurance_type?.image_location) ? (
                      <DisplayImage
                        imagePath={detail?.insurance_type?.image_location}
                        width={205}
                        height={48}
                        alt={"Brand"}
                        classStyle="w-full h-auto rounded-lg object-cover"
                      />
                    ) : (
                      <Image
                        src="/default-image.png"
                        width={205}
                        height={48}
                        alt={"Brand"}
                        className="w=full h-auto object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="text-left flex flex-col">
                    <p className="text-sm font-normal leading-snug text-gray-500">
                      Gói bảo hiểm
                    </p>
                    <p className="text-18 font-bold !leading-normal">
                      {detail.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:col-span-3 lg:w-3/4 mx-auto">
                <VoucherProgram
                  totalPrice={totalFee}
                  onApplyVoucher={handleApplyVoucher}
                  vouchersData={vouchersData}
                  voucherErrors={voucherErrors}
                  currency={detail?.currency ?? "VND"}
                  onSearch={handleSearch}
                  isSearching={searchingVouchers}
                />
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1  text-center h-full">
                <div className="text-left flex flex-col h-full">
                  <p className="text-sm font-normal leading-snug text-gray-500">
                    Tổng tiền
                  </p>
                  <p
                    id="totalInsurcePrice"
                    className="text-18 font-bold !leading-normal"
                  >
                    {formatCurrency(
                      totalDiscount > totalFee ? 0 : totalFee - totalDiscount,
                      currencyFormatDisplay,
                    )}
                  </p>
                </div>
              </div>
              <div className="w-1/2 lg:w-full lg:col-span-1 text-center h-full">
                <Link
                  href={`/bao-hiem?${queryString}`}
                  className="lg:max-w-32 block text-center w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                >
                  Đổi gói
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="w-full bg-gray-100 relative z-2 rounded-2xl pb-4 lg:pb-12">
        <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen relative top-[-30px]">
          <div className="px-3 py-5 lg:px-8 bg-white rounded-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
                    <span data-translate="true">Nơi đi</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập nơi đi"
                    readOnly
                    {...register("from_address")}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.from_address && (
                    <p className="text-red-600">
                      {errors.from_address.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
                    <span data-translate="true">Nơi đến</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập nơi đến"
                    {...register("to_address")}
                    readOnly
                    defaultValue={searchForm?.destinationPlace}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.to_address && (
                    <p className="text-red-600">{errors.to_address.message}</p>
                  )}
                </div>
                <div className="relative">
                  <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
                    <span data-translate="true">Số lượng</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập số lượng"
                    {...register("number_insured")}
                    value={searchForm.guests}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.number_insured && (
                    <p className="text-red-600">
                      {errors.number_insured.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-18 lg:text-22 font-bold">
                  Thông tin người mua bảo hiểm
                </p>
                <div className="mt-6">
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        {...register(`name_buyer`)}
                        onChange={(e) =>
                          setInsuranceBuyerInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                      />
                      {errors.name_buyer && (
                        <p className="text-red-600">
                          {errors.name_buyer?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <div className="w-full booking-form-birthday flex justify-between items-center py-3 pl-1 pr-4 border border-gray-300 rounded-md">
                        <Controller
                          name="birthday_buyer"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              id="birthday_buyer"
                              selected={insuranceBuyerInfo.birthday || null}
                              onChange={(date: Date | null) =>
                                setInsuranceBuyerInfo((prev) => ({
                                  ...prev,
                                  birthday: date,
                                }))
                              }
                              onChangeRaw={(event) => {
                                if (event) {
                                  const target =
                                    event.target as HTMLInputElement;
                                  if (target.value) {
                                    target.value = target.value
                                      .trim()
                                      .replace(/\//g, "-");
                                  }
                                }
                              }}
                              placeholderText="Ngày sinh"
                              dateFormat="dd-MM-yyyy"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              locale={language === "vi" ? vi : enUS}
                              maxDate={
                                new Date(new Date().getFullYear() - 18, 11, 31)
                              }
                              minDate={
                                new Date(new Date().getFullYear() - 90, 11, 31)
                              }
                              className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                            />
                          )}
                        />{" "}
                        <Image
                          src="/icon/calendar.svg"
                          alt="Icon"
                          className="h-5"
                          width={18}
                          height={20}
                        />
                      </div>
                      {errors.birthday_buyer && (
                        <p className="text-red-600">
                          {errors.birthday_buyer?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Image
                        src="/icon/info-circle.svg"
                        alt="Icon"
                        className="h-5 absolute top-1/2 -translate-y-1/2 right-4 lg:right-5 z-10"
                        width={18}
                        height={20}
                      />
                      <input
                        type="text"
                        placeholder="Số CCCD"
                        {...register(`passport_number_buyer`)}
                        onChange={(e) =>
                          setInsuranceBuyerInfo((prev) => ({
                            ...prev,
                            citizenId: e.target.value,
                          }))
                        }
                        className="relative text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                      />{" "}
                      {errors.passport_number_buyer && (
                        <p className="text-red-600">
                          {errors.passport_number_buyer?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid lg:grid-cols-4 gap-4">
                    <div className="z-10">
                      <Controller
                        name="phone_buyer"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setInsuranceBuyerInfo((prev) => ({
                                ...prev,
                                phone: value,
                              }));
                            }}
                            placeholder="Số điện thoại"
                            error={errors.phone_buyer?.message}
                            defaultCountry="VN"
                            showLabel={false}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Email"
                        {...register(`email_buyer`)}
                        onChange={(e) =>
                          setInsuranceBuyerInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                      />
                      {errors.email_buyer && (
                        <p className="text-red-600">
                          {errors.email_buyer?.message}
                        </p>
                      )}
                    </div>
                    {/**  Bổ sung Sổ hộ chiếu và ngày hết hạn */}
                    <div>
                      <input
                        type="text"
                        placeholder="Sổ hộ chiếu"
                        {...register(`passport_buyer`)}
                        className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                      />
                      {errors.passport_buyer && (
                        <p className="text-red-600">
                          {errors.passport_buyer?.message}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <div className="h-[46px] w-full booking-form-birthday flex justify-between items-center py-3 pl-1 pr-4 border border-gray-300 rounded-md">
                        <Controller
                          name="passport_expiry_date_buyer"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              id="passport_expiry_date_buyer"
                              selected={
                                field.value instanceof Date
                                  ? field.value
                                  : field.value
                                    ? new Date(field.value)
                                    : null
                              }
                              onChange={(date: Date | null) =>
                                field.onChange(date)
                              }
                              onChangeRaw={(event) => {
                                if (event) {
                                  const target =
                                    event.target as HTMLInputElement;
                                  if (target.value) {
                                    target.value = target.value
                                      .trim()
                                      .replace(/\//g, "-");
                                  }
                                }
                              }}
                              placeholderText="Ngày hết hạn"
                              dateFormat="dd-MM-yyyy"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              locale={language === "vi" ? vi : enUS}
                              minDate={new Date()}
                              className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                            />
                          )}
                        />{" "}
                        <Image
                          src="/icon/calendar.svg"
                          alt="Icon"
                          className="h-5"
                          width={18}
                          height={20}
                        />
                      </div>

                      {errors.passport_expiry_date_buyer && (
                        <p className="text-red-600">
                          {errors.passport_expiry_date_buyer?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Địa chỉ"
                        {...register(`address_buyer`)}
                        onChange={(e) =>
                          setInsuranceBuyerInfo((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                      />{" "}
                      {errors.address_buyer && (
                        <p className="text-red-600">
                          {errors.address_buyer?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <input
                        id="informationBySelf"
                        type="checkbox"
                        className="w-4 h-4"
                        name="insurance_buyer_buyfor"
                        checked={buyerBuyForSelf}
                        onChange={(e) => setBuyerBuyForSelf(e.target.checked)}
                      />
                      <label htmlFor="informationBySelf" className="text-sm">
                        Bản thân
                      </label>
                    </div>
                    <div className="flex space-x-2 cursor-pointer items-center">
                      <input
                        id="informationByBuyer"
                        type="checkbox"
                        className="w-4 h-4"
                        name="insurance_buyer_contact"
                        checked={contactByBuyer}
                        onChange={() => setContactByBuyer(!contactByBuyer)}
                      />
                      <label htmlFor="informationByBuyer" className="text-sm">
                        Thông tin liên hệ theo người mua
                      </label>
                    </div>
                    <div className="flex space-x-2 cursor-pointer items-center">
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
                        data-translate="true"
                      >
                        Tôi muốn xuất hóa đơn
                      </span>
                    </div>
                  </div>
                  {/* generateInvoice */}
                  <div
                    className={`mt-6 ${generateInvoice ? "visible" : "invisible hidden"
                      }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_recipient_name"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Người nhận hóa đơn </span>
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
                          htmlFor="GenerateInvoice_tax_code"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Mã số thuế </span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_tax_code"
                          type="text"
                          placeholder="Nhập mã số thuế công ty"
                          {...register(`invoice.mst`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.mst && (
                          <p className="text-red-600">
                            {errors.invoice?.mst?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative md:col-span-2">
                        <label
                          htmlFor="GenerateInvoice_company_address"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Địa chỉ </span>
                          <span className="text-red-500">*</span>
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
                    </div>
                  </div>
                  <div className="mt-6">
                    <ExcelUploader onSuccess={handleUploadSuccess} />
                  </div>
                  <div className="mt-6">
                    <p className="text-18 lg:text-22 font-bold">
                      Thông tin người hưởng bảo hiểm
                    </p>

                    {insuredInfoList.map((item, index: number) => {
                      const itemId = index + 1;
                      return (
                        <div className="mb-3 mt-6" key={index}>
                          <p className="mb-4 font-medium">
                            Người hưởng {itemId}
                          </p>
                          <div className="grid lg:grid-cols-4 gap-4">
                            <div className="relative">
                              <label
                                htmlFor="service"
                                className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                              >
                                <span data-translate="true">Giới tính</span>{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                <select
                                  className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5"
                                  {...register(`insured_info.${index}.gender`)}
                                  defaultValue={item.gender}
                                >
                                  <option value="male" data-translate="true">
                                    Nam
                                  </option>
                                  <option value="female" data-translate="true">
                                    Nữ
                                  </option>
                                </select>
                              </div>
                              {errors.insured_info?.[index]?.gender && (
                                <p className="text-red-600">
                                  {
                                    errors.insured_info?.[index]?.gender
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                defaultValue={item.name}
                                {...register(`insured_info.${index}.name`)}
                                className="h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                              />{" "}
                              {errors.insured_info?.[index]?.name && (
                                <p className="text-red-600">
                                  {errors.insured_info?.[index]?.name?.message}
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <div className="h-[54.4px] w-full booking-form-birthday flex justify-between items-center py-3 pl-1 pr-4 border border-gray-300 rounded-md">
                                <Controller
                                  name={`insured_info.${index}.birthday`}
                                  control={control}
                                  render={({ field }) => (
                                    <DatePicker
                                      id={`insured_info.${index}.birthday`}
                                      selected={
                                        field.value instanceof Date
                                          ? field.value
                                          : field.value
                                            ? new Date(field.value)
                                            : null
                                      }
                                      onChange={(date: Date | null) =>
                                        field.onChange(date)
                                      }
                                      onChangeRaw={(event) => {
                                        if (event) {
                                          const target =
                                            event.target as HTMLInputElement;
                                          if (target.value) {
                                            target.value = target.value
                                              .trim()
                                              .replace(/\//g, "-");
                                          }
                                        }
                                      }}
                                      placeholderText="Ngày sinh"
                                      dateFormat="dd-MM-yyyy"
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      locale={language === "vi" ? vi : enUS}
                                      maxDate={
                                        new Date(
                                          new Date().getFullYear() - 15,
                                          11,
                                          31,
                                        )
                                      }
                                      minDate={
                                        new Date(
                                          new Date().getFullYear() - 85,
                                          11,
                                          31,
                                        )
                                      }
                                      className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                                    />
                                  )}
                                />{" "}
                                <Image
                                  src="/icon/calendar.svg"
                                  alt="Icon"
                                  className="h-5"
                                  width={18}
                                  height={20}
                                />
                              </div>

                              {errors.insured_info?.[index]?.birthday && (
                                <p className="text-red-600">
                                  {
                                    errors.insured_info?.[index]?.birthday
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <Image
                                src="/icon/info-circle.svg"
                                alt="Icon"
                                className="h-5 absolute top-1/2 -translate-y-1/2 right-4 lg:right-5 z-10"
                                width={18}
                                height={20}
                              />
                              <input
                                type="text"
                                placeholder="Số CCCD"
                                defaultValue={item.citizenId}
                                {...register(
                                  `insured_info.${index}.passport_number`,
                                )}
                                className="relative h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                              />{" "}
                              {errors.insured_info?.[index]
                                ?.passport_number && (
                                  <p className="text-red-600">
                                    {
                                      errors.insured_info?.[index]
                                        ?.passport_number?.message
                                    }
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="my-4 text-right flex w-full justify-end">
                            <div
                              className="flex gap-1 text-sm items-end justify-end cursor-pointer"
                              onClick={() => {
                                toggleShowInsuranceDetails(itemId);
                              }}
                            >
                              <button
                                type="button"
                                className="text-blue-700 outline-none"
                              >
                                Chi tiết
                              </button>
                              <svg
                                width="22"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${showInsuranceDetails.includes(itemId)
                                  ? "rotate-180"
                                  : ""
                                  }`}
                              >
                                <path
                                  d="M5 7.5L10 12.5L15 7.5"
                                  stroke="#175CD3"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                          <div
                            ref={insuranceDetailRef}
                            className={`grid lg:grid-cols-4 gap-4 transition-[opacity,max-height,transform] ease-out duration-300 overflow-hidden ${showInsuranceDetails.includes(itemId)
                              ? `opacity-1 border-blue-500 translate-y-0`
                              : "opacity-0 border-none -translate-y-6 invisible"
                              }`}
                            style={{
                              maxHeight: showInsuranceDetails.includes(itemId)
                                ? height
                                : "0px",
                            }}
                          >
                            <div className="relative">
                              <label
                                htmlFor="service"
                                className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                              >
                                <span data-translate="true">Mua cho</span>
                              </label>
                              <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                <select
                                  className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5"
                                  {...register(`insured_info.${index}.buyFor`)}
                                  defaultValue={item.buyFor}
                                >
                                  <option value="self" data-translate="true">
                                    Bản thân
                                  </option>
                                  <option value="member" data-translate="true">
                                    Thành viên đoàn
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Địa chỉ"
                                defaultValue={item.address}
                                {...register(`insured_info.${index}.address`)}
                                className="h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                              />
                              {errors.insured_info?.[index]?.address && (
                                <p className="text-red-600">
                                  {
                                    errors.insured_info?.[index]?.address
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <div className="relative">
                              <Controller
                                name={`insured_info.${index}.phone`}
                                control={control}
                                defaultValue={item.phone}
                                render={({ field }) => (
                                  <PhoneInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Số điện thoại"
                                    error={
                                      errors.insured_info?.[index]?.phone
                                        ?.message
                                    }
                                    defaultCountry="VN"
                                  />
                                )}
                              />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Nhập Email"
                                defaultValue={item.email}
                                {...register(`insured_info.${index}.email`)}
                                className="h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                              />{" "}
                              {errors.insured_info?.[index]?.email && (
                                <p className="text-red-600">
                                  {errors.insured_info?.[index]?.email?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 lg:mt-6">
                      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 justify-between">
                        <div>
                          <div className="flex items-start lg:items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 mt-1 lg:mt-0 flex-shrink-0"
                              {...register("agreeTerms")}
                              onChange={() => setIsAgreeTerms(!isAgreeTerms)}
                              id="acceptTermsOfUse"
                            />
                            <label
                              className="text-sm"
                              htmlFor="acceptTermsOfUse"
                            >
                              Tôi xác nhận thông tin trên và chấp nhận các của{" "}
                              <Link
                                className="text-blue-700 font-bold"
                                href="/thong-tin-chung/dieu-khoan-su-dung"
                                target="_blank"
                              >
                                Điều khoản sử dụng
                              </Link>{" "}
                              website
                            </label>
                          </div>
                          {errors.agreeTerms && (
                            <p className="text-red-600">
                              {errors.agreeTerms?.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[300px]">
                          <LoadingButton
                            text="Đặt đơn bảo hiểm"
                            isLoading={loading}
                            disabled={!isAgreeTerms}
                            style={`${!isAgreeTerms
                              ? "bg-gray-300 !cursor-not-allowed"
                              : ""
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Fragment>
  );
}
