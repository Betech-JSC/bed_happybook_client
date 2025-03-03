import Image from "next/image";
import { Fragment } from "react";

export default function WhyChooseHappyBook() {
  return (
    <Fragment>
      <h3 className="text-32 font-bold text-center" data-translate>
        Vì sao nên chọn HappyBook
      </h3>
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="flex items-center space-x-3 h-20">
            <Image
              src="/tour/adviser.svg"
              alt="Icon"
              className="h-11 w-11"
              width={44}
              height={44}
            ></Image>
            <div>
              <p
                className="text-18 font-semibold mb-1 text-gray-900"
                data-translate
              >
                Đội ngũ Happybook tư vấn
              </p>
              <p
                className="text-18 font-semibold mb-1 text-gray-900"
                data-translate
              >
                hỗ trợ nhiệt tình 24/7
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 h-20">
            <Image
              src="/tour/developers.svg"
              alt="Icon"
              className="h-11 w-11"
              width={44}
              height={44}
            ></Image>
            <div>
              <p
                className="text-18 font-semibold mb-1 text-gray-900"
                data-translate
              >
                Đơn vị hơn 8 năm kinh nghiệm.
              </p>
              <p className="text-18 font-semibold text-gray-900" data-translate>
                Lấy chữ tín làm đầu
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 h-20">
            <Image
              src="/tour/product-icon.svg"
              alt="Icon"
              className="h-11 w-11"
              width={44}
              height={44}
            ></Image>
            <div>
              <p
                className="text-18 font-semibold mb-1 text-gray-900"
                data-translate
              >
                Sản phẩm đa dạng,
              </p>
              <p className="text-18 font-semibold text-gray-900" data-translate>
                giá cả tốt nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
