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
    },
    {
      label: "Hà Nội",
      value: "HAN",
    },
    {
      label: "Vinh",
      value: "VII",
    },
    {
      label: "Huế",
      value: "HUI",
    },
    {
      label: "Đà Lạt",
      value: "DLI",
    },
    {
      label: "Phú Quốc",
      value: "PQC",
    },
    {
      label: "Hải Phòng",
      value: "HBH",
    },
    {
      label: "Quảng Bình",
      value: "VDH",
    },
    {
      label: "Quảng Nam",
      value: "VCL",
    },
    {
      label: "Buôn Mê Thuột",
      value: "BMV",
    },
    {
      label: "Kiên Giang",
      value: "VKG",
    },
    {
      label: "Cà Mau",
      value: "CAH",
    },
    {
      label: "Côn Đảo",
      value: "VCS",
    },
    {
      label: "Điện Biên Phủ",
      value: "DIN",
    },
    {
      label: "Đà Nẵng",
      value: "DAD",
    },
    {
      label: "Cần Thơ",
      value: "VCA",
    },
    {
      label: "Nha Trang",
      value: "CXR",
    },
    {
      label: "Qui Nhơn",
      value: "UIH",
    },
    {
      label: "Phú Yên",
      value: "TBB",
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
