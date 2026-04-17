"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Wifi,
  Mail,
  Shield,
  Smartphone,
  Clock,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  catalog,
  regions,
  formatPrice,
  type EsimPackage,
  type EsimVariant,
} from "../data/esim-catalog";
import PackageSelectorModal from "./PackageSelectorModal";
import s from "@/styles/esim.module.scss";

export default function EsimProductPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Tất cả");
  const [selectedPackageId, setSelectedPackageId] = useState(catalog[0].id);
  const [selectedSku, setSelectedSku] = useState(catalog[0].variants[0].sku);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      const matchRegion = region === "Tất cả" || item.region === region;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.destination.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.coverage.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q);
      return matchRegion && matchQuery;
    });
  }, [query, region]);

  const selectedPackage = useMemo(() => {
    return catalog.find((item) => item.id === selectedPackageId) || catalog[0];
  }, [selectedPackageId]);

  const selectedVariant = useMemo(() => {
    return (
      selectedPackage.variants.find((v) => v.sku === selectedSku) ||
      selectedPackage.variants[0]
    );
  }, [selectedPackage, selectedSku]);

  const subtotal = selectedVariant.price * quantity;
  const serviceFee = subtotal >= 300000 ? 0 : 12000;
  const total = subtotal + serviceFee;

  const handleSelectPackage = useCallback((pkg: EsimPackage) => {
    setSelectedPackageId(pkg.id);
    setSelectedSku(pkg.variants[0].sku);
  }, []);

  const handleSelectVariant = useCallback((variant: EsimVariant) => {
    setSelectedSku(variant.sku);
    setShowModal(false);
  }, []);

  const handleBookNow = useCallback(() => {
    const params = new URLSearchParams({
      pkg: selectedPackageId,
      sku: selectedSku,
      qty: String(quantity),
    });
    router.push(`/sim-du-lich/checkout?${params.toString()}`);
  }, [router, selectedPackageId, selectedSku, quantity]);

  // Unique validity options for chip group
  const validityOptions = useMemo(() => {
    const set = new Set(selectedPackage.variants.map((v) => v.validity));
    return Array.from(set).sort((a, b) => a - b);
  }, [selectedPackage]);

  // Unique data options for chip group
  const dataOptions = useMemo(() => {
    const set = new Set(selectedPackage.variants.map((v) => v.data));
    return Array.from(set);
  }, [selectedPackage]);

  return (
    <main className={s.esimPage}>
      <div className={s.esimContainer}>
        {/* Breadcrumb */}
        <nav className={s.breadcrumb}>
          <a href="/">Trang chủ</a>
          <ChevronRight size={14} />
          <a href="/sim-du-lich">Sim du lịch</a>
          <ChevronRight size={14} />
          <span>{selectedPackage.destination}</span>
        </nav>

        <div className={s.productGrid}>
          {/* LEFT: Product content */}
          <div>
            {/* Hero */}
            <div className={s.heroImage}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "24px",
                }}
              >
                <div>
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>
                    {selectedPackage.destination}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.9 }}>
                    {selectedPackage.title} — {selectedPackage.subtitle}
                  </div>
                </div>
              </div>
              <div className={s.heroOverlay}>
                <div className={s.countryBadge}>
                  <Globe size={16} />
                  {selectedPackage.coverage}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 700,
                color: "#1e293b",
                margin: "20px 0 8px",
                lineHeight: 1.3,
              }}
            >
              eSIM {selectedPackage.destination} | {selectedPackage.network}
            </h1>

            {/* Feature pills */}
            <div className={s.featureRow}>
              <div className={s.featurePill}>
                <Mail size={16} /> Nhận qua email tức thì
              </div>
              <div className={s.featurePill}>
                <Share2 size={16} /> Hỗ trợ hotspot
              </div>
              <div className={s.featurePill}>
                <RefreshCw size={16} /> Hoàn tiền đầy đủ
              </div>
            </div>

            {/* Chip groups — Loại gói / Hạn sử dụng / Gói Data */}
            <div className={s.chipGroup}>
              <div className={s.chipLabel}>Hạn sử dụng (Ngày)</div>
              <div className={s.chipList}>
                {validityOptions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`${s.chip} ${
                      selectedVariant.validity === v ? s.chipActive : ""
                    }`}
                    onClick={() => {
                      const match = selectedPackage.variants.find(
                        (vr) => vr.validity === v
                      );
                      if (match) setSelectedSku(match.sku);
                    }}
                  >
                    {v} Ngày
                  </button>
                ))}
              </div>
            </div>

            <div className={s.chipGroup}>
              <div className={s.chipLabel}>Gói Data</div>
              <div className={s.chipList}>
                {dataOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`${s.chip} ${
                      selectedVariant.data === d ? s.chipActive : ""
                    }`}
                    onClick={() => {
                      const match = selectedPackage.variants.find(
                        (vr) => vr.data === d
                      );
                      if (match) setSelectedSku(match.sku);
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className={s.chipGroup}>
              <div className={s.chipLabel}>Số lượng</div>
              <div className={s.quantitySelector}>
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus size={16} />
                </button>
                <div className={s.quantityValue}>{quantity}</div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Detail section */}
            <div className={s.detailSection}>
              <h3>
                <Zap size={18} /> Chi tiết gói dịch vụ
              </h3>
              <p>
                Dữ liệu sẽ được kích hoạt ngay khi bạn kết nối với mạng di động
                tại {selectedPackage.destination}. Thời hạn sử dụng:{" "}
                {selectedPackage.activation}.
              </p>
              <div className={s.noteBox}>
                <div className={s.noteTitle}>Lưu ý vận hành</div>
                <div className={s.noteText}>{selectedPackage.note}</div>
              </div>
            </div>

            {/* Destination list (filterable) */}
            <div className={s.detailSection} style={{ marginTop: 24 }}>
              <h3>
                <Globe size={18} /> Chọn điểm đến khác
              </h3>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: 12 }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo quốc gia, khu vực..."
                  style={{
                    width: "100%",
                    height: 44,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    paddingLeft: 36,
                    paddingRight: 12,
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Region filter */}
              <div className={s.chipList} style={{ marginBottom: 16 }}>
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`${s.chip} ${region === r ? s.chipActive : ""}`}
                    onClick={() => setRegion(r)}
                    style={{ padding: "6px 12px", minHeight: 36, fontSize: "0.8125rem" }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Package cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {filteredCatalog.map((pkg) => {
                  const cheapest = [...pkg.variants].sort(
                    (a, b) => a.price - b.price
                  )[0];
                  const isActive = pkg.id === selectedPackageId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className={s.radioCard + (isActive ? ` ${s.radioCardActive}` : "")}
                      style={{ textAlign: "left" }}
                    >
                      <div className={s.radioCardDot} />
                      <div className={s.radioCardContent}>
                        <div className={s.radioCardTitle}>{pkg.destination}</div>
                        <div className={s.radioCardDesc}>
                          {pkg.subtitle} — {pkg.network}
                        </div>
                      </div>
                      <div className={s.radioCardPrice}>
                        {formatPrice(cheapest.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className={s.sidebar}>
            <div className={s.orderCard}>
              <div className={s.orderCardHeader}>
                <h3>
                  eSIM {selectedPackage.destination}
                </h3>
                <p>{selectedVariant.desc}</p>
              </div>
              <div className={s.orderCardBody}>
                <div className={s.orderLine}>
                  <span className={s.orderLineLabel}>Gói dịch vụ</span>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1e40af",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Đổi gói <ChevronRight size={14} />
                  </button>
                </div>
                <div className={s.orderLine}>
                  <span className={s.orderLineLabel}>Đơn giá</span>
                  <span className={s.orderLineValue}>
                    {formatPrice(selectedVariant.price)}
                  </span>
                </div>
                <div className={s.orderLine}>
                  <span className={s.orderLineLabel}>Số lượng</span>
                  <span className={s.orderLineValue}>{quantity}</span>
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
                  <span className={s.orderTotalLabel}>Tổng thanh toán</span>
                  <span className={s.orderTotalValue}>
                    {formatPrice(total)}
                  </span>
                </div>

                <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                  <button
                    type="button"
                    className={s.btnPrimary}
                    onClick={handleBookNow}
                  >
                    <ShoppingCart size={18} /> Đặt ngay
                  </button>
                </div>

                <div className={s.securityBadge}>
                  <Shield size={20} />
                  <span className={s.securityText}>
                    Đã bao gồm thuế và phí dịch vụ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar (mobile) */}
      <div className={s.stickyBottomBar}>
        <div className={s.stickyPrice}>
          <div className={s.stickyPriceLabel}>Tổng thanh toán</div>
          <div className={s.stickyPriceValue}>{formatPrice(total)}</div>
        </div>
        <button
          type="button"
          className={s.stickyBtn}
          onClick={handleBookNow}
        >
          Đặt ngay
        </button>
      </div>

      {/* Package selector modal */}
      {showModal && (
        <PackageSelectorModal
          pkg={selectedPackage}
          currentSku={selectedSku}
          onSelect={handleSelectVariant}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
