"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ContactSlideOver from "./ContactSlideOver";
import CheckoutContactSection from "./components/CheckoutContactSection";
import CheckoutPaymentSection from "./components/CheckoutPaymentSection";
import CheckoutSummarySidebar from "./components/CheckoutSummarySidebar";
import { useEsimCheckoutFlow } from "../hooks/useEsimCheckoutFlow";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import VoucherProgram from "@/components/product/components/VoucherProgram";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const pageShellClassName =
    "w-full max__screen px-3 lg:px-[50px] xl:px-[80px] py-8 pb-32 pt-32 lg:pt-40 font-['Nunito_Sans']";

  const pkgSlug = searchParams.get("pkg") || "";
  const skuFromQuery = searchParams.get("sku") || "";
  const qty = Math.max(1, Number(searchParams.get("qty") || 1) || 1);

  const checkout = useEsimCheckoutFlow({ pkgSlug, skuFromQuery, qty });

  if (checkout.loading) {
    return (
      <main className={pageShellClassName}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-midnight-ink font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {t("Quay lại")}
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {t("Đang tải thông tin gói eSIM...")}
        </div>
      </main>
    );
  }

  if (checkout.error || !checkout.packageData || !checkout.selectedVariant) {
    return (
      <main className={pageShellClassName}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-midnight-ink font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {t("Quay lại chọn gói")}
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {checkout.error || t("Không tìm thấy dữ liệu gói eSIM.")}
        </div>
      </main>
    );
  }

  return (
    <main className={pageShellClassName}>
      <button
        onClick={() => (checkout.step === 3 ? checkout.setStep(2) : router.back())}
        className="flex items-center gap-2 text-slate-600 hover:text-midnight-ink font-semibold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />{" "}
        {checkout.step === 3 ? t("Quay lại nhập thông tin") : t("Quay lại chọn gói")}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {checkout.step === 2 ? (
            <>
              <CheckoutContactSection
                email={checkout.email}
                emailError={checkout.emailError}
                contactName={checkout.contactName}
                contactPhone={checkout.contactPhone}
                onEmailChange={(value) => {
                  checkout.setEmail(value);
                  if (checkout.emailError) checkout.setEmailError("");
                }}
                onOpenContact={() => checkout.setShowContact(true)}
              />
              <VoucherProgram
                totalPrice={checkout.subtotal}
                voucherErrors={checkout.voucherErrors}
                vouchersData={checkout.vouchersData}
                currency={checkout.currency}
                isSearching={checkout.searchingVouchers}
                onApplyVoucher={checkout.handleApplyVoucher}
                onSearch={checkout.handleSearch}
              />
            </>
          ) : (
            <CheckoutPaymentSection
              isEnglish={checkout.isEnglish}
              paymentMethod={checkout.paymentMethod}
              setPaymentMethod={checkout.setPaymentMethod}
              checkoutData={checkout.checkoutData}
              isPaid={checkout.isPaid}
              setIsPaid={checkout.setIsPaid}
              orderCode={checkout.orderCode}
              summaryOpen={checkout.summaryOpen}
              setSummaryOpen={checkout.setSummaryOpen}
              contactName={checkout.contactName}
              contactPhone={checkout.contactPhone}
              email={checkout.email}
              timeLeft={checkout.timeLeft}
              formatTime={checkout.formatTime}
            />
          )}
        </div>

        <CheckoutSummarySidebar
          activePackageLabel={checkout.packageData.destination || checkout.packageData.regionLabel || "eSIM"}
          selectedVariant={checkout.selectedVariant}
          packageData={checkout.packageData}
          qty={qty}
          subtotal={checkout.subtotal}
          serviceFee={checkout.serviceFee}
          total={checkout.total}
          currency={checkout.currency}
          paymentMethod={checkout.paymentMethod}
          step={checkout.step}
          submitting={checkout.submitting}
          quoteLoading={checkout.quoteLoading}
          quoteIsAvailable={checkout.quoteIsAvailable}
          quoteError={checkout.quoteError}
          checkoutData={checkout.checkoutData}
          isPaid={checkout.isPaid}
          orderCode={checkout.orderCode}
          formatCheckoutAmount={checkout.formatCheckoutAmount}
          onPay={checkout.handlePay}
          onContinue={checkout.handleContinue}
          totalDiscount={checkout.totalDiscount}
        />
      </div>

      {checkout.showContact && (
        <ContactSlideOver
          initialName={checkout.contactName}
          initialPhone={checkout.contactPhone}
          onSave={checkout.handleContactSave}
          onClose={() => checkout.setShowContact(false)}
        />
      )}
    </main>
  );
}
