import { getServerT } from "@/lib/i18n/getServerT";
import Image from "next/image";
import { Fragment } from "react";

export default async function WhyChooseHappyBook() {
  const t = await getServerT();
  return (
    <Fragment>
      <h3 className="text-32 font-bold text-center">
        {t("vi_sao_nen_chon_happy_book")}
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
              <p className="text-18 font-semibold mb-1 text-gray-900">
                {t("doi_ngu_happybook_tu_van")}
              </p>
              <p className="text-18 font-semibold mb-1 text-gray-900">
                {t("ho_tro_nhiet_tinh_247")}
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
              <p className="text-18 font-semibold mb-1 text-gray-900">
                {t("don_vi_hon_8_nam_kinh_nghiem")}
              </p>
              <p className="text-18 font-semibold text-gray-900">
                {t("lay_chu_tin_lam_dau")}
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
              <p className="text-18 font-semibold mb-1 text-gray-900">
                {t("san_pham_da_dang")}
              </p>
              <p className="text-18 font-semibold text-gray-900">
                {t("gia_ca_tot_nhat")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
