"use client";

import { Globe, Mail, Wifi, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EsimPackageView, EsimVariantView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type Props = {
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
};

export default function EsimHeroSection({ selectedPackage, selectedVariant }: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  return (
    <>
      <section className="relative aspect-[16/9] w-full overflow-hidden rounded-12px shadow-lg bg-hb-navy flex items-center justify-center">
        <div className="text-center z-10 px-6">
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            {selectedPackage?.destination || t("eSIM du lịch")}
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow">
            {selectedPackage?.title || t("Đang tải dữ liệu...")}{" "}
            {selectedPackage?.network ? `— ${selectedPackage.network}` : ""}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-hb-navy/90 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
            <Globe size={16} className="text-hb-navy" />
            <span className="text-xs font-bold text-midnight-ink uppercase">
              {selectedPackage?.coverage || t("Phủ sóng rộng")}
            </span>
          </div>
          <div className="bg-hb-navy px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm">
            eSIM
          </div>
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-midnight-ink text-xs font-bold shadow-sm">
            {selectedPackage?.network || "Network"}
          </div>
        </div>
      </section>

      <section>
        <h1 className="text-3xl font-bold text-midnight-ink mb-2">
          eSIM {selectedPackage?.destination || ""} {selectedPackage?.title ? `| ${selectedPackage.title}` : ""}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Mail className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
            <div>
              <p className="text-xs text-steel-secondary">{t("Giao hàng")}</p>
              <p className="text-sm font-semibold text-midnight-ink">{t("Nhận qua email tức thì")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Wifi className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
            <div>
              <p className="text-xs text-steel-secondary">{t("Chia sẻ")}</p>
              <p className="text-sm font-semibold text-midnight-ink">
                {selectedVariant?.hotspotSupported ? t("Hỗ trợ hotspot") : t("Không hỗ trợ hotspot")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Zap className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
            <div>
              <p className="text-xs text-steel-secondary">{t("Kích hoạt")}</p>
              <p className="text-sm font-semibold text-midnight-ink">{t("Kích hoạt dễ dàng")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Globe className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
            <div>
              <p className="text-xs text-steel-secondary">{t("Sẵn sàng")}</p>
              <p className="text-sm font-semibold text-midnight-ink">{t("Internet sẵn sàng ngay khi hạ cánh")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
