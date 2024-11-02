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
  const object: AirportOption[] = [
    {
      label: "Hồ Chí Minh",
      value: "SGN",
      type: "domestic",
    },
    {
      label: "Hà Nội",
      value: "HAN",
      type: "domestic",
    },
    {
      label: "Vinh",
      value: "VII",
      type: "domestic",
    },
    {
      label: "Huế",
      value: "HUI",
      type: "domestic",
    },
    {
      label: "Đà Lạt",
      value: "DLI",
      type: "domestic",
    },
    {
      label: "Phú Quốc",
      value: "PQC",
      type: "domestic",
    },
    {
      label: "Hải Phòng",
      value: "HBH",
      type: "domestic",
    },
    {
      label: "Quảng Bình",
      value: "VDH",
      type: "domestic",
    },
    {
      label: "Quảng Nam",
      value: "VCL",
      type: "domestic",
    },
    {
      label: "Buôn Mê Thuột",
      value: "BMV",
      type: "domestic",
    },
    {
      label: "Kiên Giang",
      value: "VKG",
      type: "domestic",
    },
    {
      label: "Cà Mau",
      value: "CAH",
      type: "domestic",
    },
    {
      label: "Côn Đảo",
      value: "VCS",
      type: "domestic",
    },
    {
      label: "Điện Biên Phủ",
      value: "DIN",
      type: "domestic",
    },
    {
      label: "Đà Nẵng",
      value: "DAD",
      type: "domestic",
    },
    {
      label: "Cần Thơ",
      value: "VCA",
      type: "domestic",
    },
    {
      label: "Nha Trang",
      value: "CXR",
      type: "domestic",
    },
    {
      label: "Qui Nhơn",
      value: "UIH",
      type: "domestic",
    },
    {
      label: "Phú Yên",
      value: "TBB",
      type: "domestic",
    },
    {
      label: "Bangkok",
      value: "BKK",
      type: "international",
    },
    {
      label: "Kuala Lumpur",
      value: "KUL",
      type: "international",
    },
    {
      label: "Singapore",
      value: "SIN",
      type: "international",
    },
    {
      label: "Bắc Kinh",
      value: "PEK",
      type: "international",
    },
    {
      label: "Busan",
      value: "PUS",
      type: "international",
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
