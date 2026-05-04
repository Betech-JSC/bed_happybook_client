import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, Wifi, Zap } from "lucide-react";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import ContentByPage from "@/components/content-page/ContentByPage";
import HomeSimFeatured from "@/components/home/SimFeatured";
import SimDuLichBreadcrumbs from "./SimDuLichBreadcrumbs";
import SimDuLichFooter from "./SimDuLichFooter";
import SimDuLichHeroFilters from "./SimDuLichHeroFilters";
import type { EsimCmsPageContent } from "../lib/cms-content";
import { toSnakeCase } from "@/utils/Helper";

type Props = {
  language: string;
  cmsPageContent?: EsimCmsPageContent | null;
};

export default async function SimDuLichLandingPage({
  language,
  cmsPageContent,
}: Props) {
  const translations = await getServerTranslations(language);
  const t = (text: string, fallback?: string) =>
    translations[toSnakeCase(text)] || fallback || text;

  return (
    <>
      <section className="relative pb-12 h-[620px] lg:h-[660px] place-content-center">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image.webp"
            width={1600}
            height={584}
            className="object-cover w-full h-full"
            alt="HappyBook eSIM"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        />

        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[112px] lg:pt-[150px] max__screen">
          <div className="mt-0 lg:mt-20 lg:mb-12 p-6 lg:p-10 bg-white rounded-2xl shadow-lg relative lg:w-[760px] max-w-full">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hb-coral">
                  eSIM
                </p>
                <h1 className="mt-2 text-[28px] lg:text-[42px] font-extrabold text-midnight-ink leading-tight">
                  {t("sim_du_lich", "Sim du lịch")}
                </h1>
                <p className="mt-3 text-sm lg:text-base text-steel-secondary max-w-2xl">
                  {t(
                    "internet_toan_cau_voi_muc_gia_re_hon_data_roaming_khong_can_thao_lap_sim",
                    "Internet toàn cầu với mức giá rẻ hơn data roaming & không cần tháo lắp sim"
                  )}
                </p>
              </div>
              <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Globe className="h-7 w-7 text-hb-navy" />
              </div>
            </div>

            <SimDuLichHeroFilters />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sim-viet-nam"
                className="inline-flex items-center justify-center rounded-xl bg-hb-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t("sim_du_lich_viet_nam", "Sim du lịch Việt Nam")}
              </Link>
              <Link
                href="/sim-quoc-te"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-midnight-ink transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                {t("sim_du_lich_quoc_te", "Sim du lịch quốc tế")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full bg-white relative z-2 rounded-2xl">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <SimDuLichBreadcrumbs
            className="pt-3"
            items={[
              { href: "/", label: t("Trang chủ", "Homepage") },
              { label: t("Sim du lịch", "Sim du lịch") },
            ]}
          />
          <div className="py-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 h-20 bg-white rounded-2xl border border-slate-100 px-4 shadow-sm">
              <Mail className="h-11 w-11 text-hb-navy bg-blue-50 p-2 rounded-xl box-content" />
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("Giao hàng")}
                </p>
                <p>{t("Nhận qua email tức thì")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20 bg-white rounded-2xl border border-slate-100 px-4 shadow-sm">
              <Wifi className="h-11 w-11 text-hb-navy bg-blue-50 p-2 rounded-xl box-content" />
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("Chia sẻ")}
                </p>
                <p>{t("Hỗ trợ hotspot")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20 bg-white rounded-2xl border border-slate-100 px-4 shadow-sm">
              <Zap className="h-11 w-11 text-hb-navy bg-blue-50 p-2 rounded-xl box-content" />
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("Kích hoạt")}
                </p>
                <p>{t("Kích hoạt dễ dàng")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20 bg-white rounded-2xl border border-slate-100 px-4 shadow-sm">
              <Globe className="h-11 w-11 text-hb-navy bg-blue-50 p-2 rounded-xl box-content" />
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("Sẵn sàng")}
                </p>
                <p>{t("Internet sẵn sàng ngay khi hạ cánh")}</p>
              </div>
            </div>
          </div>

          <section className="mt-16 lg:mt-24">
            <HomeSimFeatured />
          </section>

          {cmsPageContent?.content ? (
            <div className="mt-8 rounded-2xl bg-gray-50 p-8">
              <ContentByPage data={cmsPageContent} />
            </div>
          ) : null}

          <div className="my-8">
            <SimDuLichFooter />
          </div>
        </div>
      </main>
    </>
  );
}
