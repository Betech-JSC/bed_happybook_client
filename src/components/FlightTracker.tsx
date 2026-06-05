"use client";

import React, { useState, useEffect } from 'react';
import {
    Plane, Search, Clock, Info, AlertCircle,
    ExternalLink, Globe, Calendar, CloudSun, Wind, Sun, Snowflake, Zap
} from 'lucide-react';

export default function FlightTracker() {
    const [flightNumber, setFlightNumber] = useState('');
    const [flightData, setFlightData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [triedSearch, setTriedSearch] = useState(false);

    // Generate 4 consecutive days starting from today for search options
    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 4; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const [dateOptions] = useState(generateDates());
    const [selectedDate, setSelectedDate] = useState(dateOptions[0].toISOString().split('T')[0]);

    const fetchFlightData = async (number: string, dateStr: string) => {
        if (!number) return;
        setLoading(true);
        setError(null);
        setTriedSearch(true);

        const formattedNumber = number.toUpperCase().replace(/\s/g, '');

        try {
            const response = await fetch(
                `/api/flight-status?flightNumber=${formattedNumber}&date=${dateStr}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData?.error || 'Không thể kết nối máy chủ.');
            }

            const data = await response.json();
            setFlightData(data);
        } catch (err: any) {
            setError(err?.message || "Có lỗi xảy ra khi tra cứu dữ liệu chuyến bay.");
            setFlightData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (flightNumber && triedSearch) {
            fetchFlightData(flightNumber, selectedDate);
        }
    }, [selectedDate]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (flightNumber.trim()) fetchFlightData(flightNumber, selectedDate);
    };

    const formatDateVN = (dateInput: Date | string | null | undefined) => {
        if (!dateInput) return "";
        const d = new Date(dateInput);
        const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`;
    };

    const formatTimeOnly = (dateString: string | null | undefined) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getWeatherIcon = (temp: number) => {
        if (temp > 30) return <Sun className="text-orange-500" size={20} />;
        if (temp < 15) return <Snowflake className="text-blue-400" size={20} />;
        return <CloudSun className="text-blue-400" size={20} />;
    };

    const getStatusBadge = (status: string) => {
        const lower = status.toLowerCase();
        let classes = "bg-slate-100 text-slate-700";
        let text = "Lên lịch";

        if (lower === "active" || lower === "enroute") {
            classes = "bg-green-50 text-green-700 border border-green-200 animate-pulse";
            text = "Đang bay";
        } else if (lower === "arrived" || lower === "landed") {
            classes = "bg-blue-50 text-blue-700 border border-blue-200";
            text = "Đã hạ cánh";
        } else if (lower === "cancelled") {
            classes = "bg-red-50 text-red-700 border border-red-200";
            text = "Đã hủy";
        } else if (lower === "delayed") {
            classes = "bg-orange-50 text-orange-700 border border-orange-200";
            text = "Chậm chuyến";
        } else if (lower === "scheduled" || lower === "expected") {
            classes = "bg-emerald-50 text-emerald-700 border border-emerald-200";
            text = "Đúng giờ";
        }

        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>{text}</span>;
    };

    return (
        <div className="w-full">
            {/* Search Form Card (Happy Book Style) */}
            <div className="bg-white rounded-xl shadow-md border border-slate-150 p-6 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4 w-full">
                    <div className="flex-1 w-full space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Số hiệu chuyến bay</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={18} />
                            <input
                                type="text"
                                placeholder="Nhập mã (vd: VN213, VJ198, QH224)..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#1570EF] focus:bg-white text-base font-semibold text-slate-800 uppercase tracking-wide transition-all placeholder:text-slate-300"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-[#1570EF] hover:bg-[#115cc5] text-white font-semibold py-3 px-10 rounded-lg shadow-sm transition-all disabled:opacity-50 uppercase text-sm tracking-wide h-[48px]"
                    >
                        {loading ? "Đang xử lý..." : "Tra cứu"}
                    </button>
                </form>
            </div>

            {/* Date Tabs (Clean Style) */}
            <div className="flex border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                {dateOptions.map((date) => {
                    const iso = date.toISOString().split('T')[0];
                    const isActive = selectedDate === iso;
                    return (
                        <button
                            key={iso}
                            onClick={() => setSelectedDate(iso)}
                            className={`px-6 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 relative tracking-wider ${isActive
                                    ? "border-[#1570EF] text-[#1570EF]"
                                    : "border-transparent text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {formatDateVN(date)}
                        </button>
                    );
                })}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-150 shadow-sm animate-fadeIn">
                    <div className="w-10 h-10 border-4 border-[#1570EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Đang đồng bộ vệ tinh và trạm khí tượng METAR...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50/40 border border-red-500/10 text-red-500 p-6 rounded-xl flex items-start gap-4 mb-8 animate-fadeIn">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Đã xảy ra sự cố</h4>
                        <p className="text-xs font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Result UI */}
            {flightData && !loading && (
                <div className="space-y-6 animate-fadeIn">
                    {flightData.isFallback ? (
                        /* SMART FALLBACK UI */
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-slate-150">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-1">{flightData.flightNumber}</h2>
                                    <p className="text-xs text-slate-400 font-semibold">{formatDateVN(flightData.date)}</p>
                                </div>
                                <span className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
                                    Không có dữ liệu Radar
                                </span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start bg-blue-50/50 p-6 rounded-lg border border-blue-100/30">
                                    <Info className="text-[#1570EF] shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-1">Trạng thái chặng bay nội địa</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            Thông tin chuyến bay này chưa được hãng hàng không đồng bộ trực tiếp lên hệ thống API Radar. 
                                            Để theo dõi lịch trình delay, giờ khởi hành chính xác hoặc số cửa khởi hành hiện tại, vui lòng mở trang kiểm tra nhanh:
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 pt-2 justify-start">
                                    <a
                                        href={flightData.googleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#1570EF] hover:bg-[#115cc5] text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm text-xs uppercase tracking-wider"
                                    >
                                        Tra cứu Google Status <ExternalLink size={12} />
                                    </a>
                                    <a
                                        href={flightData.oagUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-all text-xs border border-slate-200 uppercase tracking-wider"
                                    >
                                        Kiểm tra trên OAG Flight <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* DETAILED REALTIME FLIGHT CARD */
                        <>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-150">
                                {/* Header Card matching Happy Book style (Clean and simple with border-b) */}
                                <div className="px-6 py-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#0C4089] text-base font-bold uppercase">{flightData.airline}</span>
                                        <span className="text-slate-350">|</span>
                                        <span className="text-slate-800 text-lg font-bold">{flightData.flightNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(flightData.status)}
                                        <span className="hidden sm:inline text-xs text-slate-400 font-medium">Máy bay: <strong className="text-slate-700 font-semibold">{flightData.aircraft}</strong></span>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Flight Itinerary details */}
                                    <div className="flex justify-between items-center relative mb-12">
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-0"></div>

                                        <div className="z-10 bg-white pr-4">
                                            <div className="text-5xl font-bold text-[#0C4089] leading-none tracking-tight mb-2">{flightData.departure.iata}</div>
                                            <div className="text-[11px] font-semibold text-slate-400 max-w-[150px] truncate">{flightData.departure.airport?.split(',')[0]}</div>
                                        </div>

                                        <div className="z-10 bg-white px-4 text-center">
                                            <div className="w-12 h-12 bg-blue-50/50 border border-blue-100/30 rounded-full flex items-center justify-center text-[#1570EF] rotate-90 shadow-sm">
                                                <Plane size={22} fill="currentColor" />
                                            </div>
                                        </div>

                                        <div className="z-10 bg-white pl-4 text-right">
                                            <div className="text-5xl font-bold text-slate-800 leading-none tracking-tight mb-2">{flightData.arrival.iata}</div>
                                            <div className="text-[11px] font-semibold text-slate-400 max-w-[150px] truncate">{flightData.arrival.airport?.split(',')[0]}</div>
                                        </div>
                                    </div>

                                    {/* Timing & Gates info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <Clock size={12} className="text-[#1570EF]" /> Khởi hành dự kiến
                                                </p>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-3xl font-bold text-emerald-600 leading-none">{formatTimeOnly(flightData.departure.scheduledTime)}</span>
                                                    <div className="bg-slate-50 px-3 py-1 rounded text-xs font-semibold text-slate-500 border border-slate-100">
                                                        Ga {flightData.departure.terminal}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 inline-block min-w-[150px]">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Cửa khởi hành</p>
                                                <div className="text-2xl font-bold text-slate-700">{flightData.departure.gate}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <Clock size={12} className="text-[#1570EF]" /> Hạ cánh dự kiến
                                                </p>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-3xl font-bold text-slate-800 leading-none">{formatTimeOnly(flightData.arrival.scheduledTime)}</span>
                                                    <div className="bg-slate-50 px-3 py-1 rounded text-xs font-semibold text-slate-500 border border-slate-100">
                                                        Ga {flightData.arrival.terminal}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 inline-block min-w-[120px]">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Cửa đến</p>
                                                    <div className="text-2xl font-bold text-slate-700">{flightData.arrival.gate}</div>
                                                </div>
                                                <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-100 inline-block min-w-[120px]">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Băng chuyền hành lý</p>
                                                    <div className="text-2xl font-bold text-slate-700">{flightData.arrival.baggageClaim}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Utilities Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Destination Weather */}
                                <div className="bg-white rounded-xl p-6 border border-slate-150 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[#1570EF]"><CloudSun size={20} /></span>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Thời tiết điểm đến</h4>
                                        </div>
                                        {flightData.weather ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-50/50 p-2 rounded-lg text-[#1570EF]">
                                                        {getWeatherIcon(flightData.weather.tempC)}
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-slate-800">{flightData.weather.tempC}°C</div>
                                                        <p className="text-[10px] font-semibold text-slate-450 uppercase">Sân bay {flightData.arrival.iata}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                                                    <div className="bg-slate-50 p-3 rounded-lg flex flex-col gap-0.5">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Sức gió</span>
                                                        <span className="font-semibold text-slate-700">{flightData.weather.windKts} kts</span>
                                                    </div>
                                                    <div className="bg-slate-50 p-3 rounded-lg flex flex-col justify-center">
                                                        <span className="font-semibold text-[#1570EF] capitalize">{flightData.weather.condition}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-450 italic py-2">Dữ liệu METAR tạm thời không khả dụng</p>
                                        )}
                                    </div>
                                </div>

                                {/* Travel Tips Card */}
                                <div className="bg-white rounded-xl p-6 border border-slate-150 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info className="text-[#1570EF]" size={20} />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Lời khuyên hành trình</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex gap-2.5 items-start">
                                                <div className="w-1.5 h-1.5 bg-[#1570EF] rounded-full mt-1.5"></div>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                    Kiểm tra cổng hạ cánh trên màn hình FIDS ngay khi rời máy bay.
                                                </p>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <div className="w-1.5 h-1.5 bg-[#1570EF] rounded-full mt-1.5"></div>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                    Sân bay {flightData.arrival.iata} ga {flightData.arrival.terminal || "1"} hỗ trợ WiFi miễn phí tốc độ cao.
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                    <button className="w-full mt-4 py-2.5 border border-blue-100 rounded-lg text-xs font-semibold text-[#1570EF] uppercase tracking-wider hover:bg-blue-50/30 transition-all">
                                        Xem dịch vụ sân bay
                                    </button>
                                </div>

                                {/* Local Time Card */}
                                <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col justify-between shadow-md">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 opacity-70">
                                            <Globe size={18} />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Múi giờ địa phương</h4>
                                        </div>
                                        <div className="text-center py-2">
                                            <div className="text-4xl font-bold tracking-tight mb-1 text-white">
                                                {formatTimeOnly(flightData.arrival.scheduledTime)}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GIỜ ĐIỂM ĐẾN</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg text-center mt-3">
                                        <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-tight">
                                            Vui lòng cập nhật đồng hồ khi hạ cánh
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Empty State / Initial */}
            {!flightData && !loading && (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-blue-50/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1570EF]/45">
                        <Plane size={28} />
                    </div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Hệ thống sẵn sàng</h3>
                    <p className="text-slate-350 text-xs font-medium">Nhập số hiệu chuyến bay vào ô tìm kiếm để theo dõi lịch trình chi tiết</p>
                </div>
            )}

            {/* Footer info block */}
            <div className="mt-12 text-center text-[10px] font-semibold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-4">
                <span>API Proxy Secured</span>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                <span>Source: METAR / AeroDataBox</span>
            </div>
        </div>
    );
}