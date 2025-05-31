"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import LoadingButton from "@/components/base/LoadingButton";
import { toastMessages, validationMessages } from "@/lib/messages";
import {
  checkOutInsuranceSchema,
  checkOutInsuranceType,
} from "@/schemaValidations/checkOutInsurance.schema";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ProductInsurance } from "@/api/ProductInsurance";
import { InsuranceInfoType, SearchForm } from "@/types/insurance";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse, isValid } from "date-fns";
import { isNumber } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import "@/styles/flightBooking.scss";
import ExcelUploader from "./ExcelUploader";

export default function FormCheckOut({ detail }: any) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const searchParams = useSearchParams();
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const [buyerBuyForSelf, setBuyerBuyForSelf] = useState<boolean>(true);
  const [contactByBuyer, setContactByBuyer] = useState<boolean>(false);
  const [insuranceBuyerInfo, setInsuranceBuyerInfo] =
    useState<InsuranceInfoType>({
      gender: "male",
      name: "",
      birthday: null,
      citizenId: "",
      buyFor: "self",
      address: "",
      phone: "",
      email: "",
    });
  const [insuredInfoList, setInsuredInfoList] = useState<InsuranceInfoType[]>(
    []
  );

  const [searchForm, setSearchForm] = useState<SearchForm>({
    departurePlace: "",
    destinationPlace: "",
    departureDate: null,
    returnDate: null,
    guests: 1,
    type: "",
  });

  useEffect(() => {
    const departDate = parse(
      searchParams.get("departure_date") ?? "",
      "ddMMyyyy",
      new Date()
    );
    const returnDate = parse(
      searchParams.get("return_date") ?? "",
      "ddMMyyyy",
      new Date()
    );
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
  }, [searchParams]);

  const [schemaForm, setSchemaForm] = useState(() =>
    checkOutInsuranceSchema(messages, generateInvoice)
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
    setSchemaForm(checkOutInsuranceSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

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
      toast.error(toaStrMsg.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(
        "birthday_buyer",
        insuranceBuyerInfo.birthday ? insuranceBuyerInfo.birthday : new Date()
      );
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
  };

  useEffect(() => {
    const formatted = insuredInfoList.map((item) => {
      return {
        ...item,
        birthday: item.birthday ? new Date(item.birthday) : undefined,
      };
    });
    reset({ insured_info: formatted });
  }, [insuredInfoList, reset]);
  return (
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
            <p className="text-red-600">{errors.from_address.message}</p>
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
            <p className="text-red-600">{errors.number_insured.message}</p>
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
                <p className="text-red-600">{errors.name_buyer?.message}</p>
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
                          const target = event.target as HTMLInputElement;
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
                      maxDate={new Date(new Date().getFullYear() - 18, 11, 31)}
                      minDate={new Date(new Date().getFullYear() - 100, 11, 31)}
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
                <p className="text-red-600">{errors.birthday_buyer?.message}</p>
              )}
            </div>
            <div className="relative">
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
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />{" "}
              {errors.passport_number_buyer && (
                <p className="text-red-600">
                  {errors.passport_number_buyer?.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
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
                <p className="text-red-600">{errors.address_buyer?.message}</p>
              )}
            </div>
            <div className="lg:col-span-1 relative">
              <input
                type="text"
                placeholder="Số điện thoại"
                {...register(`phone_buyer`)}
                onChange={(e) =>
                  setInsuranceBuyerInfo((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              {errors.phone_buyer && (
                <p className="text-red-600">{errors.phone_buyer?.message}</p>
              )}
            </div>
            <div className="lg:col-span-1 relative">
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
                <p className="text-red-600">{errors.email_buyer?.message}</p>
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
            className={`mt-6 ${
              generateInvoice ? "visible" : "invisible hidden"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="GenerateInvoice_company_name"
                  className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Tên công ty </span>
                  <span className="text-red-500">*</span>
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
                  <p className="text-red-600">{errors.invoice?.mst?.message}</p>
                )}
              </div>
              <div className="relative">
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
              <div className="relative">
                <label
                  htmlFor="GenerateInvoice_city"
                  className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Thành phố </span>
                  <span className="text-red-500">*</span>
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
            </div>
            <div className="grid lg:grid-cols-3 mt-4 gap-4">
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
                  htmlFor="GenerateInvoice_phone"
                  className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Số điện thoại </span>
                  <span className="text-red-500">*</span>
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
          <div className="mt-6">
            <ExcelUploader onSuccess={handleUploadSuccess} />
          </div>
          <div className="mt-6">
            <p className="text-18 lg:text-22 font-bold">
              Thông tin người hưởng bảo hiểm
            </p>

            {insuredInfoList.map((item, index: number) => (
              <div className="mb-3 mt-6" key={index}>
                <p className="mb-4 font-medium">Người hưởng {index + 1}</p>
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
                        {errors.insured_info?.[index]?.gender?.message}
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
                                const target = event.target as HTMLInputElement;
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
                              new Date(new Date().getFullYear() - 15, 11, 31)
                            }
                            minDate={
                              new Date(new Date().getFullYear() - 100, 11, 31)
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
                        {errors.insured_info?.[index]?.birthday?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Số CCCD"
                      defaultValue={item.citizenId}
                      {...register(`insured_info.${index}.passport_number`)}
                      className="h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />{" "}
                    {errors.insured_info?.[index]?.passport_number && (
                      <p className="text-red-600">
                        {errors.insured_info?.[index]?.passport_number?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 grid lg:grid-cols-4 gap-4">
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
                        {errors.insured_info?.[index]?.address?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      defaultValue={item.phone}
                      {...register(`insured_info.${index}.phone`)}
                      className="h-[54.4px] text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />{" "}
                    {errors.insured_info?.[index]?.phone && (
                      <p className="text-red-600">
                        {errors.insured_info?.[index]?.phone?.message}
                      </p>
                    )}
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
            ))}
            <div className="mt-4">
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
                    <label className="text-sm" htmlFor="acceptTermsOfUse">
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
                    <p className="text-red-600">{errors.agreeTerms?.message}</p>
                  )}
                </div>
                <div className="w-full lg:w-[300px]">
                  <LoadingButton
                    text="Đặt đơn bảo hiểm"
                    isLoading={loading}
                    disabled={!isAgreeTerms}
                    style={`${
                      !isAgreeTerms ? "bg-gray-300 !cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
