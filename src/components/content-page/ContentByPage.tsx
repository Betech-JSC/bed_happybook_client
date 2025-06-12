"use client";
import { renderTextContent } from "@/utils/Helper";
import { Fragment, useEffect, useRef, useState } from "react";
import DisplayContentEditor from "../base/DisplayContentEditor";

export default function ContentByPage({ data }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(24);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      const style = window.getComputedStyle(el);
      const line = parseFloat(style.lineHeight || "24") + 12;
      const fullHeight = el.scrollHeight;

      setLineHeight(line);
      setContentHeight(fullHeight);

      const timeout = setTimeout(() => {
        const updatedHeight = el.scrollHeight;
        setContentHeight(updatedHeight);
        setShowToggleButton(updatedHeight > line * 3);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [data?.content]);

  return (
    <Fragment>
      {data.title && (
        <h3 className="text-2xl font-bold" data-translate="true">
          {renderTextContent(data.title)}
        </h3>
      )}
      <div className="relative">
        <div
          ref={contentRef}
          className={`text-base mt-3 transition-[max-height] ease-in-out duration-500 overflow-hidden  `}
          style={{
            maxHeight: isExpanded
              ? `${contentHeight}px`
              : `${lineHeight * 3}px`,
          }}
        >
          <DisplayContentEditor content={data?.content} />
        </div>
        {/* {!isExpanded && showToggleButton && (
          <div className="absolute bottom-0 left-0 w-full h-10 md:h-14 bg-gradient-to-t from-white pointer-events-none" />
        )} */}
      </div>
      {showToggleButton && (
        <div
          className="flex group mt-4 space-x-2 text-blue-700 mx-auto justify-center items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span
            className="font-medium group-hover:text-primary duration-300"
            data-translate="true"
          >
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
      )}
    </Fragment>
  );
}
