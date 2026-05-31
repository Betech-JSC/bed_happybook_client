import React, { useState, useEffect } from 'react';
import {
    Plane, Search, Clock, MapPin, Navigation, Info, AlertCircle,
    ExternalLink, Globe, Calendar, ChevronRight, Thermometer,
    CloudSun, Wind, Sun, Snowflake, CloudRain, Zap
} from 'lucide-react';

export default function FlightTracker() {
    const [flightNumber, setFlightNumber] = useState('');
    const [flightData, setFlightData] = useState<any>(null);
    const [arrivalWeather, setArrivalWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [triedSearch, setTriedSearch] = useState(false);

    // Tạo danh sách 4 ngày liên tiếp cho Tab chọn ngày
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

    const RAPID_API_KEY = '270b69387amsha43b11b1b0a8eedp1b6036jsn48a375d93ad2';
    const RAPID_API_HOST = 'aerodatabox.p.rapidapi.com';

    const fetchAirportWeather = async (iataCode: string) => {
        try {
            const response = await fetch(
                `https://aerodatabox.p.rapidapi.com/airports/iata/${iataCode}/weather/current`,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': RAPID_API_KEY,
                        'X-RapidAPI-Host': RAPID_API_HOST
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setArrivalWeather(data);
            }
        } catch (err) {
            console.error("Không lấy được dữ liệu thời tiết:", err);
        }
    };

    const fetchFlightData = async (number: string, dateStr: string) => {
        if (!number) return;
        setLoading(true);
        setError(null);
        setTriedSearch(true);
        setArrivalWeather(null);

        const formattedNumber = number.toUpperCase().replace(/\s/g, '');

        try {
            const response = await fetch(
                `https://aerodatabox.p.rapidapi.com/flights/number/${formattedNumber}/${dateStr}?withAircraftImage=false&withLocation=false`,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': RAPID_API_KEY,
                        'X-RapidAPI-Host': RAPID_API_HOST
                    }
                }
            );

            if (response.status === 403) throw new Error('API Key chưa được kích hoạt gói Basic trên RapidAPI.');

            const data = await response.json();

            if (data && data.length > 0) {
                const fData = data[0];
                setFlightData(fData);
                // Sau khi có dữ liệu chuyến bay, lấy luôn thời tiết sân bay đến
                if (fData.arrival?.airport?.iata) {
                    fetchAirportWeather(fData.arrival.airport.iata);
                }
            } else {
                setFlightData(null);
                setError(`Không tìm thấy dữ liệu cho ${formattedNumber} vào ngày này.`);
            }
        } catch (err: any) {
            setError(err?.message || "Có lỗi xảy ra");
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
        return `${days[d.getDay()]}, ${d.getDate()} thg ${d.getMonth() + 1}`;
    };

    const formatTimeOnly = (dateString: string | null | undefined) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getWeatherIcon = (temp: number) => {
        if (temp > 30) return <Sun className="text-orange-500" size={24} />;
        if (temp < 15) return <Snowflake className="text-blue-400" size={24} />;
        return <CloudSun className="text-indigo-400" size={24} />;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100">
                            <Plane className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Flight Radar VN</h1>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-[2.2rem] shadow-sm border border-slate-200 p-2 mb-8 flex items-center group focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                            <input
                                type="text"
                                placeholder="Nhập số hiệu (vd: KE887, VN213)..."
                                className="w-full pl-14 pr-4 py-4 bg-transparent text-xl font-black outline-none placeholder:text-slate-200 text-slate-800"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                        >
                            {loading ? "Đang xử lý..." : "Tra cứu"}
                        </button>
                    </form>
                </div>

                {/* Date Tabs */}
                <div className="flex border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                    {dateOptions.map((date) => {
                        const iso = date.toISOString().split('T')[0];
                        const isActive = selectedDate === iso;
                        return (
                            <button
                                key={iso}
                                onClick={() => setSelectedDate(iso)}
                                className={`px-8 py-4 text-xs font-black whitespace-nowrap transition-all border-b-4 relative uppercase tracking-widest ${isActive
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-300 hover:text-slate-500"
                                    }`}
                            >
                                {formatDateVN(date)}
                            </button>
                        );
                    })}
                </div>

                {/* Result UI */}
                {flightData && !loading && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Main Flight Card */}
                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/40 overflow-hidden border border-slate-50">
                            <div className="bg-[#0f172a] p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-4">{flightData.number}</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                                            <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em]">
                                                {flightData.airline?.name || "HÃNG HÀNG KHÔNG"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest mb-4 shadow-lg ${flightData.status === 'Arrived' ? 'bg-emerald-500' : 'bg-indigo-600'
                                            }`}>
                                            {flightData.status === 'EnRoute' ? 'Đang bay' : (flightData.status === 'Arrived' ? 'Đã hạ cánh' : 'Đúng giờ')}
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Máy bay: <span className="text-slate-300">{flightData.aircraft?.model || "B787-9"}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 md:p-14">
                                <div className="flex justify-between items-center relative mb-20">
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-50 -z-0"></div>

                                    <div className="z-10 bg-white pr-8">
                                        <div className="text-7xl font-black text-indigo-600 leading-none tracking-tighter mb-2">{flightData.departure?.airport?.iata}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{flightData.departure?.airport?.name?.split(',')[0]}</div>
                                    </div>

                                    <div className="z-10 bg-white px-6 text-center">
                                        <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 rotate-90 shadow-inner">
                                            <Plane size={32} fill="currentColor" />
                                        </div>
                                    </div>

                                    <div className="z-10 bg-white pl-8 text-right">
                                        <div className="text-7xl font-black text-slate-800 leading-none tracking-tighter mb-2">{flightData.arrival?.airport?.iata}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{flightData.arrival?.airport?.name?.split(',')[0]}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-600" /> Khởi hành dự kiến
                                            </p>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-5xl font-black text-emerald-500 tracking-tighter">{formatTimeOnly(flightData.departure?.scheduledTime?.local)}</span>
                                                <div className="bg-slate-50 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-400 uppercase border border-slate-100">
                                                    Ga <span className="text-slate-900 text-lg ml-1">{flightData.departure?.terminal || "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/60 p-6 rounded-[2rem] inline-block min-w-[180px] border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">Cửa đi</p>
                                            <div className="text-4xl font-black text-slate-800 leading-none">{flightData.departure?.gate || "---"}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 md:border-l md:border-slate-50 md:pl-16">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-600" /> Hạ cánh dự kiến
                                            </p>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-5xl font-black text-slate-800 tracking-tighter">{formatTimeOnly(flightData.arrival?.scheduledTime?.local)}</span>
                                                <div className="bg-slate-50 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-400 uppercase border border-slate-100">
                                                    Ga <span className="text-slate-900 text-lg ml-1">{flightData.arrival?.terminal || "-"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/60 p-6 rounded-[2rem] inline-block min-w-[180px] border border-slate-100">
                                            <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">Cửa đến</p>
                                            <div className="text-4xl font-black text-slate-800 leading-none">{flightData.arrival?.gate || "---"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Utilities Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Weather Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
                                <Zap className="absolute top-0 right-0 p-8 opacity-10" size={120} />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-70 italic">Thời tiết điểm đến</p>
                                    {arrivalWeather ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                                    {getWeatherIcon(arrivalWeather.tempC)}
                                                </div>
                                                <div>
                                                    <div className="text-4xl font-black italic">{arrivalWeather.tempC}°C</div>
                                                    <p className="text-[10px] font-bold uppercase opacity-60">Sân bay {flightData.arrival?.airport?.iata}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="bg-white/10 p-4 rounded-2xl flex flex-col gap-1">
                                                    <Wind size={16} className="opacity-50" />
                                                    <span className="text-xs font-black italic">Gió {arrivalWeather.wind?.speedKts || 0} kts</span>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-2xl flex flex-col gap-1 text-[10px] font-black uppercase italic opacity-60">
                                                    {arrivalWeather.tempC > 25 ? "Mặc đồ mỏng" : "Mang áo khoác"}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4 animate-pulse">
                                            <div className="h-10 bg-white/10 w-full rounded-2xl mb-4"></div>
                                            <p className="text-[10px] font-bold opacity-50 uppercase italic tracking-tighter">Đang kết nối trạm METAR...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Travel Tips Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Info className="text-indigo-600" size={20} />
                                        <h4 className="text-xs font-black uppercase tracking-widest">Lời khuyên hành trình</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                Kiểm tra cổng hạ cánh trên màn hình FIDS ngay khi rời máy bay.
                                            </p>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5"></div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                Sân bay {flightData.arrival?.airport?.iata} ga {flightData.arrival?.terminal || "1"} có hỗ trợ WiFi miễn phí tốc độ cao.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                <button className="w-full mt-6 py-3 border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all">
                                    Chi tiết dịch vụ sân bay
                                </button>
                            </div>

                            {/* Time Card */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl">
                                <div>
                                    <div className="flex items-center gap-2 mb-6 opacity-60">
                                        <Globe size={18} />
                                        <h4 className="text-xs font-black uppercase tracking-widest">Múi giờ địa phương</h4>
                                    </div>
                                    <div className="text-center py-4">
                                        <div className="text-5xl font-black italic tracking-tighter mb-1">
                                            {new Date(flightData.arrival?.scheduledTime?.local).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GIỜ TẠI ĐIỂM ĐẾN</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl text-center">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter italic">
                                        Vui lòng chỉnh lại đồng hồ khi hạ cánh
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Empty State / Initial */}
                {!flightData && !loading && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                            <Plane size={48} />
                        </div>
                        <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm mb-2 italic tracking-tighter">Hệ thống sẵn sàng</h3>
                        <p className="text-slate-300 text-xs font-medium">Nhập số hiệu chuyến bay để xem toàn bộ thông tin hành trình</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-4">
                    <span>Realtime API: AeroDataBox</span>
                    <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <span>Source: METAR / FIDS</span>
                </div>

            </div>
        </div>
    );
}