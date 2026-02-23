"use client";

import React, { useEffect } from "react";

export const AosProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Use native IntersectionObserver instead of the heavy AOS library
        // to eliminate the JS parsing/execution overhead that hurts TBT
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("aos-animate");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
        );

        // Observe all elements that have data-aos attribute
        const elements = document.querySelectorAll("[data-aos]");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return <>{children}</>;
};
