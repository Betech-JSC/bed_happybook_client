const handleSessionStorage = (
  action: string,
  key: string | string[],
  value: any = null
) => {
  if (typeof window === "undefined") return;

  const handleKey = (singleKey: string) => {
    if (action === "save") {
      sessionStorage.setItem(singleKey, JSON.stringify(value));
    } else if (action === "remove") {
      sessionStorage.removeItem(singleKey);
    } else if (action === "get") {
      const item = sessionStorage.getItem(singleKey);
      return item ? JSON.parse(item) : null;
    } else {
      console.warn("Session error");
    }
  };

  if (action === "get") {
    if (typeof key === "string") {
      return handleKey(key);
    } else if (Array.isArray(key)) {
      return key.map(handleKey);
    } else {
      console.warn("Session error.");
      return null;
    }
  } else {
    if (typeof key === "string") {
      handleKey(key);
    } else if (Array.isArray(key)) {
      key.forEach(handleKey);
    } else {
      console.warn("Session error.");
    }
  }
};

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
const buildSearch = (params: {
  [key: string]: string | number | boolean | Array<any>;
}) => {
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            search.append(key, item.toString());
          });
        } else {
          search.set(key, value.toString());
        }
      }
    }
    return `?${search.toString()}`;
  }
};

const cloneItemsCarousel = (items: any[], minItems: number) => {
  if (items.length >= minItems) return items;

  const clonesNeeded = minItems - items.length;
  return [
    ...items,
    ...Array.from({ length: clonesNeeded }, (_, i) => ({
      ...items[i % items.length],
      id: `clone-${i}`,
    })),
  ];
};

const getDayLabel = (dayIndex: number, displayType: "desktop" | "mobile") => {
  const daysOfWeek =
    displayType === "desktop"
      ? ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
      : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return daysOfWeek[dayIndex] || "Không xác định";
};
const calculatorDiscountPercent = (
  discountPrice: number,
  totalPrice: number
) => {
  if (!discountPrice && !totalPrice) return "0%";
  return Math.round((discountPrice / totalPrice) * 100) + "%";
};
export {
  buildSearch,
  cloneItemsCarousel,
  handleSessionStorage,
  handleScrollSmooth,
  generateMonth,
  getDaysInMonth,
  getDayLabel,
  calculatorDiscountPercent,
};
