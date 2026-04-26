"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { parseEsimCmsSections, type EsimCmsPageContent } from "../lib/cms-content";
import type { EsimPackageView, EsimVariantView } from "../lib/esim";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

type DetailAccordionKey = "compatibility" | "refund" | "faq";

type DetailSection = {
  key: DetailAccordionKey;
  title: string;
  content: ReactNode;
};

type Args = {
  cmsPageContent: EsimCmsPageContent | null | undefined;
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
  activeRegionLabel: string;
  serviceTypeLabel: string;
  activeLocale: "vi" | "en";
};

export function useEsimDetailSections({
  cmsPageContent,
  selectedPackage,
  selectedVariant,
  activeRegionLabel,
  serviceTypeLabel,
  activeLocale,
}: Args): DetailSection[] {
  const t = useSimDuLichStaticText(activeLocale);
  const cmsSections = useMemo(() => parseEsimCmsSections(cmsPageContent), [cmsPageContent]);

  return useMemo<DetailSection[]>(
    () => {
      const compatibilityIntro =
        cmsSections.compatibility?.content ||
        t("eSIM này phù hợp với thiết bị hỗ trợ eSIM, đã mở khóa mạng và có thể quét mã QR từ email sau khi thanh toán.");

      const refundIntro =
        cmsSections.refund?.content ||
        t("Chính sách hoàn tiền của eSIM phụ thuộc vào trạng thái mã QR, thời điểm kích hoạt và lỗi từ nhà cung cấp.");

      const faqItems =
        cmsSections.faq?.items?.length && cmsSections.faq.items.length > 0
          ? cmsSections.faq.items
          : [
              {
                question: t("Tôi nhận eSIM bằng cách nào?"),
                answer:
                  t("Sau khi thanh toán, hệ thống sẽ gửi mã QR hoặc hướng dẫn cài đặt qua email đã đăng ký."),
              },
              {
                question: t("Tôi có thể cài eSIM trước khi bay không?"),
                answer:
                  t("Có. Bạn có thể cài trước, nhưng chỉ nên kích hoạt khi đến đúng quốc gia/khu vực sử dụng để tránh mất thời gian sử dụng của gói."),
              },
              {
                question: t("Nếu đổi thiết bị thì sao?"),
                answer:
                  t("Nhiều eSIM chỉ cài được một lần. Hãy giữ thiết bị chính và liên hệ hỗ trợ trước khi reset hoặc chuyển máy."),
              },
              {
                question: t("Nếu không tìm thấy gói phù hợp thì sao?"),
                answer:
                  t("Bạn có thể dùng ô tìm kiếm hoặc lọc theo quốc gia ở phía dưới để đổi sang gói khác trong cùng khu vực."),
              },
            ];

      const compatibilityTitle = cmsSections.compatibility?.title || t("Khả năng tương thích thiết bị");
      const refundTitle = cmsSections.refund?.title || t("Chính sách hoàn tiền");
      const faqTitle = cmsSections.faq?.title || t("Câu hỏi thường gặp (FAQ)");

      return [
        {
          key: "compatibility",
          title: compatibilityTitle,
          content: (
            <div className="space-y-4 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              {cmsSections.compatibility?.content ? (
                <div
                  className="space-y-3 text-xs text-steel-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cmsSections.compatibility.content }}
                />
              ) : null}

              <p className="text-midnight-ink font-medium">{compatibilityIntro}</p>

              <ul className="space-y-2">
                <li>
                  <span className="font-semibold text-midnight-ink">{t("Loại dịch vụ:")}</span>{" "}
                  {serviceTypeLabel}.{" "}
                  {selectedVariant?.phoneNumberIncluded
                    ? t("Gói có số điện thoại, phù hợp cho cuộc gọi và SMS tùy theo nhà mạng.")
                    : t("Gói tập trung vào data, phù hợp cho nhu cầu truy cập internet khi du lịch.")}
                </li>
                <li>
                  <span className="font-semibold text-midnight-ink">{t("Hotspot:")}</span>{" "}
                  {selectedVariant?.hotspotSupported
                    ? t("Có hỗ trợ chia sẻ kết nối.")
                    : t("Không hỗ trợ chia sẻ kết nối.")}
                </li>
                <li>
                  <span className="font-semibold text-midnight-ink">{t("Wi-Fi:")}</span>{" "}
                  {selectedVariant?.wifiSupported
                    ? t("Thiết bị vẫn dùng Wi-Fi bình thường khi chuyển sang eSIM.")
                    : t("Nếu bạn cần phát Wi-Fi, hãy kiểm tra kỹ mô tả gói trước khi mua.")}
                </li>
                <li>
                  <span className="font-semibold text-midnight-ink">{t("Dung lượng:")}</span>{" "}
                  {selectedVariant?.unlimited
                    ? t("Gói không giới hạn theo chính sách nhà mạng, có thể áp dụng fair use.")
                    : `${t("Dung lượng hiển thị theo SKU:")} ${selectedVariant?.data || t("đang cập nhật")}.`}
                </li>
                {selectedVariant?.speedThrottle ? (
                  <li>
                    <span className="font-semibold text-midnight-ink">{t("Tốc độ:")}</span>{" "}
                    {selectedVariant.speedThrottle}
                  </li>
                ) : null}
              </ul>

              <p>
                {selectedPackage?.destination || t("Gói này")} {t("đang được tối ưu cho khu vực")}{" "}
                {selectedPackage?.coverage || activeRegionLabel}.{" "}
                {t("Nếu bạn không chắc thiết bị của mình hỗ trợ eSIM, hãy kiểm tra với nhà sản xuất trước khi kích hoạt.")}
              </p>
            </div>
          ),
        },
        {
          key: "refund",
          title: refundTitle,
          content: (
            <div className="space-y-4 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              {cmsSections.refund?.content ? (
                <div
                  className="space-y-3 text-xs text-steel-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cmsSections.refund.content }}
                />
              ) : null}

              <p className="text-midnight-ink font-medium">{refundIntro}</p>

              <ul className="space-y-2 list-disc pl-5">
                <li>{t("Chưa quét QR hoặc chưa kích hoạt: có thể được hỗ trợ xử lý đổi gói/hoàn tiền theo điều kiện.")}</li>
                <li>
                  {t("Đã nhận mã QR: vui lòng kiểm tra lại thiết bị, mạng, và cấu hình trước khi yêu cầu hỗ trợ.")}
                </li>
                <li>
                  {t("Đã kích hoạt: trường hợp hoàn tiền sẽ được xem xét khi có lỗi kỹ thuật xác nhận từ nhà cung cấp.")}
                </li>
                <li>
                  {t("Nếu gói hiển thị khác với nhu cầu thực tế, nên liên hệ hỗ trợ trước khi cài đặt để tránh phát sinh chi phí không cần thiết.")}
                </li>
              </ul>

              <p>
                {selectedPackage?.activation
                  ? `${t("Gói này thường được kích hoạt theo chu kỳ")} ${selectedPackage.activation.toLowerCase()}.`
                  : t("Thời điểm kích hoạt sẽ được xác nhận theo mô tả của gói.")}
                {" "}
                {selectedPackage?.note || t("Vui lòng đọc kỹ mô tả gói trước khi đặt mua.")}
              </p>
            </div>
          ),
        },
        {
          key: "faq",
          title: faqTitle,
          content: (
            <div className="space-y-3 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              {cmsSections.faq?.content ? (
                <div
                  className="space-y-3 text-xs text-steel-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cmsSections.faq.content }}
                />
              ) : null}

              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold text-midnight-ink">{item.question}</p>
                  <p className="mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
          ),
        },
      ];
    },
    [
      activeRegionLabel,
      cmsSections.compatibility?.content,
      cmsSections.compatibility?.title,
      cmsSections.faq?.content,
      cmsSections.faq?.items,
      cmsSections.faq?.title,
      cmsSections.refund?.content,
      cmsSections.refund?.title,
      selectedPackage?.activation,
      selectedPackage?.coverage,
      selectedPackage?.destination,
      selectedPackage?.note,
      selectedVariant?.data,
      selectedVariant?.hotspotSupported,
      selectedVariant?.phoneNumberIncluded,
      selectedVariant?.speedThrottle,
      selectedVariant?.unlimited,
      selectedVariant?.wifiSupported,
      serviceTypeLabel,
      t,
    ]
  );
}
