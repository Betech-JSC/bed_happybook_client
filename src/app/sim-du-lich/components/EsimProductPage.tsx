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
  ChevronDown,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Zap,
  RefreshCw,
  Star,
  CheckCircle2,
  BadgeCheck,
  Headset,
  Info
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

export default function EsimProductPage({ footerContent }: { footerContent?: React.ReactNode }) {
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
    <main className="max-w-7xl mx-auto px-6 py-8 pb-32 pt-32 lg:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left Content Column */}
        <div className="space-y-8">
          
          {/* Hero Section */}
          <section className="relative aspect-[16/9] w-full overflow-hidden rounded-12px shadow-lg bg-hb-navy flex items-center justify-center">
            {/* If there was a real image, we'd use <img /> but let's use the nice CSS gradient fallback with the new text location for now since no image is provided dynamically yet. */}
            <div className="text-center z-10 px-6">
              <h2 className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{selectedPackage.destination}</h2>
              <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow">{selectedPackage.title} — {selectedPackage.network}</p>
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-hb-navy/90 to-transparent"></div>

            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
              <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <Globe size={16} className="text-hb-navy" />
                <span className="text-xs font-bold text-midnight-ink uppercase">{selectedPackage.coverage}</span>
              </div>
              <div className="bg-hb-navy px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm">eSIM</div>
              <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-midnight-ink text-xs font-bold shadow-sm">{selectedPackage.network}</div>
            </div>
          </section>

          {/* Product Info Header */}
          <section>
            <h1 className="text-3xl font-bold text-midnight-ink mb-2">
              eSIM {selectedPackage.destination} | {selectedPackage.title}
            </h1>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <Mail className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
                <div>
                  <p className="text-xs text-steel-secondary">Giao hàng</p>
                  <p className="text-sm font-semibold text-midnight-ink">Nhận qua email tức thì</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <Wifi className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
                <div>
                  <p className="text-xs text-steel-secondary">Chia sẻ</p>
                  <p className="text-sm font-semibold text-midnight-ink">Hỗ trợ hotspot</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <Shield className="w-6 h-6 text-hb-navy bg-blue-50 p-1.5 rounded-lg box-content" />
                <div>
                  <p className="text-xs text-steel-secondary">Cam kết</p>
                  <p className="text-sm font-semibold text-midnight-ink">Hoàn tiền đầy đủ</p>
                </div>
              </div>
            </div>
          </section>

          {/* Package Selection Card */}
          <section className="bg-white rounded-12px shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-8">
              
              {/* Loại gói Tabs */}
              <div>
                <p className="text-sm font-bold text-midnight-ink mb-4">Loại gói</p>
                <div className="flex border-b border-slate-100">
                  <button className="px-6 py-2 border-b-2 border-hb-coral text-hb-coral font-semibold text-sm">
                    {selectedPackage.title}
                  </button>
                  <button onClick={() => setShowModal(true)} className="px-6 py-2 text-steel-secondary hover:text-midnight-ink transition-colors font-medium text-sm flex items-center gap-1">
                    Xem gói khác <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hạn sử dụng Chips */}
              <div>
                <p className="text-sm font-bold text-midnight-ink mb-3">Hạn sử dụng (Ngày)</p>
                <div className="flex flex-wrap gap-2">
                  {validityOptions.map((v) => {
                    const isActive = selectedVariant.validity === v;
                    return (
                      <button
                        key={v}
                        onClick={() => {
                          const match = selectedPackage.variants.find((vr) => vr.validity === v);
                          if (match) setSelectedSku(match.sku);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive 
                            ? "bg-[#FFF7ED] border-2 border-hb-coral text-hb-coral font-bold" 
                            : "border border-slate-200 font-medium hover:border-hb-coral"
                        }`}
                      >
                        {v} Ngày
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gói Data Chips */}
              <div>
                <p className="text-sm font-bold text-midnight-ink mb-3">Gói Data</p>
                <div className="flex flex-wrap gap-2">
                  {dataOptions.map((d) => {
                    const isActive = selectedVariant.data === d;
                    return (
                      <button
                        key={d}
                        onClick={() => {
                          const match = selectedPackage.variants.find((vr) => vr.data === d);
                          if (match) setSelectedSku(match.sku);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive 
                            ? "bg-[#FFF7ED] border-2 border-hb-coral text-hb-coral font-bold" 
                            : "border border-slate-200 font-medium hover:border-hb-coral"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Type & Quantity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-bold text-midnight-ink mb-2">Loại dịch vụ</p>
                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 inline-flex items-center gap-2">
                    <Globe className="w-4 h-4 text-hb-navy" />
                    <span className="text-sm font-semibold text-midnight-ink">Chỉ internet</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-midnight-ink mb-2">Số lượng</p>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
                    <button 
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center font-bold text-midnight-ink border-x border-slate-200">
                      {quantity}
                    </div>
                    <button 
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </section>

          {/* Chọn điểm đến khác (kept from old UI but adapted) */}
          <div className="pt-8">
              <h3 className="text-xl font-bold text-midnight-ink flex items-center gap-2 mb-4">
                <Globe size={24} className="text-hb-navy" /> Chọn điểm đến khác
              </h3>

              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo quốc gia, khu vực..."
                  className="w-full h-12 border border-slate-200 rounded-xl pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-hb-coral focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      region === r ? "bg-hb-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-hb-navy hover:text-hb-navy"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCatalog.map((pkg) => {
                  const cheapest = [...pkg.variants].sort((a, b) => a.price - b.price)[0];
                  const isActive = pkg.id === selectedPackageId;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isActive ? "border-hb-navy bg-blue-50/50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-hb-coral" : "bg-slate-200"}`} />
                        <div>
                          <div className={`font-bold ${isActive ? "text-hb-navy" : "text-midnight-ink"}`}>{pkg.destination}</div>
                          <div className="text-sm text-steel-secondary mt-1 line-clamp-1">{pkg.subtitle} — {pkg.network}</div>
                          <div className="text-sm font-bold text-hb-coral mt-2">Từ {formatPrice(cheapest.price)}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
          </div>
          
        </div>

        {/* Right Sidebar Column */}
        <aside className="space-y-6 sticky top-32 lg:top-40 h-fit">
          
          {/* Price & CTA Card (Floating on Desktop) */}
          <div className="bg-white rounded-12px p-6 shadow-lg border border-slate-100">
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-steel-secondary text-sm font-medium">Tổng cộng:</span>
                <span className="text-3xl font-bold text-hb-coral">{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] text-right text-steel-secondary">
                {serviceFee > 0 ? "Đã bao gồm thuế và phí xử lý" : "Đã bao gồm thuế, Miễn phí xử lý"}
              </p>
              
              <div className="pt-4 space-y-3">
                <button onClick={handleBookNow} className="w-full bg-hb-coral hover:bg-orange-600 text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Đặt ngay
                </button>
              </div>
              
              <div className="pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-steel-secondary">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Đảm bảo giá tốt nhất</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-steel-secondary">
                  <Headset className="w-4 h-4" />
                  <span>Hỗ trợ khách hàng 24/7</span>
                </div>
              </div>
            </div>
            
            <hr className="my-6 border-slate-100" />
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-midnight-ink">Chi tiết gói dịch vụ</h3>
              <div className="space-y-3">
                <div className="group border border-slate-100 rounded-lg overflow-hidden">
                  <div className="w-full flex items-center justify-between p-3 text-left">
                    <span className="text-xs font-semibold">Tóm tắt</span>
                  </div>
                  <div className="p-3 pt-0 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30">
                    <span className="font-semibold block mb-1">{selectedVariant.desc}</span>
                    Đơn giá: {formatPrice(selectedVariant.price)} x {quantity}
                  </div>
                </div>

                <div className="group border border-slate-100 rounded-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-semibold">Khả năng tương thích thiết bị</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <div className="group border border-slate-100 rounded-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-semibold">Chính sách hoàn tiền</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <div className="group border border-slate-100 rounded-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-semibold">Câu hỏi thường gặp (FAQ)</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-12px p-4 border border-blue-100 flex gap-3">
            <Info className="w-10 h-6 -translate-y-1 text-hb-navy" />
            <p className="text-xs text-hb-navy leading-relaxed font-medium">
              Dữ liệu sẽ được kích hoạt ngay khi bạn kết nối với mạng di động tại <strong>{selectedPackage.destination}</strong>. Thời hạn sử dụng tính theo chu kỳ {selectedPackage.activation.toLowerCase()}.<br/><br/>
              <span className="opacity-80 block text-[11px] italic">{selectedPackage.note}</span>
            </p>
          </div>
          
        </aside>
      </div>

      {/* Sticky bottom bar (mobile) */}
      <div className="lg:hidden fixed bottom-16 sm:bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
        <div>
          <div className="text-xs text-steel-secondary">Tổng thanh toán</div>
          <div className="text-xl font-bold text-hb-coral">{formatPrice(total)}</div>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-hb-coral hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
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

      {/* Chân trang passed from Server Component */}
      {footerContent}
    </main>
  );
}
