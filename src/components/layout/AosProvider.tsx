"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AosProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        AOS.init({
            offset: 10,
            delay: 0,
            duration: 600,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });
    }, []);

    return <>{children}</>;
};
