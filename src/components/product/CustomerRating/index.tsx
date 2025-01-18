"use client";
import Image from "next/image";
import { Fragment, useState } from "react";
import RatingCriteria from "./RatingCriteria";
import LoadingButton from "@/components/base/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  CustomerRatingBody,
  CustomerRatingType,
} from "@/schemaValidations/customerRating.schema";

export default function CustomerRating() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const criteria = [
    { id: 2, name: "Hướng dẫn viên" },
    { id: 3, name: "Lộ trình" },
    { id: 4, name: "Phương tiện đưa đón" },
    { id: 5, name: "Giá cả" },
  ];
  const labelsRating = [
    "Tệ",
    "Không hài lòng",
    "Bình thường",
    "Hài lòng",
    "Xuất sắc",
  ];
  const [ratings, setRatings] = useState(Array(criteria.length).fill(5));
  const [hover, setHover] = useState(Array(criteria.length).fill(0));

  const handleRating = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const handleHover = (index: number, value: number) => {
    const newHover = [...hover];
    newHover[index] = value;
    setHover(newHover);
  };

  const calculateAverageRating = () => {
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    return Math.round(totalRating / criteria.length);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerRatingType>({
    resolver: zodResolver(CustomerRatingBody),
  });

  const onSubmit = async (data: CustomerRatingType) => {
    try {
      setLoading(true);
      // const response = await contactApi.send(data);
      // if (response?.status === 200) {
      //   reset();
      //   toast.dismiss();
      //   toast.success("Gửi thành công!");
      // }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng tải lại trang!");
    } finally {
      setLoading(false);
    }
  };
  const dataRating = [
    {
      id: 1,
      full_name: "Natasia",
      created_at: "19/04/2024",
      content:
        "Danny, hướng dẫn viên du lịch của chúng tôi, rất vui tính. Anh ấy chụp ảnh cho chúng tôi ở mọi địa điểm đẹp trong chuyến đi. Chuyến đi của chúng tôi rất vui khi có anh ấy. Chiếc xe tải của chúng tôi hơi nóng. Nhưng chúng tôi vẫn thích chuyến đi của mình với Dann",
      rating: 4,
    },
    {
      id: 2,
      full_name: "Natasia 2",
      created_at: "25/04/2024",
      content:
        "Danny, hướng dẫn viên du lịch của chúng tôi, rất vui tính. Anh ấy chụp ảnh cho chúng tôi ở mọi địa điểm đẹp trong chuyến đi. Chuyến đi của chúng tôi rất vui khi có anh ấy. Chiếc xe tải của chúng tôi hơi nóng. Nhưng chúng tôi vẫn thích chuyến đi của mình với Dann",
      rating: 5,
    },
  ];
  return (
    <Fragment>
      <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
        Đánh giá
      </h2>
      <div className="mt-4 flex flex-col md:flex-row md:space-x-6 bg-gray-50 p-6 rounded-xl items-center">
        <div className="w-full md:w-[30%] text-center px-9 flex flex-col mb-5 md:mb-0">
          <p className="text-primary font-semibold mt-1">Xuất sắc</p>
          <div className="w-[106px] mt-1 h-9 mx-auto rounded-2xl rounded-tr bg-primary text-white font-semibold flex items-center justify-center">
            <p className="text-[26px] leading-[39px]">9.8</p>
            <p className="text-xl opacity-50">/10</p>
          </div>
          <p className="text-gray-500 mt-1">234 đánh giá</p>
          <div
            onClick={() => setOpenModal(true)}
            className="mt-3 bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
          >
            <button className="mx-auto text-sm font-medium">
              Gửi đánh giá
            </button>
          </div>
        </div>
        <div className="w-full md:w-[70%]">
          <div className="grid grid-grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Hướng dẫn viên</p>
              <div className="flex space-x-2 items-center">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="w-11/12 h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  ></p>
                </div>
                <p>9.8</p>
              </div>
            </div>
            <div>
              <p>Lộ trình</p>
              <div className="flex space-x-2 items-center">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="w-11/12 h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  ></p>
                </div>
                <p>9.8</p>
              </div>
            </div>
            <div>
              <p>Phương tiện đưa đón</p>
              <div className="flex space-x-2 items-center">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="w-11/12 h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  ></p>
                </div>
                <p>9.8</p>
              </div>
            </div>
            <div>
              <p>Giá cả</p>
              <div className="flex space-x-2 items-center">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="w-11/12 h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  ></p>
                </div>
                <p>9.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dataRating.map((item: any) => (
        <div className="mt-5" key={item.id}>
          <div className="flex space-x-4">
            <div className="w-11 h-11 rounded-full bg-gray-50 place-content-center text-center">
              <p className="">OR</p>
            </div>
            <div>
              <div className="flex space-x-4 items-center">
                <p className="text-sm md:text-18 font-semibold">
                  {item?.full_name}
                </p>
                <p className="w-4 h-1 bg-gray-300"></p>
                <div className="text-sm md:text-base flex space-x-1 md:space-x-2 bg-gray-100 rounded-sm p-2 items-center">
                  <p className="text-sm md:text-base text-blue-900 font-semibold">
                    {`${Math.round(item?.rating ?? 0) * 2} `}
                    <span className="font-semibold opacity-50 text-black">
                      /10
                    </span>
                  </p>
                  <p className="text-sm text-blue-900 font-semibold">
                    {item?.rating > 0
                      ? labelsRating[item.rating - 1]
                      : labelsRating[item.rating]}
                  </p>
                </div>
              </div>
              <p className="text-sm">{item?.created_at ?? ""}</p>
            </div>
          </div>
          <div
            className="text-sm md:text-base mt-3"
            dangerouslySetInnerHTML={{
              __html: item?.content,
            }}
          ></div>
        </div>
      ))}
      <div className="max-w-40 mx-auto mt-6">
        <LoadingButton isLoading={loading} text="Xem thêm" />
      </div>
      {/* Popup */}
      <div
        className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-50 flex justify-center items-center ${
          openModal ? "visible z-[9999]" : "invisible z-[-1]"
        }`}
        style={{
          opacity: openModal ? "100" : "0",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white h-max p-6 max-w-[680px] max-h-[500px] md:max-h-[680px] overflow-y-auto rounded-2xl text-base"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-22 font-bold">Đánh giá</p>
            <button className="text-xl" onClick={() => setOpenModal(false)}>
              <Image
                src="/icon/close.svg"
                alt="Icon"
                className="h-10"
                width={20}
                height={20}
              />
            </button>
          </div>
          <p className="text-gray-700 mb-4">
            Chúng tôi rất mong nhận được ý kiến của bạn để nâng cao chất lượng
            dịch vụ.
          </p>

          <RatingCriteria
            index={20}
            criterion={"Đánh giá chung"}
            rating={calculateAverageRating()}
            labelsRating={labelsRating}
          />
          <div className="mt-4 rounded-xl">
            <div className="mt-3 rounded-xl">
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  title="Nhập họ và tên"
                  {...register("full_name")}
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.full_name && (
                  <p className="text-red-600">{errors.full_name.message}</p>
                )}
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
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
                      className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      {...register("email")}
                      title="Nhập email"
                      placeholder="Nhập email"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />
                    {errors.email && (
                      <p className="text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative mt-4">
                <textarea
                  id="email"
                  rows={1}
                  {...register("note")}
                  placeholder="Hãy chia sẻ đánh giá của bạn"
                  className="text-sm w-full border border-gray-300 rounded-md p-3 placeholder-gray-400 outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-4">Về các tiêu chí sau:</p>
            {criteria.map((criterion, index) => (
              <RatingCriteria
                key={criterion.id}
                index={index}
                criterion={criterion.name}
                labelsRating={labelsRating}
                rating={ratings[index]}
                hover={hover[index + 2]}
                onRate={handleRating}
                onHover={handleHover}
              />
            ))}
          </div>
          <div className="flex flex-wrap space-y-2">
            <LoadingButton isLoading={false} text={"Gửi"} />
          </div>
        </form>
      </div>
    </Fragment>
  );
}
