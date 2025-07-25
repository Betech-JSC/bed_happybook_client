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
    if (!el) return;

    const style = window.getComputedStyle(el);
    const line = parseFloat(style.lineHeight || "24") + 12;
    setLineHeight(line);

    let debounceTimer: NodeJS.Timeout;
    let forceStopTimer: NodeJS.Timeout;
    let checkStableTimer: NodeJS.Timeout;
    let lastUpdate = performance.now();

    const measureHeight = () => {
      const updatedHeight = el.scrollHeight;
      setContentHeight(updatedHeight);
      setShowToggleButton(updatedHeight > line * 3);
    };

    const observer = new MutationObserver(() => {
      lastUpdate = performance.now();
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        measureHeight();
      }, 100);
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    checkStableTimer = setInterval(() => {
      if (performance.now() - lastUpdate > 2000) {
        observer.disconnect();
        clearInterval(checkStableTimer);
      }
    }, 500);

    forceStopTimer = setTimeout(() => {
      observer.disconnect();
      clearInterval(checkStableTimer);
    }, 10000);

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(forceStopTimer);
      clearInterval(checkStableTimer);
    };
  }, [data?.content]);

  return (
    <Fragment>
      {data.title && (
        <h3 className="mb-3 text-2xl font-bold" data-translate="true">
          {renderTextContent(data.title)}
        </h3>
      )}
      <div className="relative">
        <div
          ref={contentRef}
          className={`text-base transition-[max-height] ease-in-out duration-500 overflow-hidden  `}
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
