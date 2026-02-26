"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export const AosProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

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

        const observeElements = () => {
            const elements = document.querySelectorAll("[data-aos]:not(.aos-animate)");
            elements.forEach((el) => observer.observe(el));
        };

        // Initial observation
        observeElements();

        // Also observe DOM changes to catch dynamically loaded elements (e.g. from Suspense or dynamic imports)
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldObserve = false;
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length > 0) {
                    shouldObserve = true;
                    break;
                }
            }
            if (shouldObserve) {
                observeElements();
            }
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [pathname]);

    return <>{children}</>;
};
