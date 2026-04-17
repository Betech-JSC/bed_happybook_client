"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Mail,
  User,
  Phone,
  Shield,
  ChevronRight,
  Clock,
  CreditCard,
  Wallet,
  Smartphone as SmartphoneIcon,
  ShoppingCart,
} from "lucide-react";
import { catalog, formatPrice } from "../data/esim-catalog";
import ContactSlideOver from "./ContactSlideOver";
import s from "@/styles/esim.module.scss";

type PaymentMethod = "momo" | "paypal" | "card" | "gpay";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");

  // countdown
  const [timeLeft] = useState("14:59");

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

  const paymentMethods: {
    id: PaymentMethod;
    name: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "momo",
      name: "MoMo",
      desc: "Ví điện tử MoMo",
      icon: <Wallet size={20} />,
    },
    {
      id: "paypal",
      name: "PayPal",
      desc: "Tài khoản PayPal",
      icon: <Wallet size={20} />,
    },
    {
      id: "card",
      name: "Thẻ tín dụng / Ghi nợ",
      desc: "Visa, Mastercard, JCB",
      icon: <CreditCard size={20} />,
    },
    {
      id: "gpay",
      name: "Google Pay",
      desc: "Thanh toán nhanh",
      icon: <SmartphoneIcon size={20} />,
    },
  ];

  return (
    <main className={s.checkoutPage}>
      {/* Progress bar */}
      <div className={s.progressBar}>
        <div className={s.progressStep}>
          <div className={`${s.stepCircle} ${s.stepCompleted}`}>
            <Check size={16} />
          </div>
          <span className={`${s.stepLabel} ${s.stepLabelCompleted}`}>
            Chọn gói
          </span>
          <div className={`${s.stepConnector} ${s.stepConnectorDone}`} />
        </div>

        <div className={s.progressStep}>
          <div
            className={`${s.stepCircle} ${
              step === 2 ? s.stepActive : s.stepCompleted
            }`}
          >
            {step > 2 ? <Check size={16} /> : "2"}
          </div>
          <span
            className={`${s.stepLabel} ${
              step === 2
                ? s.stepLabelActive
                : step > 2
                ? s.stepLabelCompleted
                : ""
            }`}
          >
            Điền thông tin
          </span>
          <div
            className={`${s.stepConnector} ${
              step > 2 ? s.stepConnectorDone : ""
            }`}
          />
        </div>

        <div className={s.progressStep}>
          <div
            className={`${s.stepCircle} ${step === 3 ? s.stepActive : ""}`}
          >
            3
          </div>
          <span
            className={`${s.stepLabel} ${
              step === 3 ? s.stepLabelActive : ""
            }`}
          >
            Thanh toán
          </span>
        </div>
      </div>

      <div className={s.checkoutGrid}>
        {/* Left content */}
        <div>
          {step === 2 ? (
            <>
              {/* Order info card */}
              <div className={s.formCard} style={{ marginBottom: 16 }}>
                <h2>
                  <ShoppingCart size={20} /> Thông tin đơn hàng
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 16,
                    background: "#f8fafc",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      background:
                        "linear-gradient(135deg, #1e40af, #2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      flexShrink: 0,
                    }}
                  >
                    eSIM
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "0.9375rem",
                      }}
                    >
                      eSIM {pkg.destination} | {pkg.network}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "#64748b",
                        marginTop: 4,
                      }}
                    >
                      {variant.desc} &middot; x{qty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className={s.formCard}>
                <h2>
                  <Mail size={20} /> Thông tin liên lạc
                </h2>
                <div className={s.formGroup}>
                  <label>
                    Địa chỉ email <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="name@email.com"
                    className={emailError ? s.inputError : ""}
                  />
                  {emailError ? (
                    <div className={s.errorText}>{emailError}</div>
                  ) : (
                    <div className={s.helperText}>
                      Mã kích hoạt eSIM sẽ được gửi về địa chỉ email này.
                    </div>
                  )}
                </div>

                {contactName ? (
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {contactName}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                        {contactPhone}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowContact(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1e40af",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={s.btnSecondary}
                    onClick={() => setShowContact(true)}
                    style={{ marginTop: 4 }}
                  >
                    <User size={16} /> Thêm thông tin liên lạc
                  </button>
                )}

                <div className={s.noteBox} style={{ marginTop: 16 }}>
                  <div className={s.noteText}>
                    Vui lòng điền thông tin chính xác. Thông tin không thể chỉnh
                    sửa sau khi gửi.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className={s.btnPrimary}
                  onClick={handleContinue}
                >
                  Tiếp tục thanh toán <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Step 3 — Payment */
            <>
              <div className={s.formCard} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#eff6ff",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <Shield size={20} style={{ color: "#1e40af" }} />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#1e40af",
                        fontSize: "0.875rem",
                      }}
                    >
                      Giao dịch an toàn &amp; bảo mật
                    </div>
                    <div
                      style={{ fontSize: "0.8125rem", color: "#1e40af" }}
                    >
                      Thông tin thanh toán được mã hóa 256-bit SSL
                    </div>
                  </div>
                </div>

                <h2>Phương thức thanh toán</h2>

                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    className={`${s.paymentMethodCard} ${
                      paymentMethod === pm.id ? s.paymentMethodActive : ""
                    }`}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    <div className={s.paymentMethodIcon}>{pm.icon}</div>
                    <div className={s.paymentMethodInfo}>
                      <div className={s.paymentMethodName}>{pm.name}</div>
                      <div className={s.paymentMethodDesc}>{pm.desc}</div>
                    </div>
                    <div className={s.radioCardDot} />
                  </button>
                ))}

                {paymentMethod === "card" && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 16,
                      background: "#f8fafc",
                      borderRadius: 12,
                    }}
                  >
                    <div className={s.formGroup}>
                      <label>Số thẻ</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div className={s.formGroup}>
                        <label>Ngày hết hạn</label>
                        <input type="text" placeholder="MM/YY" />
                      </div>
                      <div className={s.formGroup}>
                        <label>CVV</label>
                        <input type="text" placeholder="000" />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginTop: 16,
                    lineHeight: 1.5,
                  }}
                >
                  Bằng việc nhấn &quot;Thanh toán ngay&quot;, bạn đồng ý với{" "}
                  <a href="#" style={{ color: "#1e40af" }}>
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" style={{ color: "#1e40af" }}>
                    Chính sách bảo mật
                  </a>{" "}
                  của HappyBook Travel.
                </div>
              </div>

              <button
                type="button"
                className={s.btnPrimary}
                onClick={handlePay}
              >
                Thanh toán ngay — {formatPrice(total)}
              </button>

              <button
                type="button"
                className={s.btnSecondary}
                onClick={() => setStep(2)}
                style={{ marginTop: 8 }}
              >
                Quay lại
              </button>
            </>
          )}
        </div>

        {/* Right: Order summary sidebar */}
        <div className={s.sidebar}>
          <div className={s.orderCard}>
            <div className={s.orderCardHeader}>
              <h3>Tóm tắt đơn hàng</h3>
            </div>
            <div className={s.orderCardBody}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  padding: 12,
                  background: "#f8fafc",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #1e40af, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  eSIM
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: "0.875rem",
                    }}
                  >
                    eSIM {pkg.destination}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    {variant.desc} &middot; x{qty}
                  </div>
                </div>
              </div>

              <div className={s.orderLine}>
                <span className={s.orderLineLabel}>Tạm tính</span>
                <span className={s.orderLineValue}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className={s.orderLine}>
                <span className={s.orderLineLabel}>Phí xử lý</span>
                <span className={s.orderLineValue}>
                  {serviceFee === 0 ? "Miễn phí" : formatPrice(serviceFee)}
                </span>
              </div>

              <hr className={s.orderDivider} />

              <div className={s.orderTotal}>
                <span className={s.orderTotalLabel}>Số tiền thanh toán</span>
                <span className={s.orderTotalValue}>
                  {formatPrice(total)}
                </span>
              </div>

              {step === 3 && (
                <div
                  className={s.countdownTimer}
                  style={{ marginTop: 16, justifyContent: "center" }}
                >
                  <Clock size={18} />
                  Giữ chỗ: {timeLeft}
                </div>
              )}

              <div className={s.securityBadge}>
                <Shield size={20} />
                <span className={s.securityText}>
                  Thanh toán bảo mật — Dữ liệu mã hóa 256-bit PCI DSS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact slide-over */}
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

