"use client";
import { Fragment, useEffect, useRef, useState } from "react";

export default function ContentByPage({ data }: any) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
      const computedStyle = window.getComputedStyle(contentRef.current);
      const singleLineHeight = parseFloat(computedStyle.lineHeight);
      setLineHeight(singleLineHeight);
    }
  }, [isExpanded]);
  return (
    <Fragment>
      <h3 className="text-2xl font-bold">{data.title ?? ""}</h3>
      <div
        ref={contentRef}
        className={`text-base mt-6 transition-[max-height] ease-in-out duration-500 overflow-hidden  `}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : `${lineHeight * 3}px`,
        }}
        dangerouslySetInnerHTML={{
          __html: data.content ?? "Nội dung đang cập nhật",
        }}
      ></div>
      <div
        className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <span className="font-medium group-hover:text-primary duration-300">
          {isExpanded ? "Ẩn bớt" : "Xem thêm"}
        </span>
        <button
          className={`duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
        >
          <svg
            className="group-hover:stroke-primary stroke-blue-700 duration-300"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
