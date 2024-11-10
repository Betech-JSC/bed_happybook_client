import { AirportOption } from "@/types/flight";

const smoothScrollTo = (targetPosition: number, duration: number) => {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

const handleScrollSmooth = (ref: HTMLDivElement, timeScroll = 1000) => {
  const topOffset = ref.getBoundingClientRect().top + window.scrollY - 200;
  smoothScrollTo(topOffset, timeScroll);
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const generateMonth = (totalMonth: number) => {
  const currentDate = new Date();
  const months = [];

  for (let i = 0; i < totalMonth; i++) {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + i
    );
    months.push({
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    });
  }

  return months;
};
const getAirportsDefault = () => {
  const object = [
    {
      id: 1,
      country: "Việt Nam",
      airports: [
        { city: "Hà Nội", code: "HAN", type: "domestic" },
        { city: "Hồ Chí Minh", code: "SGN", type: "domestic" },
        { city: "Vinh", code: "VII", type: "domestic" },
        { city: "Huế", code: "HUI", type: "domestic" },
        { city: "Đà Lạt", code: "DLI", type: "domestic" },
        { city: "Phú Quốc", code: "PQC", type: "domestic" },
        { city: "Hải Phòng", code: "HBH", type: "domestic" },
        { city: "Đà Nẵng", code: "DAD", type: "domestic" },
        { city: "Buôn Mê Thuột", code: "BMV", type: "domestic" },
        { city: "Kiên Giang", code: "VKG", type: "domestic" },
        { city: "Cà Mau", code: "CAH", type: "domestic" },
        { city: "Côn Đảo", code: "VCS", type: "domestic" },
        { city: "Nha Trang", code: "CXR", type: "domestic" },
        { city: "Điện Biên Phủ", code: "DIN", type: "domestic" },
        { city: "Thanh Hóa", code: "THD", type: "domestic" },
        { city: "Quảng Bình", code: "VDH", type: "domestic" },
        { city: "Quảng Nam", code: "VCL", type: "domestic" },
        { city: "Cần Thơ", code: "VCA", type: "domestic" },
        { city: "Qui Nhơn", code: "UIH", type: "domestic" },
        { city: "Phú Yên", code: "TBB", type: "domestic" },
      ],
    },
    {
      id: 2,
      country: "Đông Nam Á",
      airports: [
        { city: "Bangkok", code: "BKK", type: "international" },
        { city: "Kuala Lumpur", code: "KUL", type: "international" },
        { city: "Phnom Penh", code: "PNH", type: "international" },
        { city: "Singapore", code: "SIN", type: "international" },
        { city: "Phuket", code: "HKT", type: "international" },
      ],
    },
    {
      id: 3,
      country: "Châu Á",
      airports: [
        { city: "Bắc Kinh", code: "PEK", type: "international" },
        { city: "Bangkok", code: "BKK", type: "international" },
        { city: "Busan", code: "PUS", type: "international" },
        { city: "Daegu", code: "TAE", type: "international" },
        { city: "Seoul", code: "ICN", type: "international" },
      ],
    },
    {
      id: 4,
      country: "Châu Âu",
      airports: [
        { city: "Amsterdam", code: "AMS", type: "international" },
        { city: "London", code: "LHR", type: "international" },
        { city: "Milan", code: "MXP", type: "international" },
        { city: "Paris", code: "CDG", type: "international" },
        { city: "Seoul", code: "ICN", type: "international" },
      ],
    },
    {
      id: 5,
      country: "Châu Úc",
      airports: [
        { city: "Sydney", code: "SYD", type: "international" },
        { city: "Perth", code: "PER", type: "international" },
      ],
    },
    {
      id: 6,
      country: "Châu Mỹ",
      airports: [
        { city: "Los Angeles", code: "LAX", type: "international" },
        { city: "Washington", code: "WAS", type: "international" },
        { city: "New York", code: "JFK", type: "international" },
        { city: "Miami", code: "MIA", type: "international" },
      ],
    },
  ];
  return object;
};
export {
  handleScrollSmooth,
  generateMonth,
  getDaysInMonth,
  getAirportsDefault,
};
