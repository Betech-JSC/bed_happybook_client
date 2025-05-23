import { arrLanguages } from "@/constants/language";
import { labelsRating } from "@/constants/product";
import _ from "lodash";

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

const getLabelRatingProduct = (rating: number, lang?: string) => {
  if (!rating) return;
  if (lang && lang !== "vi") {
    if (rating <= 2) return "Bad";
    if (rating > 2 && rating <= 4) return "Not satisfied";
    if (rating > 4 && rating <= 6) return "Normal";
    if (rating > 6 && rating <= 8) return "Satisfied";
    if (rating > 8 && rating <= 10) return "Excellent";
  }
  if (rating <= 2) return labelsRating[0];
  if (rating > 2 && rating <= 4) return labelsRating[1];
  if (rating > 4 && rating <= 6) return labelsRating[2];
  if (rating > 6 && rating <= 8) return labelsRating[3];
  if (rating > 8 && rating <= 10) return labelsRating[4];
  return "";
};

const getCurrentLanguage = () => {
  const locale =
    typeof window !== "undefined"
      ? localStorage.getItem("language") ?? "vi"
      : "vi";
  return arrLanguages.includes(locale) ? locale : "vi";
};

const renderTextContent = (content: any) => {
  return !_.isEmpty(content) ? content : "Nội dung đang cập nhật...!";
};

const renderTextContentArray = (content: any) => {
  return !_.isEmpty(content)
    ? `- ` + content.map((item: any) => renderTextContent(item)).join("<br /> - ")
    : "Nội dung đang cập nhật...!";
};

function decodeHtml(html: string): string {
  if (typeof document === 'undefined') {
    // Server-side fallback - basic HTML entity decoding
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
  
  // Client-side implementation
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  const decoded = textarea.value;
  textarea.remove();
  return decoded;
}

const toSnakeCase = (str: string) =>
  _.snakeCase(
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
  );

export {
  decodeHtml,
  buildSearch,
  cloneItemsCarousel,
  handleSessionStorage,
  handleScrollSmooth,
  generateMonth,
  getDaysInMonth,
  getDayLabel,
  calculatorDiscountPercent,
  getLabelRatingProduct,
  getCurrentLanguage,
  renderTextContent,
  renderTextContentArray,
  toSnakeCase,
};
