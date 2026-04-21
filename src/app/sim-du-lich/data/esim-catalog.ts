export interface EsimVariant {
  sku: string;
  data: string;
  validity: number;
  price: number;
  desc: string;
}

export interface EsimPackage {
  id: string;
  destination: string;
  region: string;
  title: string;
  subtitle: string;
  coverage: string;
  network: string;
  activation: string;
  note: string;
  variants: EsimVariant[];
}

export const catalog: EsimPackage[] = [
  {
    id: "vn-local-mobifone",
    destination: "Việt Nam",
    region: "Domestic",
    title: "Vietnam Local/Mobifone",
    subtitle: "Có gói data + voice",
    coverage: "Việt Nam",
    network: "MobiFone",
    activation: "Tính từ lúc kết nối với nhà mạng hỗ trợ",
    note: "Phù hợp khách cần data và một số gói có kèm phút gọi nội mạng.",
    variants: [
      { sku: "GIGA-VNAS-T15GB-07", data: "15GB", validity: 7, price: 85000, desc: "15GB / 7 ngày" },
      { sku: "GIGA-VNAS-D3GB-10", data: "Daily 3GB", validity: 10, price: 115000, desc: "3GB/ngày / 10 ngày" },
      { sku: "GIGA-VNAS-D3GBV-15", data: "Daily 3GB + Voice", validity: 15, price: 135000, desc: "3GB/ngày / 15 ngày + 30 phút nội mạng" },
      { sku: "GIGA-VNAS-D6GBV-30", data: "Daily 6GB + Voice", validity: 30, price: 209000, desc: "6GB/ngày / 30 ngày + 500 phút nội mạng" },
    ],
  },
  {
    id: "vn-skyfi",
    destination: "Việt Nam",
    region: "Domestic",
    title: "Vietnam Skyfi Mobifone",
    subtitle: "Data-only, không có số điện thoại",
    coverage: "Việt Nam",
    network: "MobiFone / Skyfi",
    activation: "Tính từ lúc kết nối với nhà mạng hỗ trợ",
    note: "Gói data dung lượng cao, thích hợp khách chỉ cần internet.",
    variants: [
      { sku: "GIGA-VNSF-D7GB-07", data: "Daily 7GB", validity: 7, price: 85000, desc: "7GB/ngày / 7 ngày" },
      { sku: "GIGA-VNSF-D7GB-10", data: "Daily 7GB", validity: 10, price: 89000, desc: "7GB/ngày / 10 ngày" },
      { sku: "GIGA-VNSF-D7GB-15", data: "Daily 7GB", validity: 15, price: 105000, desc: "7GB/ngày / 15 ngày" },
      { sku: "GIGA-VNSF-D7GB-31", data: "Daily 7GB", validity: 31, price: 125000, desc: "7GB/ngày / 31 ngày" },
    ],
  },
  {
    id: "china",
    destination: "Trung Quốc",
    region: "Asia",
    title: "China",
    subtitle: "Phổ biến cho khách đi công tác, du lịch",
    coverage: "Trung Quốc",
    network: "China Mobile",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Hỗ trợ Zalo, YouTube, Google, Facebook; không hỗ trợ TikTok, ChatGPT.",
    variants: [
      { sku: "GIGA-CN-D1GB-03", data: "Daily 1GB", validity: 3, price: 149000, desc: "1GB/ngày / 3 ngày" },
      { sku: "GIGA-CN-D2GB-05", data: "Daily 2GB", validity: 5, price: 359000, desc: "2GB/ngày / 5 ngày" },
      { sku: "GIGA-CN-D3GB-07", data: "Daily 3GB", validity: 7, price: 599000, desc: "3GB/ngày / 7 ngày" },
      { sku: "GIGA-CN-D1GB-15", data: "Daily 1GB", validity: 15, price: 659000, desc: "1GB/ngày / 15 ngày" },
    ],
  },
  {
    id: "japan",
    destination: "Nhật Bản",
    region: "Asia",
    title: "Japan",
    subtitle: "Có gói daily và unlimited",
    coverage: "Nhật Bản",
    network: "Softbank, Docomo, Rakuten Mobile",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Gói unlimited có 1GB tốc độ cao/ngày + data không giới hạn tốc độ thấp.",
    variants: [
      { sku: "GIGA-JP-D500MB-03", data: "Daily 500MB", validity: 3, price: 89000, desc: "500MB/ngày / 3 ngày" },
      { sku: "GIGA-JP-D1GB-05", data: "Daily 1GB", validity: 5, price: 165000, desc: "1GB/ngày / 5 ngày" },
      { sku: "GIGA-JP-D2GB-07", data: "Daily 2GB", validity: 7, price: 299000, desc: "2GB/ngày / 7 ngày" },
      { sku: "GIGA-JP-UV-05", data: "Unlimited", validity: 5, price: 249000, desc: "Unlimited / 5 ngày" },
    ],
  },
  {
    id: "korea",
    destination: "Hàn Quốc",
    region: "Asia",
    title: "Korea",
    subtitle: "Giá khởi điểm thấp, dễ bán",
    coverage: "Hàn Quốc",
    network: "LG, SK Telecom",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Có các gói daily và unlimited.",
    variants: [
      { sku: "GIGA-KR-D500MB-03", data: "Daily 500MB", validity: 3, price: 79000, desc: "500MB/ngày / 3 ngày" },
      { sku: "GIGA-KR-D1GB-05", data: "Daily 1GB", validity: 5, price: 149000, desc: "1GB/ngày / 5 ngày" },
      { sku: "GIGA-KR-D2GB-07", data: "Daily 2GB", validity: 7, price: 279000, desc: "2GB/ngày / 7 ngày" },
      { sku: "GIGA-KR-UV-05", data: "Unlimited", validity: 5, price: 219000, desc: "Unlimited / 5 ngày" },
    ],
  },
  {
    id: "thailand-dtac",
    destination: "Thái Lan",
    region: "Asia",
    title: "Thailand DTAC",
    subtitle: "Có số điện thoại Thái ở một số gói",
    coverage: "Thái Lan",
    network: "DTAC",
    activation: "Tính từ thời điểm cài đặt",
    note: "Chỉ được cài tại Thái Lan. Có gói kèm số điện thoại để nhận cuộc gọi.",
    variants: [
      { sku: "GIGA-THDTAC-T15GB-07", data: "15GB", validity: 7, price: 155000, desc: "15GB / 7 ngày" },
      { sku: "GIGA-THDTAC-UV-08PR", data: "Unlimited", validity: 8, price: 240000, desc: "Unlimited / 8 ngày + số Thái" },
      { sku: "GIGA-THDTAC-T50GB-10", data: "50GB", validity: 10, price: 219000, desc: "50GB / 10 ngày" },
      { sku: "GIGA-THDTAC-UV-15", data: "Unlimited", validity: 15, price: 499000, desc: "Unlimited / 15 ngày + gọi nội địa" },
    ],
  },
  {
    id: "asia4",
    destination: "Singapore, Malaysia, Indonesia, Thái Lan",
    region: "Regional",
    title: "Asia 4",
    subtitle: "1 eSIM dùng cho 4 nước",
    coverage: "Singapore, Malaysia, Indonesia, Thái Lan",
    network: "Simba, Starhub, Digi, Celcom, AIS, TrueMove, Telkomsel, XL",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Phù hợp khách đi tour liên tuyến Đông Nam Á.",
    variants: [
      { sku: "GIGA-SMIT-D500MB-03", data: "Daily 500MB", validity: 3, price: 74000, desc: "500MB/ngày / 3 ngày" },
      { sku: "GIGA-SMIT-D1GB-05", data: "Daily 1GB", validity: 5, price: 139000, desc: "1GB/ngày / 5 ngày" },
      { sku: "GIGA-SMIT-D2GB-07", data: "Daily 2GB", validity: 7, price: 259000, desc: "2GB/ngày / 7 ngày" },
      { sku: "GIGA-SMIT-UV-10", data: "Unlimited", validity: 10, price: 369000, desc: "Unlimited / 10 ngày" },
    ],
  },
  {
    id: "greater-china",
    destination: "Trung Quốc, Hồng Kông, Ma Cao",
    region: "Regional",
    title: "Greater China",
    subtitle: "1 eSIM cho 3 điểm đến",
    coverage: "Trung Quốc, Hồng Kông, Ma Cao",
    network: "China Unicom, China Telecom, CSL, CTM",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Phù hợp khách đi combo Trung Quốc - Hong Kong - Macau.",
    variants: [
      { sku: "GIGA-CHM-D500MB-03", data: "Daily 500MB", validity: 3, price: 153000, desc: "500MB/ngày / 3 ngày" },
      { sku: "GIGA-CHM-D1GB-05", data: "Daily 1GB", validity: 5, price: 319000, desc: "1GB/ngày / 5 ngày" },
      { sku: "GIGA-CHM-D2GB-07", data: "Daily 2GB", validity: 7, price: 569000, desc: "2GB/ngày / 7 ngày" },
      { sku: "GIGA-CHM-UV-10", data: "Unlimited", validity: 10, price: 669000, desc: "Unlimited / 10 ngày" },
    ],
  },
  {
    id: "usa-data",
    destination: "Hoa Kỳ",
    region: "America",
    title: "USA Data",
    subtitle: "Phù hợp khách chỉ đi Mỹ",
    coverage: "Hoa Kỳ",
    network: "T-Mobile, Verizon",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Có gói unlimited.",
    variants: [
      { sku: "GIGA-US-D2GB-01", data: "Daily 2GB", validity: 1, price: 75000, desc: "2GB/ngày / 1 ngày" },
      { sku: "GIGA-US-D2GB-05", data: "Daily 2GB", validity: 5, price: 319000, desc: "2GB/ngày / 5 ngày" },
      { sku: "GIGA-US-D1GB-15", data: "Daily 1GB", validity: 15, price: 425000, desc: "1GB/ngày / 15 ngày" },
      { sku: "GIGA-US-UV-10", data: "Unlimited", validity: 10, price: 559000, desc: "Unlimited / 10 ngày" },
    ],
  },
  {
    id: "usa-canada",
    destination: "Hoa Kỳ, Canada",
    region: "America",
    title: "USA & Canada",
    subtitle: "1 eSIM dùng xuyên 2 nước",
    coverage: "Hoa Kỳ, Canada",
    network: "Rogers Wireless, T-Mobile",
    activation: "1 ngày tính đến 23:59 giờ Trung Quốc (GMT+8)",
    note: "Hỗ trợ phát wifi. Hợp khách công tác hoặc roadtrip Bắc Mỹ.",
    variants: [
      { sku: "GIGA-AC-D1GB-03", data: "Daily 1GB", validity: 3, price: 225000, desc: "1GB/ngày / 3 ngày" },
      { sku: "GIGA-AC-D2GB-05", data: "Daily 2GB", validity: 5, price: 449000, desc: "2GB/ngày / 5 ngày" },
      { sku: "GIGA-AC-D1GB-07", data: "Daily 1GB", validity: 7, price: 489000, desc: "1GB/ngày / 7 ngày" },
      { sku: "GIGA-AC-UV-10", data: "Unlimited", validity: 10, price: 699000, desc: "Unlimited / 10 ngày" },
    ],
  },
  {
    id: "eu-33",
    destination: "Châu Âu 33 nước",
    region: "Europe",
    title: "EU 33 countries",
    subtitle: "Phù hợp khách Schengen/Eurotrip",
    coverage: "Áo, Bỉ, Bulgaria, Croatia, Síp, Séc, Đan Mạch, Estonia, Phần Lan, Pháp, Đức, Hy Lạp, Hungary, Iceland, Ý, Liechtenstein, Lithuania, Luxembourg, Malta, Moldova, Hà Lan, Na Uy, Bồ Đào Nha, Romania, San Marino, Slovakia, Slovenia, Tây Ban Nha, Thụy Điển, Thổ Nhĩ Kỳ, Ukraina, Anh, Vatican",
    network: "Nhiều nhà mạng theo từng quốc gia",
    activation: "1 ngày = 24 giờ",
    note: "Hỗ trợ phát wifi. Hợp khách đi nhiều nước châu Âu trong 1 chuyến.",
    variants: [
      { sku: "GIGA-EU33-D1GB-03", data: "Daily 1GB", validity: 3, price: 153000, desc: "1GB/ngày / 3 ngày" },
      { sku: "GIGA-EU33-D1GB-05", data: "Daily 1GB", validity: 5, price: 242000, desc: "1GB/ngày / 5 ngày" },
      { sku: "GIGA-EU33-D2GB-07", data: "Daily 2GB", validity: 7, price: 469000, desc: "2GB/ngày / 7 ngày" },
      { sku: "GIGA-EU33-UV-10", data: "Unlimited", validity: 10, price: 619000, desc: "Unlimited / 10 ngày" },
    ],
  },
];

export const regions = ["Tất cả", "Domestic", "Asia", "Regional", "Europe", "America"];

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "Chưa chọn";
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};
