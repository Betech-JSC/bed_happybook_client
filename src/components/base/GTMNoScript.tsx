"use client";

import { useEffect } from "react";

export default function GTMNoScript() {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-T7CVWLJM";
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    document.body.prepend(iframe);
  }, []);

  return null;
}
