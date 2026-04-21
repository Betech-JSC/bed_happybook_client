"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Mail,
  User,
  Phone,
  Shield,
  ChevronRight,
  ChevronDown,
  Clock,
  CreditCard,
  Wallet,
  Smartphone as SmartphoneIcon,
  ShoppingCart,
  CheckCircle2,
  Headphones,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import { catalog, formatPrice } from "../data/esim-catalog";
import ContactSlideOver from "./ContactSlideOver";
import s from "@/styles/esim.module.scss";

type PaymentMethod = "vietqr" | "onepay";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pkgId = searchParams.get("pkg") || catalog[0].id;
  const skuId = searchParams.get("sku") || catalog[0].variants[0].sku;
  const qty = Number(searchParams.get("qty") || 1);

  const pkg = useMemo(
    () => catalog.find((p) => p.id === pkgId) || catalog[0],
    [pkgId]
  );
  const variant = useMemo(
    () => pkg.variants.find((v) => v.sku === skuId) || pkg.variants[0],
    [pkg, skuId]
  );

  const subtotal = variant.price * qty;
  const serviceFee = subtotal >= 300000 ? 0 : 12000;
  const total = subtotal + serviceFee;

  // Form state
  const [step, setStep] = useState<2 | 3>(2);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vietqr");
  
  // Step 3 UI states
  const [summaryOpen, setSummaryOpen] = useState(false);

  // countdown: 59 mins = 3540 seconds
  const [timeLeft, setTimeLeft] = useState(3540);

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const validateEmail = (val: string) => {
    if (!val) return "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Email không hợp lệ";
    return "";
  };

  const handleContinue = useCallback(() => {
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [email]);

  const handlePay = useCallback(() => {
    alert(
      `Demo: Thanh toán ${formatPrice(total)} bằng ${paymentMethod.toUpperCase()} thành công!\n\nQR eSIM đã được gửi về ${email}`
    );
    router.push("/sim-du-lich");
  }, [total, paymentMethod, email, router]);

  const handleContactSave = useCallback(
    (name: string, phone: string) => {
      setContactName(name);
      setContactPhone(phone);
      setShowContact(false);
    },
    []
  );

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32 pt-32 lg:pt-40 font-['Nunito_Sans']">
      <button 
        onClick={() => step === 3 ? setStep(2) : router.back()} 
        className="flex items-center gap-2 text-slate-600 hover:text-midnight-ink font-semibold mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> {step === 3 ? "Quay lại nhập thông tin" : "Quay lại chọn gói"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-midnight-ink mb-2">Thông tin liên lạc</h2>
              <p className="text-slate-500 mb-8">Vui lòng cung cấp thông tin để chúng tôi gửi mã QR eSIM cho bạn.</p>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Địa chỉ email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="name@email.com"
                    className={`w-full h-14 px-4 rounded-xl border ${emailError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} focus:ring-2 focus:ring-hb-navy focus:border-transparent outline-none transition-all text-lg`}
                  />
                  {emailError ? (
                    <p className="text-red-500 text-sm mt-2">{emailError}</p>
                  ) : (
                    <p className="text-slate-500 text-sm mt-2">Mã kích hoạt eSIM sẽ được gửi qua email này, hãy kiểm tra kỹ nhé.</p>
                  )}
                </div>

                {contactName ? (
                    <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center border border-blue-100">
                      <div>
                        <div className="font-bold text-midnight-ink">{contactName}</div>
                        <div className="text-slate-600 mt-1">{contactPhone}</div>
                      </div>
                      <button onClick={() => setShowContact(true)} className="text-hb-navy text-sm font-bold hover:underline px-4 py-2">Sửa thông tin</button>
                    </div>
                ) : (
                    <button onClick={() => setShowContact(true)} className="flex items-center justify-center gap-2 w-full h-14 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-bold hover:border-hb-navy hover:text-hb-navy hover:bg-blue-50 transition-colors">
                      <User className="w-5 h-5" /> Thêm Họ tên & Số điện thoại (Tùy chọn)
                    </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {/* Countdown Banner */}
              <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#92400E] w-5 h-5" />
                  <span className="text-[#92400E] font-medium text-sm">Vui lòng hoàn tất thanh toán trong:</span>
                </div>
                <div className="font-mono text-[#F27145] text-xl font-bold tracking-wider">{formatTime(timeLeft)}</div>
              </div>

              {/* Collapsible Step 2 Summary */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setSummaryOpen(!summaryOpen)} 
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                    <span className="font-bold text-slate-800 text-lg">Thông tin khách hàng & Đơn hàng</span>
                  </div>
                  <ChevronDown className={`text-slate-400 transition-transform duration-300 ${summaryOpen ? 'rotate-180' : ''}`} />
                </button>
                {summaryOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-sm text-slate-700 bg-slate-50/50">
                    <div className="space-y-3 mt-4">
                      <div className="flex border-b border-slate-200 pb-2">
                        <span className="w-1/3 text-slate-500">Email nhận eSIM:</span> 
                        <span className="w-2/3 font-bold text-midnight-ink">{email}</span>
                      </div>
                      <div className="flex border-b border-slate-200 pb-2">
                        <span className="w-1/3 text-slate-500">Họ và tên:</span> 
                        <span className="w-2/3 font-semibold text-midnight-ink">{contactName || 'Không có'}</span>
                      </div>
                      <div className="flex border-b border-slate-200 pb-2">
                        <span className="w-1/3 text-slate-500">Số điện thoại:</span> 
                        <span className="w-2/3 font-semibold text-midnight-ink">{contactPhone || 'Không có'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="bg-[#EFF6FF] rounded-xl p-4 flex items-center gap-4 border border-[#DBEAFE]">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#1E40AF]">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E40AF] text-sm md:text-base">Giao dịch an toàn & bảo mật</h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-1">Thông tin thanh toán của bạn được mã hóa 256-bit SSL để đảm bảo an toàn tuyệt đối.</p>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-midnight-ink">Phương thức thanh toán</h3>
                <div className="space-y-4">
                  {/* VietQR */}
                  <label htmlFor="payment_vietqr" className={`flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'vietqr' ? 'border-hb-coral bg-[#FFFBF7] shadow-[0_0_0_4px_rgba(242,113,69,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      value="vietqr"
                      id="payment_vietqr"
                      checked={paymentMethod === "vietqr"}
                      onChange={(e) => setPaymentMethod(e.target.value as "vietqr")}
                      className="w-5 h-5 text-hb-coral focus:ring-hb-coral accent-hb-coral mr-4"
                    />
                    <Image src="/payment-method/transfer.svg" alt="Chuyển khoản" width={32} height={32} className="mr-3" />
                    <span className="font-bold text-slate-800 text-lg">Thanh toán quét mã QR</span>
                  </label>

                  {/* OnePay */}
                  <label htmlFor="payment_onepay" className={`flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'onepay' ? 'border-hb-coral bg-[#FFFBF7] shadow-[0_0_0_4px_rgba(242,113,69,0.1)]' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      value="onepay"
                      id="payment_onepay"
                      checked={paymentMethod === "onepay"}
                      onChange={(e) => setPaymentMethod(e.target.value as "onepay")}
                      className="w-5 h-5 text-hb-coral focus:ring-hb-coral accent-hb-coral mr-4"
                    />
                    <Image src="/payment-method/visa.svg" alt="Visa/MasterCard" width={54} height={32} className="mr-3 object-contain" />
                    <span className="font-bold text-slate-800 text-lg">Thẻ tín dụng / Ghi nợ quốc tế</span>
                  </label>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-500 leading-relaxed">
                      Bằng việc nhấn "Thanh toán ngay", bạn đồng ý với <a className="text-[#1E40AF] font-semibold hover:underline" href="#">Điều khoản dịch vụ</a> và <a className="text-[#1E40AF] font-semibold hover:underline" href="#">Chính sách bảo mật</a> của HappyBook.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-[140px] space-y-6 h-fit">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-midnight-ink">Tóm tắt đơn hàng</h3>
              
              {/* Product Item */}
              <div className="flex gap-4 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-hb-navy to-blue-500 flex-shrink-0 flex items-center justify-center text-white shadow-inner">
                    <span className="font-bold text-lg">eSIM</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 leading-tight">eSIM {pkg.destination}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{variant.desc} - {pkg.network}</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">Số lượng: {qty < 10 ? `0${qty}` : qty}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Phí dịch vụ</span>
                  <span className={serviceFee === 0 ? "text-slate-400 italic font-normal" : ""}>
                    {serviceFee === 0 ? "Miễn phí" : formatPrice(serviceFee)}
                  </span>
                </div>
              </div>

              {/* Total Section */}
              <div className="pt-6 border-t border-slate-100 space-y-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-500 mb-1">Số tiền thanh toán:</span>
                  <span className="text-3xl font-bold text-[#F27145]">{formatPrice(total)}</span>
                </div>
                
                {step === 3 && (
                    <button 
                      onClick={handlePay} 
                      className="w-full bg-[#F27145] text-white h-14 rounded-xl font-bold text-lg hover:bg-[#E06138] active:scale-[0.98] transition-all shadow-lg shadow-[#F27145]/30 flex items-center justify-center gap-2"
                    >
                        Thanh toán ngay <ChevronRight className="w-5 h-5" />
                    </button>
                )}
                {step === 2 && (
                    <button 
                      onClick={handleContinue} 
                      className="w-full bg-hb-navy text-white h-14 rounded-xl font-bold text-lg hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg shadow-hb-navy/30 flex items-center justify-center gap-2"
                    >
                        Tới bước thanh toán <ChevronRight className="w-5 h-5" />
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Help Link */}
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Headphones className="w-5 h-5" />
            <span>Cần hỗ trợ? <a className="text-[#1E40AF] font-bold hover:underline" href="#">Chat với chúng tôi</a></span>
          </div>
        </div>
      </div>

      {/* Contact slide-over for collecting name/phone */}
      {showContact && (
        <ContactSlideOver
          initialName={contactName}
          initialPhone={contactPhone}
          onSave={handleContactSave}
          onClose={() => setShowContact(false)}
        />
      )}
    </main>
  );
}
