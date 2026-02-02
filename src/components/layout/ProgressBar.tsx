"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "@/styles/ProgressBar.scss";

function isSameURL(target: URL, current: URL): boolean {
  return (
    target.protocol === current.protocol &&
    target.host === current.host &&
    target.pathname === current.pathname &&
    target.search === current.search
  );
}

function getAnchorHref(anchor: HTMLAnchorElement): string {
  const href = anchor.getAttribute("href");
  if (!href) return "";
  if (href.startsWith("/")) {
    return `${location.origin}${href}`;
  }
  return href;
}

function isValidNavigationLink(anchor: HTMLAnchorElement): boolean {
  const href = getAnchorHref(anchor);
  if (
    !href ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("javascript:") ||
    href.startsWith("blob:")
  ) {
    return false;
  }
  if (anchor.getAttribute("target") === "_blank") return false;
  if (anchor.getAttribute("data-prevent-nprogress") === "true") return false;
  try {
    const targetUrl = new URL(href, location.origin);
    return targetUrl.origin === location.origin;
  } catch {
    return false;
  }
}

function findClosestAnchor(element: EventTarget | null): HTMLAnchorElement | null {
  let el = element as HTMLElement | null;
  while (el && el.tagName !== "A") {
    if (el.getAttribute?.("data-prevent-nprogress") === "true") return null;
    el = el.parentElement;
  }
  return el?.tagName === "A" ? (el as HTMLAnchorElement) : null;
}

export interface ProgressBarProps {
  color?: string;
  height?: string;
  delay?: number;
  disableSameURL?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  color = "#0A2FFF",
  height = "2px",
  delay = 0,
  disableSameURL = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (doneRef.current) {
      clearTimeout(doneRef.current);
      doneRef.current = null;
    }
    setProgress(0);
    setIsLoading(true);

    trickleRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (1 - prev) * (0.02 + Math.random() * 0.08);
        if (next >= 0.9) {
          if (trickleRef.current) {
            clearInterval(trickleRef.current);
            trickleRef.current = null;
          }
          return 0.9;
        }
        return next;
      });
    }, 100);
  }, []);

  const done = useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (doneRef.current) {
      clearTimeout(doneRef.current);
      doneRef.current = null;
    }
    setProgress(100);
    doneRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      doneRef.current = null;
    }, 300);
  }, []);

  const handleAnchorClick = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = findClosestAnchor(event.target);
      if (!anchor || !isValidNavigationLink(anchor)) return;

      const targetHref = getAnchorHref(anchor);
      const targetUrl = new URL(targetHref, location.origin);
      const currentUrl = new URL(location.href);

      if (disableSameURL && isSameURL(targetUrl, currentUrl)) return;

      if (delay > 0) {
        delayRef.current = setTimeout(() => {
          delayRef.current = null;
          start();
        }, delay);
      } else {
        start();
      }
    },
    [delay, disableSameURL, start]
  );

  useEffect(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    done();
  }, [pathname, searchParams, done]);

  useEffect(() => {
    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      if (delayRef.current) clearTimeout(delayRef.current);
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (doneRef.current) clearTimeout(doneRef.current);
    };
  }, [handleAnchorClick]);

  if (!isLoading) return null;

  return (
    <div
      id="progress-bar"
      className="progress-bar"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="progress-bar__bar"
        style={{
          width: `${progress}%`,
          height,
          backgroundColor: color,
        }}
      >
        <div
          className="progress-bar__peg"
          style={{
            boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
